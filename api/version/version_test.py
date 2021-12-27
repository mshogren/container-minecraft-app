import pytest

from version import parse_versions


class TestParseVersions:
    @staticmethod
    def test_parse_versions_with_no_model():
        actual = parse_versions(None)
        assert not list(actual)

    @staticmethod
    def test_parse_versions_with_empty_model():
        with pytest.raises(Exception):
            parse_versions({})

    @staticmethod
    def test_parse_versions_with_no_versions():
        with pytest.raises(Exception):
            parse_versions({"versions": None})

    @staticmethod
    def test_parse_versions_with_empty_versions():
        actual = parse_versions({"versions": []})
        assert not list(actual)

    @staticmethod
    def test_parse_versions_with_invalid_versions():
        with pytest.raises(Exception):
            parse_versions(
                {"versions": [
                    {"Invalid": -1},
                    {"type": "snapshot", "id": "11"},
                    {"type": "release"}
                ]})

    @staticmethod
    def test_parse_versions_with_valid_versions():
        actual = parse_versions(
            {"versions": [{"type": "release", "id": "11"}]})
        assert actual == ["11"]

    @staticmethod
    def test_parse_versions_with_multiple_versions():
        actual = parse_versions(
            {"versions": [
                {"type": "release", "id": "11"},
                {"type": "snapshot", "id": "22"},
                {"type": "release", "id": "33"}
            ]})
        assert actual == ["11", "33"]
