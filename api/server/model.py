from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class EnvironmentModel(BaseModel):
    # pylint: disable=too-few-public-methods
    version: str = "latest"


class ConfigModel(BaseModel):
    # pylint: disable=too-few-public-methods
    Image: str
    Env: List[str]


class NetworkSettingsModel(BaseModel):
    # pylint: disable=too-few-public-methods
    Ports: dict


class StateModel(BaseModel):
    # pylint: disable=too-few-public-methods
    StartedAt: datetime
    Status: str


class VolumeModel(BaseModel):
    # pylint: disable=too-few-public-methods
    Name: str
    Source: str


class ContainerDetailsModel(BaseModel):
    # pylint: disable=too-few-public-methods
    Created: datetime
    Configuration: ConfigModel = Field(alias="Config")
    Mounts: List[VolumeModel]
    Name: str
    NetworkSettings: NetworkSettingsModel
    State: StateModel
