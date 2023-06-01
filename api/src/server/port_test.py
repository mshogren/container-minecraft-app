from .port import parse_host_ports


class TestParseHostPorts:
    @staticmethod
    def test_parse_host_ports_with_no_ports():
        assert parse_host_ports(None) is None

    @staticmethod
    def test_parse_host_ports_with_empty_ports():
        assert parse_host_ports([]) is None

    @staticmethod
    def test_parse_host_ports_with_invalid_ports():
        assert parse_host_ports([{"Invalid": -1}]) is None

    @staticmethod
    def test_parse_host_ports_with_valid_ports():
        assert parse_host_ports([{"Invalid": -1}, {"HostPort": 11}]) == 11

    @staticmethod
    def test_parse_host_ports_with_multiple_ports():
        assert parse_host_ports([{"HostPort": 22}, {"HostPort": 11}]) == 22
