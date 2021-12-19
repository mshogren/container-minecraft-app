from version import Version, parse_versions


class TestParseVersions:
    @staticmethod
    def test_parse_versions_with_no_versions():
        actual = parse_versions(None)
        assert not list(actual)

    @staticmethod
    def test_parse_versions_with_empty_versions():
        actual = parse_versions([])
        assert not list(actual)

    @staticmethod
    def test_parse_versions_with_invalid_versions():
        actual = parse_versions(
            [{"Invalid": -1},
             {"type": "snapshot", "id": "11"},
             {"type": "release"}])
        assert not list(actual)

    @staticmethod
    def test_parse_versions_with_valid_versions():
        actual = parse_versions([{"type": "release", "id": "11"}])
        assert actual == [Version("11")]

    @staticmethod
    def test_parse_versions_with_multiple_versions():
        actual = parse_versions(
            [{"type": "release", "id": "11"},
             {"type": "snapshot", "id": "22"},
             {"type": "release", "id": "33"}])
        assert actual == [Version("11"), Version("33")]
