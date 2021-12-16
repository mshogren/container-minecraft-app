from typing import Optional
import strawberry


def parse_host_ports(host_ports) -> Optional[int]:
    if isinstance(host_ports, list):
        return next(
            (x.get("HostPort") for x in host_ports
             if not x.get("HostPort") is None),
            None)
    return None


@ strawberry.type
class Port:
    # pylint: disable=too-few-public-methods
    port: str
    host_port: Optional[int]

    def __init__(self, port: str, host_ports):
        self.port = port
        self.host_port = parse_host_ports(host_ports)
