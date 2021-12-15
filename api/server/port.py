from typing import Optional
import strawberry


def parse_host_ports(host_ports) -> Optional[int]:
    if isinstance(host_ports, list) and len(host_ports) > 0:
        return host_ports[0].get("HostPort")
    return None


@strawberry.type
class Port:
    # pylint: disable=too-few-public-methods
    port: str
    host_port: Optional[int]

    def __init__(self, port: str, host_ports):
        self.port = port
        host_port = None
        if isinstance(host_ports, list):
            host_port = host_ports[0].get("HostPort")
        self.host_port = host_port
