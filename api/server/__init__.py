import logging
from datetime import datetime
from functools import cache
from typing import Dict, List

import docker
import strawberry
from dateutil import parser
from docker.models.containers import Container
from settings import SchemaLabels as labels
from settings import Settings

from server.image import Image
from server.port import Port
from server.volume import Volume


@strawberry.type(
    name=labels.SERVER_TYPE_NAME,
    description=labels.SERVER_TYPE_DESCRIPTION)
class Server:
    # pylint: disable=too-few-public-methods
    created: datetime = strawberry.field(
        name=labels.SERVER_CREATED_FIELD_NAME,
        description=labels.SERVER_CREATED_FIELD_DESCRIPTION)
    game_version: str = strawberry.field(
        name=labels.SERVER_GAMEVERSION_FIELD_NAME,
        description=labels.SERVER_GAMEVERSION_FIELD_DESCRIPTION)
    id: strawberry.ID = strawberry.field(
        name=labels.SERVER_ID_FIELD_NAME,
        description=labels.SERVER_ID_FIELD_DESCRIPTION)
    image: Image = strawberry.field(
        name=labels.SERVER_IMAGE_FIELD_NAME,
        description=labels.SERVER_IMAGE_FIELD_DESCRIPTION)
    name: str = strawberry.field(
        name=labels.SERVER_NAME_FIELD_NAME,
        description=labels.SERVER_NAME_FIELD_DESCRIPTION)
    ports: List[Port] = strawberry.field(
        name=labels.SERVER_PORTS_FIELD_NAME,
        description=labels.SERVER_PORTS_FIELD_DESCRIPTION)
    started: datetime = strawberry.field(
        name=labels.SERVER_STARTED_FIELD_NAME,
        description=labels.SERVER_STARTED_FIELD_DESCRIPTION)
    status: str = strawberry.field(
        name=labels.SERVER_STATUS_FIELD_NAME,
        description=labels.SERVER_STATUS_FIELD_DESCRIPTION)
    volumes: List[Volume] = strawberry.field(
        name=labels.SERVER_VOLUMES_FIELD_NAME,
        description=labels.SERVER_VOLUMES_FIELD_DESCRIPTION)


@strawberry.input(
    name=labels.ADDSERVERINPUT_TYPE_NAME,
    description=labels.ADDSERVERINPUT_TYPE_DESCRIPTION)
class AddServerInput:
    # pylint: disable=too-few-public-methods
    name: str = strawberry.field(
        name=labels.ADDSERVERINPUT_NAME_FIELD_NAME,
        description=labels.ADDSERVERINPUT_NAME_FIELD_DESCRIPTION)


@strawberry.type(
    name=labels.ADDSERVERSUCCESS_TYPE_NAME,
    description=labels.ADDSERVERSUCCESS_TYPE_DESCRIPTION)
class AddServerSuccess:
    # pylint: disable=too-few-public-methods
    server: Server = strawberry.field(
        name=labels.ADDSERVERSUCCESS_SERVER_FIELD_NAME,
        description=labels.ADDSERVERSUCCESS_SERVER_FIELD_DESCRIPTION)


@strawberry.type(
    name=labels.ADDSERVERERROR_TYPE_NAME,
    description=labels.ADDSERVERERROR_TYPE_DESCRIPTION)
class AddServerError:
    # pylint: disable=too-few-public-methods
    error: str = strawberry.field(
        name=labels.ADDSERVERERROR_ERROR_FIELD_NAME,
        description=labels.ADDSERVERERROR_ERROR_FIELD_DESCRIPTION)


AddServerResponse = strawberry.union(
    name=labels.ADDSERVERRESPONSE_TYPE_NAME,
    types=[AddServerSuccess, AddServerError],
    description=labels.ADDSERVERRESPONSE_TYPE_DESCRIPTION)


@cache
def get_client():
    return docker.from_env()


def is_container_relevant(container: Container, image_name: str) -> bool:
    return (bool(container)
            and hasattr(container, "image")
            and str(container.image).find(f"'{image_name}:") > -1)


def parse_container_environment(environment: str) -> Dict[str, str]:
    return dict((key, value)
                for key, value in (element.split("=")
                                   for element in environment))


def get_server(container_id: strawberry.ID) -> Server:
    container_details = get_client().api.inspect_container(container_id)
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
        game_version=container_environment.get("VERSION", "latest"))


def get_servers() -> List[Server]:
    default_image = Settings().default_image
    containers = get_client().containers.list(all=True)
    container_ids = [x.id for x in containers
                     if is_container_relevant(x, default_image)]
    return [get_server(x) for x in container_ids]


def add_server(server: AddServerInput) -> AddServerResponse:
    logging.info('%s', server)
    try:
        container = get_client().containers.run(
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
