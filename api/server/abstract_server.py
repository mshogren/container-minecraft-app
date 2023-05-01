from abc import ABC, abstractmethod
from typing import List

import strawberry

from .schema import (
    AddCurseforgeServerInput, AddVanillaServerInput, ServerResponse,
    ServerSchemaType)


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
    def start_server(self, container_id: strawberry.ID):
        pass

    @abstractmethod
    def stop_server(self, container_id: strawberry.ID):
        pass
