from __future__ import annotations

from datetime import datetime
from typing import Annotated, List, Union

import strawberry
from ..settings import SchemaLabels as labels

from .image import Image
from .model import StatusEnum, TypeEnum
from .port import Port
from .volume import Volume


@strawberry.type(
    name=labels.SERVER_TYPE_NAME,
    description=labels.SERVER_TYPE_DESCRIPTION)
class ServerSchemaType:
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
    owner: str = strawberry.field(
        name=labels.SERVER_OWNER_FIELD_NAME,
        description=labels.SERVER_OWNER_FIELD_DESCRIPTION)
    ports: List[Port] = strawberry.field(
        name=labels.SERVER_PORTS_FIELD_NAME,
        description=labels.SERVER_PORTS_FIELD_DESCRIPTION)
    started: datetime = strawberry.field(
        name=labels.SERVER_STARTED_FIELD_NAME,
        description=labels.SERVER_STARTED_FIELD_DESCRIPTION)
    status: StatusEnum = strawberry.field(
        name=labels.SERVER_STATUS_FIELD_NAME,
        description=labels.SERVER_STATUS_FIELD_DESCRIPTION)
    type: TypeEnum = strawberry.field(
        name=labels.SERVER_TYPE_FIELD_NAME,
        description=labels.SERVER_TYPE_FIELD_DESCRIPTION)
    volumes: List[Volume] = strawberry.field(
        name=labels.SERVER_VOLUMES_FIELD_NAME,
        description=labels.SERVER_VOLUMES_FIELD_DESCRIPTION)


@strawberry.input(
    name=labels.ADDVANILLASERVERINPUT_TYPE_NAME,
    description=labels.ADDVANILLASERVERINPUT_TYPE_DESCRIPTION)
class AddVanillaServerInput:
    # pylint: disable=too-few-public-methods
    name: str = strawberry.field(
        name=labels.ADDVANILLASERVERINPUT_NAME_FIELD_NAME,
        description=labels.ADDVANILLASERVERINPUT_NAME_FIELD_DESCRIPTION)
    version: str = strawberry.field(
        name=labels.ADDVANILLASERVERINPUT_VERSION_FIELD_NAME,
        description=labels.ADDVANILLASERVERINPUT_VERSION_FIELD_DESCRIPTION)


@strawberry.input(
    name=labels.ADDCURSEFORGESERVERINPUT_TYPE_NAME,
    description=labels.ADDCURSEFORGESERVERINPUT_TYPE_DESCRIPTION)
class AddCurseforgeServerInput:
    # pylint: disable=too-few-public-methods
    modpack_id: str = strawberry.field(
        name=labels.ADDCURSEFORGESERVERINPUT_MODPACKID_FIELD_NAME,
        description=labels.ADDCURSEFORGESERVERINPUT_MODPACKID_FIELD_DESCRIPTION)
    name: str = strawberry.field(
        name=labels.ADDCURSEFORGESERVERINPUT_NAME_FIELD_NAME,
        description=labels.ADDCURSEFORGESERVERINPUT_NAME_FIELD_DESCRIPTION)


@strawberry.type(
    name=labels.SERVERSUCCESS_TYPE_NAME,
    description=labels.SERVERSUCCESS_TYPE_DESCRIPTION)
class ServerSuccess:
    # pylint: disable=too-few-public-methods
    server: ServerSchemaType = strawberry.field(
        name=labels.SERVERSUCCESS_SERVER_FIELD_NAME,
        description=labels.SERVERSUCCESS_SERVER_FIELD_DESCRIPTION)


@strawberry.type(
    name=labels.SERVERERROR_TYPE_NAME,
    description=labels.SERVERERROR_TYPE_DESCRIPTION)
class ServerError:
    # pylint: disable=too-few-public-methods
    error: str = strawberry.field(
        name=labels.SERVERERROR_ERROR_FIELD_NAME,
        description=labels.SERVERERROR_ERROR_FIELD_DESCRIPTION)


ServerResponse = Annotated[Union[ServerSuccess, ServerError], strawberry.union(
    name=labels.SERVERRESPONSE_TYPE_NAME,
    description=labels.SERVERRESPONSE_TYPE_DESCRIPTION)]
