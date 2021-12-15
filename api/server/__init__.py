import logging
from datetime import datetime
from typing import Dict, List, Union

import docker
import strawberry
from dateutil import parser
from docker.models.containers import Container
from settings import Settings
from version import Version

from server.image import Image
from server.port import Port
from server.volume import Volume


@strawberry.type
class Server:
    # pylint: disable=too-few-public-methods
    id: strawberry.ID
    name: str
    image: Image
    created: datetime
    started: datetime
    ports: List[Port]
    status: str
    volumes: List[Volume]
    game_version: Version


@strawberry.input
class AddServerInput:
    # pylint: disable=too-few-public-methods
    name: str


@strawberry.type
class AddServerSuccess:
    # pylint: disable=too-few-public-methods
    server: Server


@strawberry.type
class AddServerError:
    # pylint: disable=too-few-public-methods
    error: str


AddServerResponse = Union[AddServerSuccess, AddServerError]
client = docker.from_env()


def is_container_relevant(container: Container, image_name: str) -> bool:
    return (bool(container)
            and hasattr(container, "image")
            and str(container.image).find(f"'{image_name}:") > -1)


def parse_container_environment(environment: str) -> Dict[str, str]:
    return dict((key, value)
                for key, value in (element.split("=")
                                   for element in environment))


def get_server(container_id: strawberry.ID) -> Server:
    container_details = client.api.inspect_container(container_id)
    container_environment = parse_container_environment(
        container_details["Config"]["Env"])
    return Server(
        id=container_id,
        name=container_details["Name"][1:],
        image=Image(container_details["Config"]["Image"]),
        ports=[Port(key, value)
               for(key, value) in container_details["NetworkSettings"]
               ["Ports"].items()],
        volumes=map(Volume, container_details["Mounts"]),
        created=parser.parse(container_details["Created"]),
        started=parser.parse(container_details["State"]["StartedAt"]),
        status=container_details["State"]["Status"],
        game_version=Version(container_environment.get("VERSION", "latest")))


def get_servers() -> List[Server]:
    containers = client.containers.list(all=True)
    containers = filter(lambda x: is_container_relevant(
        x, Settings().default_image), containers)
    return map(lambda x: get_server(x.id), containers)


def add_server(server: AddServerInput) -> AddServerResponse:
    logging.info('%s', server)
    try:
        container = client.containers.run(
            name=server.name,
            image=Settings().default_image,
            detach=True,
            ports={"25565/tcp": None},
            volumes=[server.name + ":/data"],
            environment=["EULA=TRUE"])
        server = get_server(container.id)
        return AddServerSuccess(server)
    except docker.errors.APIError as ex:
        return AddServerError(error=str(ex))
