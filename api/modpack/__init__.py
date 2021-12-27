import json
from typing import List, Optional
from urllib.error import HTTPError
from urllib.request import urlopen

import strawberry
from settings import SchemaLabels as labels


@strawberry.type(
    name=labels.MODPACK_TYPE_NAME,
    description=labels.MODPACK_TYPE_DESCRIPTION)
class Modpack:
    # pylint: disable=too-few-public-methods
    categories: List[str] = strawberry.field(
        name=labels.MODPACK_CATEGORIES_FIELD_NAME,
        description=labels.MODPACK_CATEGORIES_FIELD_DESCRIPTION)
    default_file_id: str = strawberry.field(
        name=labels.MODPACK_DEFAULT_FILE_ID_FIELD_NAME,
        description=labels.MODPACK_DEFAULT_FILE_ID_FIELD_DESCRIPTION)
    download_count: int = strawberry.field(
        name=labels.MODPACK_DOWNLOADCOUNT_FIELD_NAME,
        description=labels.MODPACK_DOWNLOADCOUNT_FIELD_DESCRIPTION)
    id: strawberry.ID = strawberry.field(
        name=labels.MODPACK_ID_FIELD_NAME,
        description=labels.MODPACK_ID_FIELD_DESCRIPTION)
    name: str = strawberry.field(
        name=labels.MODPACK_NAME_FIELD_NAME,
        description=labels.MODPACK_NAME_FIELD_DESCRIPTION)
    summary: str = strawberry.field(
        name=labels.MODPACK_SUMMARY_FIELD_NAME,
        description=labels.MODPACK_SUMMARY_FIELD_DESCRIPTION)
    thumbnail_url: Optional[str] = strawberry.field(
        name=labels.MODPACK_THUMBNAILURL_FIELD_NAME,
        description=labels.MODPACK_THUMBNAILURL_FIELD_DESCRIPTION)
    version: str = strawberry.field(
        name=labels.MODPACK_VERSION_FIELD_NAME,
        description=labels.MODPACK_VERSION_FIELD_DESCRIPTION)
    website_url: str = strawberry.field(
        name=labels.MODPACK_WEBSITEURL_FIELD_NAME,
        description=labels.MODPACK_WEBSITEURL_FIELD_DESCRIPTION)


API_BASE_URL = "https://addons-ecs.forgesvc.net/api/v2/addon/"
QUERY_STRING_BASE = "gameId=432&categoryId=0&sectionId=4471"


def parse_attachments(attachments: str) -> str:
    if isinstance(attachments, list):
        thumbnail_urls = [x.get("thumbnailUrl") for x in attachments]
        return next((x for x in thumbnail_urls if not x is None), None)
    return None


def parse_categories(categories: str) -> List[str]:
    if isinstance(categories, list):
        category_names = [x.get("name") for x in categories]
        return [x for x in category_names if not x is None]
    return []


def parse_game_versions(versions: str) -> str:
    if isinstance(versions, list):
        version_names = [x.get("gameVersion") for x in versions]
        return next((x for x in version_names if not x is None), None)
    return None


def parse_modpack(modpack: str) -> Modpack:
    return Modpack(
        id=modpack["id"],
        name=modpack["name"],
        website_url=modpack["websiteUrl"],
        summary=modpack["summary"],
        thumbnail_url=parse_attachments(modpack.get("attachments")),
        categories=parse_categories(modpack.get("categories")),
        download_count=modpack["downloadCount"],
        default_file_id=modpack["defaultFileId"],
        version=parse_game_versions(modpack.get("gameVersionLatestFiles")))


def has_server_file(modpack: str) -> bool:
    latest_files = modpack.get("latestFiles", [])
    server_files = [
        file for file in latest_files
        if not file.get("serverPackFileId") is None]
    return len(server_files) > 0


def get_modpack(modpack_id: strawberry.ID) -> Modpack:
    url = f"{API_BASE_URL}{modpack_id}"
    error_base = f"The modpack with id: {modpack_id}"
    try:
        with urlopen(url) as response:
            data = json.loads(response.read())
    except HTTPError as http_error:
        raise Exception(f"{error_base} could not be retrieved") from http_error
    if has_server_file(data):
        return parse_modpack(data)
    raise Exception(f"{error_base} has no server pack available")


def get_modpacks(page: int = 0, search: str = "") -> List[Modpack]:
    page_size = 50
    query_string_filters = f"&pageSize={page_size}&index={page * page_size}&searchFilter={search}"
    url = f"{API_BASE_URL}search?{QUERY_STRING_BASE}{query_string_filters}"
    with urlopen(url) as response:
        data = json.loads(response.read())
    modpacks = [x for x in data if has_server_file(x)]
    return [parse_modpack(x) for x in modpacks]
