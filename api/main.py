from functools import cached_property
from os.path import join
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from strawberry.fastapi import BaseContext, GraphQLRouter

from src.auth import get_payload, get_token
from src.schema import schema
from src.server.docker_server import DockerServer
from src.server.kube_server import KubernetesServer
from src.settings import Settings


APP_PATH = "../app"


class CustomContext(BaseContext):
    # pylint: disable=too-few-public-methods
    @cached_property
    def server_helper(self):
        user = None
        if Settings().authority and self.request:
            token = get_token(self.request.headers.get('Authorization', None))
            user = get_payload(token, Settings().authority,
                               Settings().client_id)
        is_kubernetes = bool(Settings().kubernetes_service_host)
        return KubernetesServer(user) if is_kubernetes else DockerServer(user)


def custom_context_dependency() -> CustomContext:
    return CustomContext()


async def get_context(custom_context=Depends(custom_context_dependency)):
    return custom_context


graphql_app = GraphQLRouter(schema, context_getter=get_context)

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


@app.get('/config.js', include_in_schema=False)
def config():
    authority = f"\"authority\": \"{Settings().authority}\""
    client_id = f"\"client_id\": \"{Settings().client_id}\""
    client_secret = f"\"client_secret\": \"{
        Settings().client_secret} \""if Settings().client_secret else None
    runtime = ", ".join(
        [x for x in [authority, client_id, client_secret] if not x is None])
    return Response(
        content=f"{{{runtime}}}",
        media_type="application/json")


@app.get('/{resource:path}', include_in_schema=False)
def static(resource: str):
    file_name = "index.html" if "." not in resource else resource
    return FileResponse(path=join(APP_PATH, file_name))


app.mount("/", StaticFiles(directory=APP_PATH, html=True), name="app")
