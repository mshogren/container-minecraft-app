import logging
from functools import cache
from typing import List

import docker
import strawberry
from docker.models.containers import Container
from packaging import version as version_parser
from pydantic import BaseModel
from modpack import Modpack, ModpackError
from settings import Settings
from version import Version

from .image import Image
from .model import ContainerDetailsModel, EnvironmentModel, TypeEnum
from .port import Port
from .schema import (AddCurseforgeServerInput, AddServerError,
                     AddServerResponse, AddServerSuccess,
                     AddVanillaServerInput, ServerSchemaType)
from .volume import Volume


class DockerModel(BaseModel):
    name: str
    image: str = Settings().default_image
    detach: bool = True
    ports: dict = {"25565/tcp": None}
    volumes: List[str]
    labels: dict = {}
    environment: List[str] = ["EULA=TRUE"]


@cache
def get_client():
    return docker.from_env()


def is_container_relevant(container: Container, image_name: str) -> bool:
    return (bool(container)
            and hasattr(container, "image")
            and str(container.image).find(f"'{image_name}:") > -1)


def parse_container_environment(environment: str) -> EnvironmentModel:
    env_dict = dict((key, value)
                    for key, value in (element.split("=")
                                       for element in environment))
    return EnvironmentModel(**env_dict)


def get_image_tag_for_version(version: str) -> bool:
    if version_parser.parse(version) < version_parser.parse("1.17"):
        return ":java8-multiarch"
    return ""


def add_server(model) -> AddServerResponse:
    try:
        container = get_client().containers.run(**model.dict())
        server = Server.get_server(container.id)
        return AddServerSuccess(server)
    except docker.errors.APIError as ex:
        return AddServerError(error=str(ex))


class Server:
    @staticmethod
    def get_server(container_id: strawberry.ID) -> ServerSchemaType:
        container_details = get_client().api.inspect_container(container_id)
        container_model = ContainerDetailsModel(**container_details)
        container_environment = parse_container_environment(
            container_model.Configuration.Env)
        return ServerSchemaType(
            id=container_id,
            name=container_model.Name[1:],
            image=Image(container_model.Configuration.Image),
            ports=[Port(key, value)
                   for(key, value) in
                   container_model.NetworkSettings.Ports.items()],
            volumes=[Volume(x) for x in container_model.Mounts],
            created=container_model.Created,
            started=container_model.State.StartedAt,
            status=container_model.State.Status,
            type=container_environment.type,
            game_version=container_environment.version)

    @staticmethod
    def get_servers() -> List[ServerSchemaType]:
        default_image = Settings().default_image
        containers = get_client().containers.list(all=True)
        container_ids = [x.id for x in containers
                         if is_container_relevant(x, default_image)]
        return [Server.get_server(x) for x in container_ids]

    @staticmethod
    def add_vanilla_server(server: AddVanillaServerInput) -> AddServerResponse:
        logging.info('%s', server)

        name = server.name
        server_type = TypeEnum.VANILLA
        version = server.version

        if version not in Version.get_versions():
            return AddServerError("Version: {version} does not exist")

        model = DockerModel(**{
            "name": name,
            "volumes": [name + ":/data"]
        })

        model.image += get_image_tag_for_version(version)

        model.environment.extend([f"TYPE={server_type}", f"VERSION={version}"])

        return add_server(model)

    @staticmethod
    def add_curseforge_server(
            server: AddCurseforgeServerInput) -> AddServerResponse:
        logging.info('%s', server)

        name = server.name
        server_type = TypeEnum.CURSEFORGE

        try:
            modpack = Modpack.get_modpack(server.modpack_id)
            modpack_file = Modpack.get_modpack_file(modpack)
        except ModpackError as error:
            return AddServerError(error)

        version = modpack.version

        if version not in Version.get_versions():
            return AddServerError(f"Version: {version} does not exist")

        model = DockerModel(**{
            "name": name,
            "volumes": [name + ":/data"]
        })

        model.image += get_image_tag_for_version(version)

        model.environment.extend([
            f"TYPE={server_type}",
            f"VERSION={version}",
            f"CF_SERVER_MOD={modpack_file}"])

        return add_server(model)
