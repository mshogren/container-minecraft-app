import builtins
import json
from typing import List
from urllib.error import HTTPError
from urllib.request import urlopen

from pydantic import ValidationError

from .model import TypeEnum, VersionsModel

VERSIONS_URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json"


def parse_versions(data) -> List[str]:
    if isinstance(data, dict):
        try:
            model = VersionsModel(**data)
        except ValidationError as error:
            raise builtins.Exception(
                "Versions response is not in a valid format") from error
        if isinstance(model.versions, list):
            return [x.id for x in model.versions if x.type == TypeEnum.RELEASE]
    return []


class Version:
    # pylint: disable=too-few-public-methods
    def get_versions(self) -> List[str]:
        with urlopen(VERSIONS_URL) as response:
            try:
                data = json.loads(response.read())
            except HTTPError as error:
                raise builtins.Exception(
                    "Versions could not be retrieved") from error
        return parse_versions(data)
