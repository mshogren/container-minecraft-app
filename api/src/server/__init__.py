import logging
from abc import ABC, abstractmethod
from typing import List, Mapping, Optional

import strawberry
from packaging import version as version_parser
from pydantic import BaseModel
from ..modpack import Modpack, ModpackError
from ..settings import Settings
from ..version import Version

from .model import TypeEnum
from .schema import (AddCurseforgeServerInput, AddVanillaServerInput,
                     ServerError, ServerResponse, ServerSchemaType)


OWNER_NAME_LABEL_NAME = "container-minecraft-app.owner.name"
OWNER_ISSUER_LABEL_NAME = "container-minecraft-app.owner.iss"
OWNER_AUDIENCE_LABEL_NAME = "container-minecraft-app.owner.aud"
OWNER_SUBJECT_LABEL_NAME = "container-minecraft-app.owner.sub"


class NonMinecraftServerError(Exception):
    pass


class ServerModel(BaseModel):
    name: str
    image: str = Settings().default_image
    detach: bool = True
    ports: dict = {"25565/tcp": None}
    volumes: List[str]
    labels: dict[str, str] = {}
    env: dict[str, str] = {"EULA": "TRUE"}


class UserModel(BaseModel):
    iss: str
    aud: str
    sub: str
    name: str

    def get_labels(self) -> dict[str, str]:
        labels = {}
        labels[OWNER_NAME_LABEL_NAME] = self.name
        labels[OWNER_ISSUER_LABEL_NAME] = self.iss
        labels[OWNER_AUDIENCE_LABEL_NAME] = self.aud
        labels[OWNER_SUBJECT_LABEL_NAME] = self.sub
        return labels


def check_owner(labels: dict[str, str], user: Optional[UserModel]) -> bool:
    is_match = labels.get(OWNER_ISSUER_LABEL_NAME) == (
        user.iss if user else None)
    is_match = is_match and labels.get(
        OWNER_AUDIENCE_LABEL_NAME) == (user.aud if user else None)
    is_match = is_match and labels.get(
        OWNER_SUBJECT_LABEL_NAME) == (user.sub if user else None)
    return is_match


def get_image_tag_for_version(version: str) -> str:
    if version_parser.parse(version) < version_parser.parse("1.17"):
        return ":java8-multiarch"
    return ""


class AbstractServer(ABC):
    def __init__(self, user: Optional[Mapping[str, str]]):
        self.user = None if user is None else UserModel(**user)

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

        model.env |= {"TYPE": server_type, "VERSION": version}

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

        model.env |= {"TYPE": server_type, "VERSION": version,
                      "GENERIC_PACK": modpack_info.url}

        if modpack_info.modloader == "forge" and not modpack_info.modloader_version is None:
            model.env |= {"FORGEVERSION": modpack_info.modloader_version}

        return self.add_server(model)

    @ abstractmethod
    def start_server(self, container_id: strawberry.ID) -> ServerResponse:
        pass

    @ abstractmethod
    def stop_server(self, container_id: strawberry.ID) -> ServerResponse:
        pass
