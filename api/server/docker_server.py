from functools import cache
from typing import List, Optional

import docker
import strawberry
from docker.errors import APIError
from docker.models.containers import Container
from server import (OWNER_NAME_LABEL_NAME, AbstractServer,
                    NonMinecraftServerError, ServerModel, check_owner)
from settings import Settings

from .image import Image
from .model import ContainerDetailsModel, EnvironmentModel, StatusEnum
from .port import Port
from .schema import (ServerError, ServerResponse, ServerSchemaType,
                     ServerSuccess)
from .volume import Volume


@cache
def get_client():
    return docker.from_env()


def is_container_relevant(
        container: Optional[Container],
        image_name: Optional[str]) -> bool:
    return (bool(container)
            and hasattr(container, "image")
            and str(container.image).find(f"'{image_name}:") > -1)


def parse_container_environment(environment: List[str]) -> EnvironmentModel:
    env_dict = dict((key, value)
                    for key, value in (element.split("=")
                                       for element in environment))
    return EnvironmentModel(**env_dict)  # type: ignore


def get_server_by_id(container_id) -> Container:
    container: Container = get_client().containers.get(container_id)  # type: ignore
    if not is_container_relevant(container, Settings().default_image):
        raise NonMinecraftServerError(
            "The container is not a Minecraft server")
    return container


class DockerServer(AbstractServer):
    def get_server(self, container_id: strawberry.ID) -> ServerSchemaType:
        container = get_server_by_id(container_id)
        container_details = get_client().api.inspect_container(container.id)
        container_model = ContainerDetailsModel(**container_details)
        container_environment = parse_container_environment(
            container_model.Configuration.Env)
        return ServerSchemaType(
            id=container_id,
            name=container_model.Name[1:],
            owner=container_model.Configuration.Labels.get(OWNER_NAME_LABEL_NAME, ""),
            image=Image(container_model.Configuration.Image),
            ports=[Port(key, value)
                   for (key, value) in
                   container_model.NetworkSettings.Ports.items()],
            volumes=[Volume(x) for x in container_model.Mounts],
            created=container_model.Created,
            started=container_model.State.StartedAt,
            status=StatusEnum.AVAILABLE
            if container_model.State.Status == "running" else StatusEnum.UNAVAILABLE,
            type=container_environment.type,
            game_version=container_environment.version)

    def get_servers(self) -> List[ServerSchemaType]:
        default_image = Settings().default_image
        containers: List[Container] = get_client(
        ).containers.list(all=True)  # type: ignore
        container_ids = [str(x.id) for x in containers
                         if is_container_relevant(x, default_image)]
        return [self.get_server(strawberry.ID(x)) for x in container_ids]

    def add_server(self, model: ServerModel) -> ServerResponse:
        try:
            if self.user:
                model.labels |= self.user.get_labels()
            args = model.dict()
            env = args.pop("env")
            args["environment"] = [f"{x}={env[x]}" for x in env.keys()]
            container: Container = get_client().containers.run(**args)  # type: ignore
            server = self.get_server(strawberry.ID(str(container.id)))
            return ServerSuccess(server=server)
        except NonMinecraftServerError as ex:
            return ServerError(error=str(ex))
        except APIError as ex:
            return ServerError(error=str(ex))

    def start_server(self, container_id: strawberry.ID) -> ServerResponse:
        try:
            container = get_server_by_id(container_id)
            if not check_owner(container.labels, self.user):
                return ServerError(
                    error="The Minecraft server is not owned by the current user")
            container.start()
            server = self.get_server(strawberry.ID(str(container.id)))
            return ServerSuccess(server=server)
        except NonMinecraftServerError as ex:
            return ServerError(error=str(ex))
        except APIError as ex:
            return ServerError(error=str(ex))

    def stop_server(self, container_id: strawberry.ID) -> ServerResponse:
        try:
            container = get_server_by_id(container_id)
            if not check_owner(container.labels, self.user):
                return ServerError(
                    error="The Minecraft server is not owned by the current user")
            container.stop()
            server = self.get_server(strawberry.ID(str(container.id)))
            return ServerSuccess(server=server)
        except NonMinecraftServerError as ex:
            return ServerError(error=str(ex))
        except APIError as ex:
            return ServerError(error=str(ex))
