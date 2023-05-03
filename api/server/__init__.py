from abc import ABC, abstractmethod
from typing import List

import strawberry
from packaging import version as version_parser

from .schema import (AddCurseforgeServerInput, AddVanillaServerInput,
                     ServerResponse, ServerSchemaType)


class NonMinecraftServerError(Exception):
    pass


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
    def add_vanilla_server(self,
                           server: AddVanillaServerInput) -> ServerResponse:
        pass

    @abstractmethod
    def add_curseforge_server(
            self, server: AddCurseforgeServerInput) -> ServerResponse:
        pass

    @abstractmethod
    def start_server(self, container_id: strawberry.ID) -> ServerResponse:
        pass

    @abstractmethod
    def stop_server(self, container_id: strawberry.ID) -> ServerResponse:
        pass
