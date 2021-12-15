import json
from typing import List
from urllib.request import urlopen

import strawberry


@strawberry.type
class Version:
    # pylint: disable=too-few-public-methods
    version: str


VERSIONS_URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json"


def is_version_relevant(version: dict) -> bool:
    return version.get("type") == "release" and not version.get("id") is None


def parse_versions(versions) -> List[Version]:
    if isinstance(versions, list) and len(versions) > 0:
        versions = filter(is_version_relevant, versions)
        return map(lambda x: Version(x.get("id")), versions)
    return []


def get_versions() -> List[Version]:
    with urlopen(VERSIONS_URL) as response:
        data = json.loads(response.read())
    return parse_versions(data["versions"])
