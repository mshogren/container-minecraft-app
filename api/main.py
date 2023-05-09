from os.path import join
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from strawberry.fastapi import BaseContext, GraphQLRouter

from schema import schema
from server import AbstractServer
from server.docker_server import DockerServer
from server.kube_server import KubernetesServer
from settings import Settings


class CustomContext(BaseContext):
    # pylint: disable=too-few-public-methods
    def __init__(self, server_helper: AbstractServer):
        super().__init__()
        self.server_helper = server_helper


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


def custom_context_dependency() -> CustomContext:
    is_kubernetes = bool(Settings().kubernetes_service_host)
    server_helper = KubernetesServer() if is_kubernetes else DockerServer()
    return CustomContext(server_helper=server_helper)


async def get_context(custom_context=Depends(custom_context_dependency)):
    return custom_context


graphql_app = GraphQLRouter(schema, context_getter=get_context)

app.include_router(graphql_app, prefix="/graphql")


@app.get('/{resource:path}', include_in_schema=False)
def static(resource: str):
    file_name = "index.html" if "." not in resource else resource
    return FileResponse(path=join(APP_PATH, file_name))


app.mount("/", StaticFiles(directory=APP_PATH, html=True), name="app")
