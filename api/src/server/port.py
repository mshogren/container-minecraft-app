from typing import Optional

import strawberry
from ..settings import SchemaLabels as labels


def parse_host_ports(host_ports) -> Optional[int]:
    if isinstance(host_ports, list):
        return next(
            (x.get("HostPort") for x in host_ports
             if not x.get("HostPort") is None),
            None)
    return None


@ strawberry.type(
    name=labels.PORT_TYPE_NAME,
    description=labels.PORT_TYPE_DESCRIPTION)
class Port:
    # pylint: disable=too-few-public-methods
    host_port: Optional[int] = strawberry.field(
        name=labels.PORT_HOSTPORT_FIELD_NAME,
        description=labels.PORT_HOSTPORT_FIELD_DESCRIPTION)
    port: str = strawberry.field(
        name=labels.PORT_PORT_FIELD_NAME,
        description=labels.PORT_PORT_FIELD_DESCRIPTION)

    def __init__(self, port: str, host_ports):
        self.port = port
        self.host_port = parse_host_ports(host_ports)
