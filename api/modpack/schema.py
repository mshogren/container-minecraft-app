from typing import List, Optional

import strawberry
from settings import SchemaLabels as labels


@strawberry.type(
    name=labels.MODPACK_TYPE_NAME,
    description=labels.MODPACK_TYPE_DESCRIPTION)
class Modpack:
    # pylint: disable=too-few-public-methods
    categories: List[str] = strawberry.field(
        name=labels.MODPACK_CATEGORIES_FIELD_NAME,
        description=labels.MODPACK_CATEGORIES_FIELD_DESCRIPTION)
    default_file_id: str = strawberry.field(
        name=labels.MODPACK_DEFAULT_FILE_ID_FIELD_NAME,
        description=labels.MODPACK_DEFAULT_FILE_ID_FIELD_DESCRIPTION)
    download_count: int = strawberry.field(
        name=labels.MODPACK_DOWNLOADCOUNT_FIELD_NAME,
        description=labels.MODPACK_DOWNLOADCOUNT_FIELD_DESCRIPTION)
    id: strawberry.ID = strawberry.field(
        name=labels.MODPACK_ID_FIELD_NAME,
        description=labels.MODPACK_ID_FIELD_DESCRIPTION)
    name: str = strawberry.field(
        name=labels.MODPACK_NAME_FIELD_NAME,
        description=labels.MODPACK_NAME_FIELD_DESCRIPTION)
    summary: str = strawberry.field(
        name=labels.MODPACK_SUMMARY_FIELD_NAME,
        description=labels.MODPACK_SUMMARY_FIELD_DESCRIPTION)
    thumbnail_url: Optional[str] = strawberry.field(
        name=labels.MODPACK_THUMBNAILURL_FIELD_NAME,
        description=labels.MODPACK_THUMBNAILURL_FIELD_DESCRIPTION)
    version: str = strawberry.field(
        name=labels.MODPACK_VERSION_FIELD_NAME,
        description=labels.MODPACK_VERSION_FIELD_DESCRIPTION)
    website_url: str = strawberry.field(
        name=labels.MODPACK_WEBSITEURL_FIELD_NAME,
        description=labels.MODPACK_WEBSITEURL_FIELD_DESCRIPTION)
