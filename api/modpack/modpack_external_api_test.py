import json
from typing import List
from urllib.request import Request, urlopen

import pytest

from modpack import API_BASE_URL, API_KEY, QUERY_STRING_BASE, Modpack, get_modpack_file_model
from modpack.schema import ModpackSchemaType


def has_server_file(modpack) -> bool:
    server_files = [file for file in modpack.get("latestFiles") if not file.get(
        "serverPackFileId") is None and file.get("id") == modpack.get("mainFileId")]
    return len(server_files) > 0


def do_versions_match(modpack: ModpackSchemaType) -> bool:
    modpack_file = get_modpack_file_model(modpack.id, modpack.default_file_id)
    result = modpack.version in modpack_file.gameVersions
    if not result:
        print(f"{modpack.id}")
    return result


@pytest.mark.skip
class TestExternalModpackAPI:
    @staticmethod
    def test_server_file_versions():
        data: List[ModpackSchemaType] = []
        pages = 4
        for page in range(pages):
            data += Modpack.get_modpacks(page)

        modpacks_where_server_file_version_matches_modpack_version = [
            modpack for modpack in data
            if do_versions_match(modpack)]

        assert len(
            modpacks_where_server_file_version_matches_modpack_version) == len(data)

    @ staticmethod
    def test_external_modpack_data_assumptions():
        data = []
        page_size = 50
        pages = 4
        for page in range(pages):
            query_string_filters = f"&pageSize={page_size}&index={page * page_size}"
            url = f"{API_BASE_URL}search?{QUERY_STRING_BASE}{query_string_filters}"
            print(url)
            request = Request(url=url)
            request.add_header("X-API-KEY", API_KEY)
            with urlopen(request) as response:
                result = json.loads(response.read())
                data += result["data"]

        assert len(data) == pages * page_size

        ids = map(lambda x: x["id"], data)
        assert len(set(ids)) == pages * page_size

        modpacks_with_latest_files = [
            modpack for modpack in data
            if not modpack.get("latestFiles") is None]
        assert len(modpacks_with_latest_files) == pages * page_size

        modpacks_with_game_version_latest_files = [
            modpack for modpack in data
            if not modpack.get("latestFilesIndexes") is None]
        assert len(modpacks_with_game_version_latest_files) == pages * page_size

        modpacks_with_server_files = [
            modpack for modpack in data if has_server_file(modpack)]
        assert len(modpacks_with_server_files) == pages * page_size
