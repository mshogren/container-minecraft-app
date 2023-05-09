import logging
from abc import ABC, abstractmethod
from typing import List

import strawberry
from packaging import version as version_parser
from pydantic import BaseModel
from modpack import Modpack, ModpackError
from settings import Settings
from version import Version

from .model import TypeEnum
from .schema import (AddCurseforgeServerInput, AddVanillaServerInput,
                     ServerError, ServerResponse, ServerSchemaType)


class NonMinecraftServerError(Exception):
    pass


class ServerModel(BaseModel):
    name: str
    image: str = Settings().default_image
    detach: bool = True
    ports: dict = {"25565/tcp": None}
    volumes: List[str]
    labels: dict = {}
    env: dict[str, str] = {"EULA": "TRUE"}


def get_image_tag_for_version(version: str) -> str:
    if version_parser.parse(version) < version_parser.parse("1.17"):
        return ":java8-multiarch"
    return ""


class AbstractServer(ABC):
    @abstractmethod
    def get_server(self, container_id: strawberry.ID) -> ServerSchemaType:
        pass

    @abstractmethod
    def get_servers(self) -> List[ServerSchemaType]:
        pass

    @abstractmethod
    def add_server(self, model: ServerModel) -> ServerResponse:
        pass

    def add_vanilla_server(self,
                           server: AddVanillaServerInput) -> ServerResponse:
        logging.info('%s', server)

        name = server.name
        server_type = TypeEnum.VANILLA.name
        version = server.version

        if version not in Version().get_versions():
            return ServerError(error=f"Version: {version} does not exist")

        model = ServerModel(**{
            "name": name,
            "volumes": [name + ":/data"]
        })

        model.image += get_image_tag_for_version(version)

        model.env["TYPE"] = server_type
        model.env["VERSION"] = version

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

        model = ServerModel(**{
            "name": name,
            "volumes": [name + ":/data"]
        })

        model.image += get_image_tag_for_version(version)

        model.env["TYPE"] = server_type
        model.env["VERSION"] = version
        model.env["GENERIC_PACK"] = modpack_info.url

        if modpack_info.modloader == "forge" and not modpack_info.modloader_version is None:
            model.env["FORGEVERSION"] = modpack_info.modloader_version

        return self.add_server(model)

    @ abstractmethod
    def start_server(self, container_id: strawberry.ID) -> ServerResponse:
        pass

    @ abstractmethod
    def stop_server(self, container_id: strawberry.ID) -> ServerResponse:
        pass
