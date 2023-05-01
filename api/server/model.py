from datetime import datetime
from enum import Enum
from typing import List

import strawberry
from pydantic import BaseModel, Field
from settings import SchemaLabels as labels


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


class EnvironmentModel(BaseModel):
    version: str = Field(default="latest", alias="VERSION")
    type: TypeEnum = Field(alias="TYPE")


class ConfigModel(BaseModel):
    Image: str
    Env: List[str]


class NetworkSettingsModel(BaseModel):
    Ports: dict


class StateModel(BaseModel):
    StartedAt: datetime
    Status: str


class VolumeModel(BaseModel):
    Name: str
    Source: str


class ContainerDetailsModel(BaseModel):
    Created: datetime
    Configuration: ConfigModel = Field(alias="Config")
    Mounts: List[VolumeModel]
    Name: str
    NetworkSettings: NetworkSettingsModel
    State: StateModel
