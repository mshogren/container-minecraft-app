from enum import Enum
from typing import List

from pydantic import BaseModel


class TypeEnum(str, Enum):
    RELEASE = "release"
    SNAPSHOT = "snapshot"
    OLD_BETA = "old_beta"
    OLD_ALPHA = "old_alpha"


class VersionModel(BaseModel):
    type: TypeEnum
    id: str


class VersionsModel(BaseModel):
    versions: List[VersionModel]
