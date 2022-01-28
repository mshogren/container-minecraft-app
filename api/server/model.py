from datetime import datetime
from enum import Enum
from typing import List

from pydantic import BaseModel, Field


class TypeEnum(str, Enum):
    CURSEFORGE = "CURSEFORGE"
    FABRIC = "FABRIC"
    FORGE = "FORGE"
    VANILLA = "VANILLA"


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
