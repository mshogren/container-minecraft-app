import json

from modpack import (has_server_file, parse_attachments, parse_categories,
                     parse_game_versions)


class TestHasServerFile:
    @staticmethod
    def test_has_server_file_with_no_latest_files():
        assert not has_server_file({})

    @staticmethod
    def test_has_server_file_with_empty_latest_files():
        assert not has_server_file({"latestFiles": []})

    @staticmethod
    def test_has_server_file_with_invalid_latest_files():
        assert not has_server_file({"latestFiles": [{"Invalid": -1}]})

    @staticmethod
    def test_has_server_file_with_null_files_in_latest_files():
        assert not has_server_file(json.loads(
            '{"latestFiles": [{"Invalid": -1}, {"serverPackFileId": null}]}'))

    @staticmethod
    def test_has_server_file_with_valid_latest_files():
        assert has_server_file(
            {"latestFiles": [{"Invalid": -1}, {"serverPackFileId": 11}]})


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
        actual = parse_game_versions([{"Invalid": -1}])
        assert actual is None

    @staticmethod
    def test_parse_game_versions_with_valid_versions():
        actual = parse_game_versions(
            [{"Invalid": -1}, {"gameVersion": "testVersion"}])
        assert actual == "testVersion"

    @staticmethod
    def test_parse_game_versions_with_multiple_valid_versions():
        actual = parse_game_versions(
            [{"gameVersion": "testVersion1"}, {"gameVersion": "testVersion2"}])
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
        actual = parse_attachments([{"Invalid": -1}])
        assert actual is None

    @staticmethod
    def test_parse_attachments_with_valid_attachments():
        actual = parse_attachments(
            [{"Invalid": -1}, {"thumbnailUrl": "testUrl"}])
        assert actual == "testUrl"

    @staticmethod
    def test_parse_attachments_with_multiple_valid_attachments():
        actual = parse_attachments(
            [{"thumbnailUrl": "testUrl1"}, {"thumbnailUrl": "testUrl2"}])
        assert actual == "testUrl1"


class TestParseCategories:
    @staticmethod
    def test_parse_categories_with_no_categories():
        actual = parse_categories(None)
        assert not list(actual)

    @staticmethod
    def test_parse_categories_with_empty_categories():
        actual = parse_categories([])
        assert not list(actual)

    @staticmethod
    def test_parse_categories_with_invalid_categories():
        actual = parse_categories([{"Invalid": -1}])
        assert not list(actual)

    @staticmethod
    def test_parse_categories_with_valid_categories():
        actual = parse_categories([{"Invalid": -1}, {"name": "testCategory"}])
        assert actual == ["testCategory"]

    @staticmethod
    def test_parse_categories_with_multiple_valid_categories():
        actual = parse_categories(
            [{"name": "testCategory1"},
             {"Invalid": -1},
             {"name": "testCategory2"}])
        assert actual == ["testCategory1", "testCategory2"]
