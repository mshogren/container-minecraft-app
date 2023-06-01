import strawberry

from .model import VolumeModel
from ..settings import SchemaLabels as labels


@strawberry.type(
    name=labels.VOLUME_TYPE_NAME,
    description=labels.VOLUME_TYPE_DESCRIPTION)
class Volume:
    # pylint: disable=too-few-public-methods
    name: str = strawberry.field(
        name=labels.VOLUME_NAME_FIELD_NAME,
        description=labels.VOLUME_NAME_FIELD_DESCRIPTION)
    source: str = strawberry.field(
        name=labels.VOLUME_SOURCE_FIELD_NAME,
        description=labels.VOLUME_SOURCE_FIELD_DESCRIPTION)

    def __init__(self, volume: VolumeModel):
        self.name = volume.Name
        self.source = volume.Source
