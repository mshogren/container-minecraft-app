import strawberry
from settings import SchemaLabels as labels


@strawberry.type(name=labels.IMAGE_TYPE_NAME,
                 description=labels.IMAGE_TYPE_DESCRIPTION)
class Image:
    # pylint: disable=too-few-public-methods
    name: str = strawberry.field(
        name=labels.IMAGE_NAME_FIELD_NAME,
        description=labels.IMAGE_NAME_FIELD_DESCRIPTION)
    tag: str = strawberry.field(
        name=labels.IMAGE_TAG_FIELD_NAME,
        description=labels.IMAGE_TAG_FIELD_DESCRIPTION)

    def __init__(self, image: str):
        self.name = image
        self.tag = "latest"
