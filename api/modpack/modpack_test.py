import json

import pytest

from modpack import (has_server_file, parse_attachments, parse_categories,
                     parse_game_versions)
from modpack.model import (AttachmentModel, CategoryModel,
                           GameVersionLatestFileModel, LatestFileModel,
                           ModpackModel)


@pytest.fixture
def modpack_model():
    data = {
        "attachments": [],
        "categories": [],
        "defaultFileId": "fileId",
        "downloadCount": 0,
        "gameVersionLatestFiles": [],
        "id": "",
        "latestFiles": [],
        "name": "",
        "summary": "",
        "websiteUrl": ""
    }
    return ModpackModel(**data)


class TestHasServerFile:
    # pylint: disable=redefined-outer-name
    @staticmethod
    def test_has_server_file_with_empty_latest_files(modpack_model):
        assert not has_server_file(modpack_model)

    @staticmethod
    def test_has_server_file_with_null_files_in_latest_files(modpack_model):
        latest_file = json.loads('{"id": "fileId", "serverPackFileId": null}')
        modpack_model.latestFiles.append(LatestFileModel(**latest_file))
        assert not has_server_file(modpack_model)

    @staticmethod
    def test_has_server_file_with_mismatched_file_ids(modpack_model):
        latest_file = {"id": "", "serverPackFileId": 11}
        modpack_model.latestFiles.append(LatestFileModel(**latest_file))
        assert not has_server_file(modpack_model)

    @staticmethod
    def test_has_server_file_with_matching_file_ids(modpack_model):
        latest_file = {"id": "fileId", "serverPackFileId": 11}
        modpack_model.latestFiles.append(LatestFileModel(**latest_file))
        assert has_server_file(modpack_model)


class TestParseGameVersions:
    @staticmethod
    def test_parse_game_versions_with_no_versions():
        actual = parse_game_versions(None)
        assert actual is None

    @staticmethod
    def test_parse_game_versions_with_empty_versions():
        actual = parse_game_versions(None)
        assert actual is None

    @staticmethod
    def test_parse_game_versions_with_invalid_versions():
        with pytest.raises(Exception):
            data = [{"Invalid": -1}]
            models = [GameVersionLatestFileModel(**x) for x in data]
            parse_game_versions(models)

    @staticmethod
    def test_parse_game_versions_with_valid_versions():
        data = [{"gameVersion": "testVersion"}]
        models = [GameVersionLatestFileModel(**x) for x in data]
        actual = parse_game_versions(models)
        assert actual == "testVersion"

    @staticmethod
    def test_parse_game_versions_with_multiple_valid_versions():
        data = [{"gameVersion": "testVersion1"},
                {"gameVersion": "testVersion2"}]
        models = [GameVersionLatestFileModel(**x) for x in data]
        actual = parse_game_versions(models)
        assert actual == "testVersion1"


class TestParseAttachments:
    @staticmethod
    def test_parse_attachments_with_no_attachments():
        actual = parse_attachments(None)
        assert actual is None

    @staticmethod
    def test_parse_attachments_with_empty_attachments():
        actual = parse_attachments([])
        assert actual is None

    @staticmethod
    def test_parse_attachments_with_invalid_attachments():
        with pytest.raises(Exception):
            data = [{"Invalid": -1}]
            models = [AttachmentModel(**x) for x in data]
            parse_attachments(models)

    @staticmethod
    def test_parse_attachments_with_valid_attachments():
        data = [{"thumbnailUrl": "testUrl"}]
        models = [AttachmentModel(**x) for x in data]
        actual = parse_attachments(models)
        assert actual == "testUrl"

    @ staticmethod
    def test_parse_attachments_with_multiple_valid_attachments():
        data = [{"thumbnailUrl": "testUrl1"}, {"thumbnailUrl": "testUrl2"}]
        models = [AttachmentModel(**x) for x in data]
        actual = parse_attachments(models)
        assert actual == "testUrl1"


class TestParseCategories:
    @ staticmethod
    def test_parse_categories_with_no_categories():
        actual = parse_categories(None)
        assert not list(actual)

    @ staticmethod
    def test_parse_categories_with_empty_categories():
        actual = parse_categories([])
        assert not list(actual)

    @ staticmethod
    def test_parse_categories_with_invalid_categories():
        with pytest.raises(Exception):
            data = [{"Invalid": -1}]
            models = [CategoryModel(**x) for x in data]
            parse_categories(models)

    @ staticmethod
    def test_parse_categories_with_valid_categories():
        data = [{"name": "testCategory"}]
        models = [CategoryModel(**x) for x in data]
        actual = parse_categories(models)
        assert actual == ["testCategory"]

    @ staticmethod
    def test_parse_categories_with_multiple_valid_categories():
        data = [{"name": "testCategory1"},
                {"name": "testCategory2"}]
        models = [CategoryModel(**x) for x in data]
        actual = parse_categories(models)
        assert actual == ["testCategory1", "testCategory2"]
