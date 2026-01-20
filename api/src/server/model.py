from datetime import datetime
from enum import Enum
from typing import List, Optional

import strawberry
from pydantic import BaseModel, Field
from ..settings import SchemaLabels as labels


@strawberry.enum(
    name=labels.TYPE_ENUM_NAME,
    description=labels.TYPE_ENUM_DESCRIPTION)
class TypeEnum(Enum):
    CURSEFORGE = strawberry.enum_value(
        "CURSEFORGE", description=labels.TYPE_ENUM_CURSEFORGE_DESCRIPTION)
    FABRIC = strawberry.enum_value(
        "FABRIC", description=labels.TYPE_ENUM_FABRIC_DESCRIPTION)
    FORGE = strawberry.enum_value(
        "FORGE", description=labels.TYPE_ENUM_FORGE_DESCRIPTION)
    VANILLA = strawberry.enum_value(
        "VANILLA", description=labels.TYPE_ENUM_VANILLA_DESCRIPTION)


@strawberry.enum(
    name=labels.STATUS_ENUM_NAME,
    description=labels.STATUS_ENUM_DESCRIPTION)
class StatusEnum(Enum):
    AVAILABLE = strawberry.enum_value(
        "AVAILABLE", description=labels.STATUS_ENUM_AVAILABLE_DESCRIPTION)
    UNAVAILABLE = strawberry.enum_value(
        "UNAVAILABLE", description=labels.STATUS_ENUM_UNAVAILABLE_DESCRIPTION)


class EnvironmentModel(BaseModel):
    version: str = Field(default="latest", alias="VERSION")
    type: TypeEnum = Field(alias="TYPE")


class ConfigModel(BaseModel):
    Image: str
    Env: List[str]
    Labels: dict[str, str]


class NetworkSettingsModel(BaseModel):
    Ports: dict


class StateModel(BaseModel):
    StartedAt: datetime
    Status: str


class VolumeModel(BaseModel):
    Name: Optional[str] = '(Unknown)'
    Source: str


class ContainerDetailsModel(BaseModel):
    Created: datetime
    Configuration: ConfigModel = Field(alias="Config")
    Mounts: List[VolumeModel]
    Name: str
    NetworkSettings: NetworkSettingsModel
    State: StateModel
