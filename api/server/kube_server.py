from typing import List, Optional

import strawberry
from kubernetes import client, config
from kubernetes.client import ApiException
from server import AbstractServer, NonMinecraftServerError, ServerModel
from settings import Settings

from .image import Image
from .model import EnvironmentModel, TypeEnum
from .schema import (ServerError, ServerResponse, ServerSchemaType,
                     ServerSuccess)

NAMESPACE = Settings().kubernetes_namespace
config.load_config()
apps = client.AppsV1Api()


def is_container_relevant(
        deployment,
        image_name: Optional[str]) -> bool:
    return (bool(container := deployment.spec.template.spec.containers[0])
            and hasattr(container, "image")
            and str(container.image).find(f"{image_name}") > -1)


def parse_container_environment(
        environment: Optional[List[client.V1EnvVar]]) -> EnvironmentModel:
    if environment is None:
        return EnvironmentModel(TYPE=TypeEnum.VANILLA)
    env_dict = dict((e.name, e.value) for e in environment)
    return EnvironmentModel(**env_dict)  # type: ignore


def parse_deployment(deployment) -> ServerSchemaType:
    metadata = deployment.metadata
    status = deployment.status
    container = deployment.spec.template.spec.containers[0]
    container_environment = parse_container_environment(container.env)
    return ServerSchemaType(
        id=metadata.name, name=metadata.name, image=Image(container.image),
        ports=[],
        volumes=[],
        created=metadata.creation_timestamp,
        started=next(
            (x.last_transition_time
             for x in (status.conditions if status.conditions else [])
             if x.type == "Available"),
            metadata.creation_timestamp),
        status="Available" if status.available_replicas else "Unavailable",
        type=container_environment.type,
        game_version=container_environment.version)


class KubernetesServer(AbstractServer):
    def get_server(self, container_id: strawberry.ID) -> ServerSchemaType:
        response = apps.read_namespaced_deployment(
            name=container_id, namespace=NAMESPACE)
        if not is_container_relevant(response, Settings().default_image):
            raise NonMinecraftServerError(
                "The container is not a Minecraft server")
        return parse_deployment(response)

    def get_servers(self) -> List[ServerSchemaType]:
        response = apps.list_namespaced_deployment(namespace=NAMESPACE)
        return [parse_deployment(x) for x in response.items
                if is_container_relevant(x, Settings().default_image)]

    def add_server(self, model: ServerModel) -> ServerResponse:
        try:
            container = client.V1Container(
                name="minecraft-server", image=model.image,
                ports=[client.V1ContainerPort(container_port=25565)],
                env=[{"name": x, "value": model.env[x]}
                     for x in model.env.keys()])
            template = client.V1PodTemplateSpec(
                metadata=client.V1ObjectMeta(labels={"app": model.name}),
                spec=client.V1PodSpec(containers=[container]),
            )
            spec = client.V1DeploymentSpec(
                replicas=1, template=template, selector={
                    "matchLabels":
                    {"app": model.name}})
            deployment = client.V1Deployment(
                api_version="apps/v1",
                kind="Deployment",
                metadata=client.V1ObjectMeta(name=model.name),
                spec=spec
            )
            apps.create_namespaced_deployment(
                namespace=NAMESPACE,
                body=deployment)
            return ServerSuccess(server=self.get_server(
                strawberry.ID(model.name)))
        except NonMinecraftServerError as ex:
            return ServerError(error=str(ex))
        except ApiException as ex:
            return ServerError(error=str(ex))

    def patch_deployment_replicas(
            self, container_id: strawberry.ID, replicas: int) -> ServerResponse:
        try:
            deployment = apps.read_namespaced_deployment(
                name=container_id, namespace=NAMESPACE)
            deployment.spec.replicas = replicas  # type: ignore
            apps.patch_namespaced_deployment(
                name=container_id, namespace=NAMESPACE, body=deployment)
            return ServerSuccess(server=self.get_server(container_id))
        except NonMinecraftServerError as ex:
            return ServerError(error=str(ex))
        except ApiException as ex:
            return ServerError(error=str(ex))

    def start_server(self, container_id: strawberry.ID) -> ServerResponse:
        return self.patch_deployment_replicas(container_id, 1)

    def stop_server(self, container_id: strawberry.ID) -> ServerResponse:
        return self.patch_deployment_replicas(container_id, 0)
