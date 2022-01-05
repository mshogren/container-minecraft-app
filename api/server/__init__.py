import logging
from functools import cache
from typing import Dict, List

import docker
import strawberry
from docker.models.containers import Container
from settings import Settings

from .image import Image
from .model import ContainerDetailsModel, EnvironmentModel
from .port import Port
from .schema import (AddServerError, AddServerInput, AddServerResponse,
                     AddServerSuccess, Server)
from .volume import Volume


@cache
def get_client():
    return docker.from_env()


def is_container_relevant(container: Container, image_name: str) -> bool:
    return (bool(container)
            and hasattr(container, "image")
            and str(container.image).find(f"'{image_name}:") > -1)


def parse_container_environment(environment: str) -> EnvironmentModel:
    env_dict = dict((key, value)
                    for key, value in (element.split("=")
                                       for element in environment))
    return EnvironmentModel(**env_dict)


def get_server(container_id: strawberry.ID) -> Server:
    container_details = get_client().api.inspect_container(container_id)
    container_model = ContainerDetailsModel(**container_details)
    container_environment = parse_container_environment(
        container_model.Configuration.Env)
    return Server(
        id=container_id, name=container_model.Name[1:],
        image=Image(container_model.Configuration.Image),
        ports=[Port(key, value)
               for(key, value) in
               container_model.NetworkSettings.Ports.items()],
        volumes=[Volume(x) for x in container_model.Mounts],
        created=container_model.Created,
        started=container_model.State.StartedAt,
        status=container_model.State.Status,
        game_version=container_environment.version)


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
            labels={},
            environment=["EULA=TRUE"])
        server = get_server(container.id)
        return AddServerSuccess(server)
    except docker.errors.APIError as ex:
        return AddServerError(error=str(ex))
