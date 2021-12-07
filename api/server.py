import logging
import typing

import docker
import strawberry
from docker.models.containers import Container

from settings import Settings


@strawberry.type
class Server:
    id: str
    name: str
    image: str
    status: str
    version: str = "latest"
    health_check: bool = True


@strawberry.input
class AddServerInput:
    name: str


@strawberry.type
class AddServerSuccess:
    server: Server


@strawberry.type
class AddServerError:
    error: str


AddServerResponse = typing.Union[AddServerSuccess, AddServerError]
client = docker.from_env()


def is_container_relevant(container: Container, image_name: str) -> bool:
    return (bool(container)
            and hasattr(container, "image")
            and str(container.image).find(f"'{image_name}:") > -1)


def parse_container_environment(environment: str) -> typing.Dict[str, str]:
    return dict((key, value)
                for key, value in (element.split("=")
                                   for element in environment))


def get_server(container: Container) -> Server:
    container_details = client.api.inspect_container(container.id)
    container_environment = parse_container_environment(
        container_details["Config"]["Env"])
    return Server(
        id=container.id,
        name=container.name,
        image=container.image,
        status=container.status,
        version=container_environment.get("VERSION", "latest")
    )


def get_servers() -> typing.List[Server]:
    containers = client.containers.list(all=True)
    containers = filter(lambda x: is_container_relevant(
        x, Settings().default_image), containers)
    return map(get_server, containers)


def add_server(server: AddServerInput) -> AddServerResponse:
    logging.info('%s', server)
    return AddServerError(error="Not implemented")
