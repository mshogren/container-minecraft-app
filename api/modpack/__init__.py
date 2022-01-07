import json
import logging
from typing import List
from urllib.error import HTTPError
from urllib.request import urlopen

import strawberry
from pydantic import ValidationError
from pyquery import PyQuery

from modpack import model

from .schema import ModpackSchemaType

API_BASE_URL = "https://addons-ecs.forgesvc.net/api/v2/addon/"
GOOGLE_CACHE_BASE_URL = "http://webcache.googleusercontent.com/search?q=cache:"
DOWNLOADS_BASE_URL = "https://edge.forgecdn.net/files/"
QUERY_STRING_BASE = "gameId=432&categoryId=0&sectionId=4471"


class ModpackError(Exception):
    pass


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


def parse_modpack(modpack_model: model.ModpackModel) -> ModpackSchemaType:
    return ModpackSchemaType(
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
        if not file.serverPackFileId is None and file.id
        == modpack_model.defaultFileId]
    return len(server_files) > 0


def get_modpack_file_model(modpack_id: str, default_file_id: str):
    url = f"{API_BASE_URL}{modpack_id}/file/{default_file_id}"
    with urlopen(url) as response:
        data = json.loads(response.read())
    return model.ModpackFileModel(**data)


def get_modpack_filename(website_url) -> str:
    files_url = f"{GOOGLE_CACHE_BASE_URL}{website_url}/files"
    html = PyQuery(url=files_url)
    filename = html("h2:contains('Additional Files')").next().find(
        "span:contains('Filename')").next().text()
    return filename


class Modpack:
    @staticmethod
    def get_modpack(modpack_id: strawberry.ID) -> ModpackSchemaType:
        url = f"{API_BASE_URL}{modpack_id}"
        error_base = f"The modpack with id: {modpack_id}"
        try:
            with urlopen(url) as response:
                data = json.loads(response.read())
                modpack_model = model.ModpackModel(**data)
        except HTTPError as error:
            message = f"{error_base} could not be retrieved"
            raise ModpackError(message) from error
        except ValidationError as error:
            message = f"{error_base} is not in a valid format"
            raise ModpackError(message) from error
        if has_server_file(modpack_model):
            return parse_modpack(modpack_model)
        raise ModpackError(f"{error_base} has no server pack available")

    @staticmethod
    def get_modpacks(
            page: int = 0, search: str = "") -> List[ModpackSchemaType]:
        page_size = 50
        filters = f"&pageSize={page_size}&index={page * page_size}&searchFilter={search}"
        url = f"{API_BASE_URL}search?{QUERY_STRING_BASE}{filters}"
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

    @staticmethod
    def get_modpack_file(modpack: ModpackSchemaType) -> str:
        error_base = f"The modpack file for modpack id: {modpack.id}"
        try:
            filename = get_modpack_filename(modpack.website_url)
            file_model = get_modpack_file_model(
                modpack.id, modpack.default_file_id)
            server_file_id = file_model.serverPackFileId
        except HTTPError as error:
            message = f"{error_base} could not be retrieved"
            raise ModpackError(message) from error
        except ValidationError as error:
            message = f"{error_base} is not in a valid format"
            raise ModpackError(message) from error
        if filename is None or filename == "":
            message = f"{error_base} could not be retrieved"
            raise ModpackError(message)
        return f"{DOWNLOADS_BASE_URL}{server_file_id[:4]}/{server_file_id[4:]}/{filename}"
