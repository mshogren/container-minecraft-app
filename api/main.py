import typing

import strawberry
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from strawberry.fastapi import GraphQLRouter

from modpack import Modpack, get_modpacks
from server import (AddServerInput, AddServerResponse, Server, add_server,
                    get_servers)


@strawberry.type
class Query:
    servers: typing.List[Server] = strawberry.field(resolver=get_servers)
    modpacks: typing.List[Modpack] = strawberry.field(resolver=get_modpacks)


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_server_or_fail(self, server: AddServerInput) -> AddServerResponse:
        return add_server(server)


schema = strawberry.Schema(Query, Mutation)

graphql_app = GraphQLRouter(schema)

app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")
app.mount("/", StaticFiles(directory="../app", html=True), name="app")
