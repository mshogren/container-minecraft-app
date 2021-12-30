import json
from urllib.request import urlopen

import pytest

from modpack import API_BASE_URL, QUERY_STRING_BASE, has_server_file


@pytest.mark.skip
def test_external_modpack_data_assumptions():
    data = []
    page_size = 50
    pages = 4
    for page in range(pages):
        query_string_filters = f"&pageSize={page_size}&index={page * page_size}"
        url = f"{API_BASE_URL}search?{QUERY_STRING_BASE}{query_string_filters}"
        print(url)
        with urlopen(url) as response:
            data += json.loads(response.read())

    assert len(data) == pages * page_size

    ids = map(lambda x: x["id"], data)
    assert len(set(ids)) == pages * page_size

    modpacks_with_latest_files = [
        modpack for modpack in data if not modpack.get("latestFiles") is None]
    assert len(modpacks_with_latest_files) == pages * page_size

    modpacks_with_game_version_latest_files = [
        modpack for modpack in data
        if not modpack.get("gameVersionLatestFiles") is None]
    assert len(modpacks_with_game_version_latest_files) == pages * page_size

    modpacks_with_server_files = [
        modpack for modpack in data if has_server_file(modpack)]
    assert len(modpacks_with_server_files) < pages * page_size
