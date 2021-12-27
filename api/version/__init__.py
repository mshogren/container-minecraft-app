import json
from enum import Enum
from typing import List
from urllib.error import HTTPError
from urllib.request import urlopen

from pydantic import BaseModel, ValidationError


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


VERSIONS_URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json"


def parse_versions(data) -> List[str]:
    if isinstance(data, dict):
        try:
            model = VersionsModel(**data)
        except ValidationError as error:
            raise Exception(
                "Versions response is not in a valid format") from error
        if isinstance(model.versions, list):
            return [x.id for x in model.versions if x.type == TypeEnum.RELEASE]
    return []


def get_versions() -> List[str]:
    with urlopen(VERSIONS_URL) as response:
        try:
            data = json.loads(response.read())
        except HTTPError as error:
            raise Exception("Versions could not be retrieved") from error
    return parse_versions(data)
