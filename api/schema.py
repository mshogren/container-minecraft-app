from typing import List

import strawberry
from cachetools import func
from typing_extensions import Annotated

from modpack import Modpack, ModpackSchemaType
from server import (AddCurseforgeServerInput, AddVanillaServerInput, Server,
                    ServerResponse, ServerSchemaType)
from settings import SchemaLabels as labels
from version import Version


@strawberry.type(
    name=labels.QUERY_TYPE_NAME,
    description=labels.QUERY_TYPE_DESCRIPTION)
class Query:
    @strawberry.field(
        name=labels.QUERY_MODPACK_FIELD_NAME,
        description=labels.QUERY_MODPACK_FIELD_DESCRIPTION)
    @staticmethod
    def modpack(
        modpack_id: Annotated[strawberry.ID, strawberry.argument(
            name=labels.QUERY_MODPACK_MODPACKID_ARG_NAME,
            description=labels.QUERY_MODPACK_MODPACKID_ARG_DESCRIPTION)]) -> ModpackSchemaType:
        return Modpack.get_modpack(modpack_id)

    @strawberry.field(
        name=labels.QUERY_MODPACKS_FIELD_NAME,
        description=labels.QUERY_MODPACKS_FIELD_DESCRIPTION)
    @staticmethod
    @func.ttl_cache  # type: ignore
    def modpacks(
        page: Annotated[int, strawberry.argument(
            name=labels.QUERY_MODPACKS_PAGE_ARG_NAME,
            description=labels.QUERY_MODPACKS_PAGE_ARG_DESCRIPTION)]
            = 0,
        search: Annotated[str, strawberry.argument(
            name=labels.QUERY_MODPACKS_SEARCH_ARG_NAME,
            description=labels.QUERY_MODPACKS_SEARCH_ARG_DESCRIPTION)]
            = "") -> List[ModpackSchemaType]:
        return Modpack.get_modpacks(page, search)

    @strawberry.field(
        name=labels.QUERY_SERVER_FIELD_NAME,
        description=labels.QUERY_SERVER_FIELD_DESCRIPTION)
    @staticmethod
    def server(
        server_id: Annotated[strawberry.ID, strawberry.argument(
            name=labels.QUERY_SERVER_SERVERID_ARG_NAME,
            description=labels.QUERY_SERVER_SERVERID_ARG_DESCRIPTION)]) -> ServerSchemaType:
        return Server.get_server(server_id)

    @strawberry.field(
        name=labels.QUERY_SERVERS_FIELD_NAME,
        description=labels.QUERY_SERVERS_FIELD_DESCRIPTION)
    @staticmethod
    def servers() -> List[ServerSchemaType]:
        return Server.get_servers()

    @strawberry.field(
        name=labels.QUERY_VERSIONS_FIELD_NAME,
        description=labels.QUERY_VERSIONS_FIELD_DESCRIPTION)
    @staticmethod
    @func.ttl_cache  # type: ignore
    def versions() -> List[str]:
        return Version.get_versions()


@strawberry.type(
    name=labels.MUTATION_TYPE_NAME,
    description=labels.MUTATION_TYPE_DESCRIPTION)
class Mutation:
    @strawberry.mutation(
        name=labels.MUTATION_ADDCURSEFORGESERVER_FIELD_NAME,
        description=labels.MUTATION_ADDCURSEFORGESERVER_FIELD_DESCRIPTION)
    @staticmethod
    def add_curseforge_server(server: Annotated[AddCurseforgeServerInput, strawberry.argument(
            name=labels.MUTATION_ADDCURSEFORGESERVER_ARG_NAME,
            description=labels.MUTATION_ADDCURSEFORGESERVER_ARG_DESCRIPTION)]) -> ServerResponse:
        return Server.add_curseforge_server(server)

    @strawberry.mutation(
        name=labels.MUTATION_ADDVANILLASERVER_FIELD_NAME,
        description=labels.MUTATION_ADDVANILLASERVER_FIELD_DESCRIPTION)
    @staticmethod
    def add_vanilla_server(server: Annotated[AddVanillaServerInput, strawberry.argument(
            name=labels.MUTATION_ADDVANILLASERVER_ARG_NAME,
            description=labels.MUTATION_ADDVANILLASERVER_ARG_DESCRIPTION)]) -> ServerResponse:
        return Server.add_vanilla_server(server)

    @strawberry.mutation(
        name=labels.MUTATION_STARTSERVER_FIELD_NAME,
        description=labels.MUTATION_STARTSERVER_FIELD_DESCRIPTION)
    @staticmethod
    def start_server(server_id: Annotated[strawberry.ID, strawberry.argument(
            name=labels.MUTATION_STARTSERVER_ARG_NAME,
            description=labels.MUTATION_STARTSERVER_ARG_DESCRIPTION)]) -> ServerResponse:
        return Server.start_server(server_id)

    @strawberry.mutation(
        name=labels.MUTATION_STOPSERVER_FIELD_NAME,
        description=labels.MUTATION_STOPSERVER_FIELD_DESCRIPTION)
    @staticmethod
    def stop_server(server_id: Annotated[strawberry.ID, strawberry.argument(
            name=labels.MUTATION_STOPSERVER_ARG_NAME,
            description=labels.MUTATION_STOPSERVER_ARG_DESCRIPTION)]) -> ServerResponse:
        return Server.stop_server(server_id)


schema = strawberry.Schema(Query, Mutation)
