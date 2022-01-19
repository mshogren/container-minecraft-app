from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from strawberry.fastapi import GraphQLRouter

from schema import schema
from settings import Settings


graphql_app = GraphQLRouter(schema)

app = FastAPI()

ORIGIN = Settings().allowed_origin
if ORIGIN:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[ORIGIN],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
app.include_router(graphql_app, prefix="/graphql")
app.mount("/", StaticFiles(directory="../app", html=True), name="app")
