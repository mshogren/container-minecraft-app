from typing import List

import strawberry

from .abstract_server import AbstractServer
from .docker_server import DockerServer
from .schema import (AddCurseforgeServerInput, AddVanillaServerInput,
                     ServerResponse, ServerSchemaType)


class Server(AbstractServer):
    implementation: AbstractServer = DockerServer()

    def get_server(self, container_id: strawberry.ID) -> ServerSchemaType:
        return self.implementation.get_server(container_id)

    def get_servers(self) -> List[ServerSchemaType]:
        return self.implementation.get_servers()

    def add_vanilla_server(self,
                           server: AddVanillaServerInput) -> ServerResponse:
        return self.implementation.add_vanilla_server(server)

    def add_curseforge_server(
            self, server: AddCurseforgeServerInput) -> ServerResponse:
        return self.implementation.add_curseforge_server(server)

    def start_server(self, container_id: strawberry.ID):
        return self.implementation.start_server(container_id)

    def stop_server(self, container_id: strawberry.ID):
        return self.implementation.stop_server(container_id)
