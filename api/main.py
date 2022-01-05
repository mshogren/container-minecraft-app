from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from strawberry.fastapi import GraphQLRouter

from schema import schema

graphql_app = GraphQLRouter(schema)

app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")
app.mount("/", StaticFiles(directory="../app", html=True), name="app")
