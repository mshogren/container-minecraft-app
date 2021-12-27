from typing import List

import strawberry
from typing_extensions import Annotated

from modpack import Modpack, get_modpack, get_modpacks
from server import Server, get_server, get_servers
from settings import SchemaLabels as labels
from version import get_versions


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
            name=labels.QUERY_MODPACK_MODPACKID_ARGUMENT_NAME,
            description=labels.QUERY_MODPACK_MODPACKID_ARGUMENT_DESCRIPTION)]) -> Modpack:
        return get_modpack(modpack_id)

    @strawberry.field(
        name=labels.QUERY_MODPACKS_FIELD_NAME,
        description=labels.QUERY_MODPACKS_FIELD_DESCRIPTION)
    @staticmethod
    def modpacks(
        page: Annotated[int, strawberry.argument(
            name=labels.QUERY_MODPACKS_PAGE_ARGUMENT_NAME,
            description=labels.QUERY_MODPACKS_PAGE_ARGUMENT_DESCRIPTION)] = 0,
        search: Annotated[str, strawberry.argument(
            name=labels.QUERY_MODPACKS_SEARCH_ARGUMENT_NAME,
            description=labels.QUERY_MODPACKS_SEARCH_ARGUMENT_DESCRIPTION)] = "") -> List[Modpack]:
        return get_modpacks(page, search)

    @strawberry.field(
        name=labels.QUERY_SERVER_FIELD_NAME,
        description=labels.QUERY_SERVER_FIELD_DESCRIPTION)
    @staticmethod
    def server(
        server_id: Annotated[strawberry.ID, strawberry.argument(
            name=labels.QUERY_SERVER_SERVERID_ARGUMENT_NAME,
            description=labels.QUERY_SERVER_SERVERID_ARGUMENT_DESCRIPTION)]) -> Server:
        return get_server(server_id)

    @strawberry.field(
        name=labels.QUERY_SERVERS_FIELD_NAME,
        description=labels.QUERY_SERVERS_FIELD_DESCRIPTION)
    @staticmethod
    def servers() -> List[Server]:
        return get_servers()

    @strawberry.field(
        name=labels.QUERY_VERSIONS_FIELD_NAME,
        description=labels.QUERY_VERSIONS_FIELD_DESCRIPTION)
    @staticmethod
    def versions() -> List[str]:
        return get_versions()
