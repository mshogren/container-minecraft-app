import strawberry
from typing_extensions import Annotated

from server import AddServerInput, AddServerResponse, add_server
from settings import SchemaLabels as labels


@strawberry.type(
    name=labels.MUTATION_TYPE_NAME,
    description=labels.MUTATION_TYPE_DESCRIPTION)
class Mutation:
    # pylint: disable=too-few-public-methods
    @strawberry.mutation(
        name=labels.MUTATION_ADDSERVER_FIELD_NAME,
        description=labels.MUTATION_ADDSERVER_FIELD_DESCRIPTION)
    @staticmethod
    def add_server_or_fail(server: Annotated[AddServerInput, strawberry.argument(
            name=labels.MUTATION_ADDSERVER_ARGUMENT_NAME,
            description=labels.MUTATION_ADDSERVER_ARGUMENT_DESCRIPTION)]) -> AddServerResponse:
        return add_server(server)
