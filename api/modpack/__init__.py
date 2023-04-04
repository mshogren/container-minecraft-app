from dataclasses import dataclass
import json
import logging
import tempfile
import zipfile
from typing import List, Optional
from urllib.error import HTTPError
from urllib.parse import quote
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


@dataclass
class ModpackInfo:
    # pylint: disable=too-few-public-methods
    url: str
    modloader: Optional[str]
    modloader_version: Optional[str]


def parse_attachments(
        attachments: Optional[List[model.AttachmentModel]]) -> Optional[str]:
    if isinstance(attachments, list):
        thumbnail_urls = [x.thumbnailUrl for x in attachments]
        return next((x for x in thumbnail_urls if not x is None), None)
    return None


def parse_categories(
        categories: Optional[List[model.CategoryModel]]) -> List[str]:
    if isinstance(categories, list):
        category_names = [x.name for x in categories]
        return [x for x in category_names if not x is None]
    return []


def parse_game_versions(
        versions: Optional[List[model.GameVersionLatestFileModel]]) -> Optional[str]:
    if isinstance(versions, list):
        version_names = [x.gameVersion for x in versions]
        return next((x for x in version_names if not x is None), None)
    return None


def parse_modpack(modpack_model: model.ModpackModel) -> ModpackSchemaType:
    return ModpackSchemaType(
        id=strawberry.ID(modpack_model.id),
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


def get_modpack_file_model(
        modpack_id: str, default_file_id: str) -> model.ModpackFileModel:
    url = f"{API_BASE_URL}{modpack_id}/file/{default_file_id}"
    with urlopen(url) as response:
        data = json.loads(response.read())
    return model.ModpackFileModel(**data)


def get_modpack_filename(website_url) -> str:
    files_url = f"{GOOGLE_CACHE_BASE_URL}{website_url}/files"
    html = PyQuery(url=files_url)
    filename = html("h2:contains('Additional Files')").next().find(
        "span:contains('Filename')").next().text()
    return quote(str(filename))


def get_modpack_loader(file_model: model.ModpackFileModel) -> Optional[str]:
    file_name = file_model.fileName
    download_url = file_model.downloadUrl.replace(
        file_name, quote(file_name))
    with tempfile.TemporaryFile() as modpack_file, urlopen(download_url) as response:
        modpack_file.write(response.read())
        with zipfile.ZipFile(modpack_file) as zipped_modpack:
            with zipped_modpack.open("manifest.json") as manifest:
                data = json.loads(manifest.read())
    manifest_model = model.ModpackManifestModel(**data)
    return next((x.id for x in manifest_model.minecraft.modLoaders), None)


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
            modpack_model = None
            try:
                modpack_model = model.ModpackModel(**modpack)
            except ValidationError as error:
                logging.error(error)
            if modpack_model is not None and has_server_file(modpack_model):
                modpack_models.append(modpack_model)
        return [parse_modpack(x) for x in modpack_models]

    @staticmethod
    def get_modpack_info(modpack: ModpackSchemaType) -> ModpackInfo:
        error_base = f"The modpack file for modpack id: {modpack.id}"
        try:
            filename = get_modpack_filename(modpack.website_url)
            file_model = get_modpack_file_model(
                modpack.id, modpack.default_file_id)
            server_file_id = file_model.serverPackFileId
            modloader_string = get_modpack_loader(file_model)
            modloader, modloader_version = [None, None]
            if not modloader_string is None:
                split = modloader_string.split("-")
                if len(split) >= 2:
                    modloader, modloader_version = split
        except HTTPError as error:
            message = f"{error_base} could not be retrieved"
            raise ModpackError(message) from error
        except ValidationError as error:
            message = f"{error_base} is not in a valid format"
            raise ModpackError(message) from error
        if filename is None or filename == "":
            message = f"{error_base} could not be retrieved"
            raise ModpackError(message)
        return ModpackInfo(
            url=f"{DOWNLOADS_BASE_URL}{server_file_id[:4]}/{server_file_id[4:]}/{filename}",
            modloader=modloader,
            modloader_version=modloader_version)
