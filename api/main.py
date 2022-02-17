from os.path import join
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
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

APP_PATH = "../app"

app.include_router(graphql_app, prefix="/graphql")


@app.get('/{resource:path}', include_in_schema=False)
def static(resource: str):
    file_name = "index.html" if "." not in resource else resource
    return FileResponse(path=join(APP_PATH, file_name))


app.mount("/", StaticFiles(directory=APP_PATH, html=True), name="app")
