import json
import logging
from typing import List
from urllib.error import HTTPError
from urllib.request import urlopen

import strawberry
from pydantic import ValidationError

from modpack import model

from .schema import Modpack

API_BASE_URL = "https://addons-ecs.forgesvc.net/api/v2/addon/"
QUERY_STRING_BASE = "gameId=432&categoryId=0&sectionId=4471"


def parse_attachments(attachments: List[model.AttachmentModel]) -> str:
    if isinstance(attachments, list):
        thumbnail_urls = [x.thumbnailUrl for x in attachments]
        return next((x for x in thumbnail_urls if not x is None), None)
    return None


def parse_categories(categories: List[model.CategoryModel]) -> List[str]:
    if isinstance(categories, list):
        category_names = [x.name for x in categories]
        return [x for x in category_names if not x is None]
    return []


def parse_game_versions(
        versions: List[model.GameVersionLatestFileModel]) -> str:
    if isinstance(versions, list):
        version_names = [x.gameVersion for x in versions]
        return next((x for x in version_names if not x is None), None)
    return None


def parse_modpack(modpack_model: model.ModpackModel) -> Modpack:
    return Modpack(
        id=modpack_model.id,
        name=modpack_model.name,
        website_url=modpack_model.websiteUrl,
        summary=modpack_model.summary,
        thumbnail_url=parse_attachments(modpack_model.attachments),
        categories=parse_categories(modpack_model.categories),
        download_count=modpack_model.downloadCount,
        default_file_id=modpack_model.defaultFileId,
        version=parse_game_versions(modpack_model.gameVersionLatestFiles))


def has_server_file(modpack_model: model.ModpackModel) -> bool:
    server_files = [
        file for file in modpack_model.latestFiles
        if not file.serverPackFileId is None]
    return len(server_files) > 0


def get_modpack(modpack_id: strawberry.ID) -> Modpack:
    url = f"{API_BASE_URL}{modpack_id}"
    error_base = f"The modpack with id: {modpack_id}"
    try:
        with urlopen(url) as response:
            data = json.loads(response.read())
            modpack_model = model.ModpackModel(**data)
    except HTTPError as error:
        raise Exception(f"{error_base} could not be retrieved") from error
    except ValidationError as error:
        raise Exception(f"{error_base} is not in a valid format") from error
    if has_server_file(modpack_model):
        return parse_modpack(modpack_model)
    raise Exception(f"{error_base} has no server pack available")


def get_modpacks(page: int = 0, search: str = "") -> List[Modpack]:
    page_size = 50
    query_string_filters = f"&pageSize={page_size}&index={page * page_size}&searchFilter={search}"
    url = f"{API_BASE_URL}search?{QUERY_STRING_BASE}{query_string_filters}"
    with urlopen(url) as response:
        data = json.loads(response.read())
    modpack_models = []
    for modpack in data:
        try:
            modpack_model = model.ModpackModel(**modpack)
        except ValidationError as error:
            logging.error(error)
        if has_server_file(modpack_model):
            modpack_models.append(modpack_model)
    return [parse_modpack(x) for x in modpack_models]
