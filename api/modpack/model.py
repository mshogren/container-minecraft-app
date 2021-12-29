from typing import List, Optional

from pydantic import BaseModel


class AttachmentModel(BaseModel):
    # pylint: disable=too-few-public-methods
    thumbnailUrl: str


class CategoryModel(BaseModel):
    # pylint: disable=too-few-public-methods
    name: str


class GameVersionLatestFileModel(BaseModel):
    # pylint: disable=too-few-public-methods
    gameVersion: str


class LatestFileModel(BaseModel):
    # pylint: disable=too-few-public-methods
    serverPackFileId: Optional[str]


class ModpackModel(BaseModel):
    # pylint: disable=too-few-public-methods
    attachments: List[AttachmentModel]
    categories: List[CategoryModel]
    defaultFileId: str
    downloadCount: int
    gameVersionLatestFiles: List[GameVersionLatestFileModel]
    id: str
    latestFiles: List[LatestFileModel]
    name: str
    summary: str
    websiteUrl: str
