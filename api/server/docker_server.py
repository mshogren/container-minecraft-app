import logging
from functools import cache
from typing import List, Optional

import docker
import strawberry
from docker.errors import APIError
from docker.models.containers import Container
from packaging import version as version_parser
from pydantic import BaseModel
from modpack import Modpack, ModpackError
from settings import Settings
from version import Version

from .abstract_server import AbstractServer
from .image import Image
from .model import ContainerDetailsModel, EnvironmentModel, TypeEnum
from .port import Port
from .schema import (AddCurseforgeServerInput, AddVanillaServerInput,
                     ServerError, ServerResponse, ServerSchemaType,
                     ServerSuccess)
from .volume import Volume


class NonMinecraftServerError(Exception):
    pass


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


def get_image_tag_for_version(version: str) -> str:
    if version_parser.parse(version) < version_parser.parse("1.17"):
        return ":java8-multiarch"
    return ""


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
            image=Image(container_model.Configuration.Image),
            ports=[Port(key, value)
                   for (key, value) in
                   container_model.NetworkSettings.Ports.items()],
            volumes=[Volume(x) for x in container_model.Mounts],
            created=container_model.Created,
            started=container_model.State.StartedAt,
            status=container_model.State.Status,
            type=container_environment.type,
            game_version=container_environment.version)

    def get_servers(self) -> List[ServerSchemaType]:
        default_image = Settings().default_image
        containers: List[Container] = get_client(
        ).containers.list(all=True)  # type: ignore
        container_ids = [str(x.id) for x in containers
                         if is_container_relevant(x, default_image)]
        return [self.get_server(strawberry.ID(x)) for x in container_ids]

    def add_server(self, model) -> ServerResponse:
        try:
            container: Container = get_client().containers.run(**model.dict())  # type: ignore
            server = self.get_server(strawberry.ID(str(container.id)))
            return ServerSuccess(server=server)
        except NonMinecraftServerError as ex:
            return ServerError(error=str(ex))
        except APIError as ex:
            return ServerError(error=str(ex))

    def add_vanilla_server(self,
                           server: AddVanillaServerInput) -> ServerResponse:
        logging.info('%s', server)

        name = server.name
        server_type = TypeEnum.VANILLA.name
        version = server.version

        if version not in Version().get_versions():
            return ServerError(error=f"Version: {version} does not exist")

        model = DockerModel(**{
            "name": name,
            "volumes": [name + ":/data"]
        })

        model.image += get_image_tag_for_version(version)

        model.environment.extend([f"TYPE={server_type}", f"VERSION={version}"])

        return self.add_server(model)

    def add_curseforge_server(
            self, server: AddCurseforgeServerInput) -> ServerResponse:
        logging.info('%s', server)

        name = server.name

        try:
            modpack = Modpack().get_modpack(strawberry.ID(server.modpack_id))
            modpack_info = Modpack().get_modpack_info(modpack)
        except ModpackError as error:
            return ServerError(error=str(error))

        version = modpack.version

        if version not in Version().get_versions():
            return ServerError(error=f"Version: {version} does not exist")

        server_type = TypeEnum.FORGE.name
        if modpack_info.modloader == 'fabric':
            server_type = TypeEnum.FABRIC.name

        model = DockerModel(**{
            "name": name,
            "volumes": [name + ":/data"]
        })

        model.image += get_image_tag_for_version(version)

        model.environment.extend([
            f"TYPE={server_type}",
            f"VERSION={version}",
            f"GENERIC_PACK={modpack_info.url}"])

        if modpack_info.modloader == 'forge' and not modpack_info.modloader_version is None:
            model.environment.extend([
                f"FORGEVERSION={modpack_info.modloader_version}"
            ])

        return self.add_server(model)

    def start_server(self, container_id: strawberry.ID):
        try:
            container = get_server_by_id(container_id)
            container.start()
            server = self.get_server(strawberry.ID(str(container.id)))
            return ServerSuccess(server=server)
        except NonMinecraftServerError as ex:
            return ServerError(error=str(ex))
        except APIError as ex:
            return ServerError(error=str(ex))

    def stop_server(self, container_id: strawberry.ID):
        try:
            container = get_server_by_id(container_id)
            container.stop()
            server = self.get_server(strawberry.ID(str(container.id)))
            return ServerSuccess(server=server)
        except NonMinecraftServerError as ex:
            return ServerError(error=str(ex))
        except APIError as ex:
            return ServerError(error=str(ex))
