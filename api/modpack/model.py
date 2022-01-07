from typing import List, Optional

from pydantic import BaseModel


class ModpackFileModel(BaseModel):
    # pylint: disable=too-few-public-methods
    downloadUrl: str
    gameVersion: List[str]
    id: str
    serverPackFileId: str


class AttachmentModel(BaseModel):
    thumbnailUrl: str


class CategoryModel(BaseModel):
    name: str


class GameVersionLatestFileModel(BaseModel):
    gameVersion: str


class LatestFileModel(BaseModel):
    id: str
    serverPackFileId: Optional[str]


class ModpackModel(BaseModel):
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
