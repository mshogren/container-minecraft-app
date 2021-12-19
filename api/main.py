from typing import List

import strawberry
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from strawberry.fastapi import GraphQLRouter

from modpack import Modpack, get_modpack, get_modpacks
from server import (AddServerInput, AddServerResponse, Server, add_server,
                    get_server, get_servers)
from version import Version, get_versions


@strawberry.type
class Query:
    servers: List[Server] = strawberry.field(resolver=get_servers)
    versions: List[Version] = strawberry.field(resolver=get_versions)

    @staticmethod
    @strawberry.field
    def modpacks(page: int = 0, search: str = "") -> List[Modpack]:
        return get_modpacks(page, search)

    @staticmethod
    @strawberry.field
    def modpack(modpack_id: strawberry.ID) -> Modpack:
        return get_modpack(modpack_id)

    @staticmethod
    @strawberry.field
    def server(server_id: strawberry.ID) -> Server:
        return get_server(server_id)


@strawberry.type
class Mutation:
    # pylint: disable=too-few-public-methods
    @staticmethod
    @strawberry.mutation
    def add_server_or_fail(server: AddServerInput) -> AddServerResponse:
        return add_server(server)


schema = strawberry.Schema(Query, Mutation)

graphql_app = GraphQLRouter(schema)

app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")
app.mount("/", StaticFiles(directory="../app", html=True), name="app")
