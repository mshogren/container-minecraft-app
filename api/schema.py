from typing import List
from cachetools import func

import strawberry
from strawberry.types import Info
from typing_extensions import Annotated
from modpack import Modpack, ModpackSchemaType
from server.schema import (AddCurseforgeServerInput, AddVanillaServerInput,
                           ServerResponse, ServerSchemaType)
from settings import SchemaLabels as labels
from version import Version

modpack_helper = Modpack()
version_helper = Version()


@strawberry.type(
    name=labels.QUERY_TYPE_NAME,
    description=labels.QUERY_TYPE_DESCRIPTION)
class Query:
    @strawberry.field(
        name=labels.QUERY_MODPACK_FIELD_NAME,
        description=labels.QUERY_MODPACK_FIELD_DESCRIPTION)
    def modpack(self,
                modpack_id: Annotated[strawberry.ID, strawberry.argument(
            name=labels.QUERY_MODPACK_MODPACKID_ARG_NAME,
            description=labels.QUERY_MODPACK_MODPACKID_ARG_DESCRIPTION)]) -> ModpackSchemaType:
        return modpack_helper.get_modpack(modpack_id)

    @strawberry.field(
        name=labels.QUERY_MODPACKS_FIELD_NAME,
        description=labels.QUERY_MODPACKS_FIELD_DESCRIPTION)
    @func.ttl_cache  # type: ignore
    def modpacks(self,
                 page: Annotated[int, strawberry.argument(
            name=labels.QUERY_MODPACKS_PAGE_ARG_NAME,
            description=labels.QUERY_MODPACKS_PAGE_ARG_DESCRIPTION)]
            = 0,
        search: Annotated[str, strawberry.argument(
            name=labels.QUERY_MODPACKS_SEARCH_ARG_NAME,
            description=labels.QUERY_MODPACKS_SEARCH_ARG_DESCRIPTION)]
            = "") -> List[ModpackSchemaType]:
        return modpack_helper.get_modpacks(page, search)

    @strawberry.field(
        name=labels.QUERY_SERVER_FIELD_NAME,
        description=labels.QUERY_SERVER_FIELD_DESCRIPTION)
    def server(self, info: Info,
               server_id: Annotated[strawberry.ID, strawberry.argument(
            name=labels.QUERY_SERVER_SERVERID_ARG_NAME,
            description=labels.QUERY_SERVER_SERVERID_ARG_DESCRIPTION)]) -> ServerSchemaType:
        return info.context.server_helper.get_server(server_id)

    @strawberry.field(
        name=labels.QUERY_SERVERS_FIELD_NAME,
        description=labels.QUERY_SERVERS_FIELD_DESCRIPTION)
    def servers(self, info: Info) -> List[ServerSchemaType]:
        return info.context.server_helper.get_servers()

    @strawberry.field(
        name=labels.QUERY_VERSIONS_FIELD_NAME,
        description=labels.QUERY_VERSIONS_FIELD_DESCRIPTION)
    @func.ttl_cache  # type: ignore
    def versions(self) -> List[str]:
        return version_helper.get_versions()


@strawberry.type(
    name=labels.MUTATION_TYPE_NAME,
    description=labels.MUTATION_TYPE_DESCRIPTION)
class Mutation:
    @strawberry.mutation(
        name=labels.MUTATION_ADDCURSEFORGESERVER_FIELD_NAME,
        description=labels.MUTATION_ADDCURSEFORGESERVER_FIELD_DESCRIPTION)
    def add_curseforge_server(self, info: Info,
                              server: Annotated[AddCurseforgeServerInput, strawberry.argument(
            name=labels.MUTATION_ADDCURSEFORGESERVER_ARG_NAME,
            description=labels.MUTATION_ADDCURSEFORGESERVER_ARG_DESCRIPTION)]) -> ServerResponse:
        return info.context.server_helper.add_curseforge_server(server)

    @strawberry.mutation(
        name=labels.MUTATION_ADDVANILLASERVER_FIELD_NAME,
        description=labels.MUTATION_ADDVANILLASERVER_FIELD_DESCRIPTION)
    def add_vanilla_server(self, info: Info,
                           server: Annotated[AddVanillaServerInput, strawberry.argument(
            name=labels.MUTATION_ADDVANILLASERVER_ARG_NAME,
            description=labels.MUTATION_ADDVANILLASERVER_ARG_DESCRIPTION)]) -> ServerResponse:
        return info.context.server_helper.add_vanilla_server(server)

    @strawberry.mutation(
        name=labels.MUTATION_STARTSERVER_FIELD_NAME,
        description=labels.MUTATION_STARTSERVER_FIELD_DESCRIPTION)
    def start_server(self, info: Info, server_id: Annotated[strawberry.ID, strawberry.argument(
            name=labels.MUTATION_STARTSERVER_ARG_NAME,
            description=labels.MUTATION_STARTSERVER_ARG_DESCRIPTION)]) -> ServerResponse:
        return info.context.server_helper.start_server(server_id)

    @strawberry.mutation(
        name=labels.MUTATION_STOPSERVER_FIELD_NAME,
        description=labels.MUTATION_STOPSERVER_FIELD_DESCRIPTION)
    def stop_server(self, info: Info, server_id: Annotated[strawberry.ID, strawberry.argument(
            name=labels.MUTATION_STOPSERVER_ARG_NAME,
            description=labels.MUTATION_STOPSERVER_ARG_DESCRIPTION)]) -> ServerResponse:
        return info.context.server_helper.stop_server(server_id)


schema = strawberry.Schema(Query, Mutation)
