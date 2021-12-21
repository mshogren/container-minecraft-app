import json
from typing import List
from urllib.request import urlopen

import strawberry
from settings import SchemaLabels as labels


@strawberry.type(
    name=labels.VERSION_TYPE_NAME,
    description=labels.VERSION_TYPE_DESCRIPTION)
class Version:
    # pylint: disable=too-few-public-methods
    version: str = strawberry.field(
        name=labels.VERSION_VERSION_FIELD_NAME,
        description=labels.VERSION_VERSION_FIELD_DESCRIPTION)


VERSIONS_URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json"


def is_version_relevant(version: dict) -> bool:
    return version.get("type") == "release" and not version.get("id") is None


def parse_versions(versions) -> List[Version]:
    if isinstance(versions, list):
        return [Version(x.get("id")) for x in versions if is_version_relevant(x)]
    return []


def get_versions() -> List[Version]:
    with urlopen(VERSIONS_URL) as response:
        data = json.loads(response.read())
    return parse_versions(data["versions"])
