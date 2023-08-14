from typing import List, Optional

from pydantic import BaseModel


class ModpackFileModel(BaseModel):
    downloadUrl: Optional[str]
    fileName: str
    gameVersions: List[str]
    id: int
    serverPackFileId: Optional[int] = None


class AttachmentModel(BaseModel):
    thumbnailUrl: str


class CategoryModel(BaseModel):
    name: str


class GameVersionLatestFileModel(BaseModel):
    gameVersion: str


class LatestFileModel(BaseModel):
    id: int
    serverPackFileId: Optional[int] = None


class LinksModel(BaseModel):
    websiteUrl: str


class ModpackModel(BaseModel):
    logo: AttachmentModel
    categories: List[CategoryModel]
    mainFileId: int
    downloadCount: int
    latestFilesIndexes: List[GameVersionLatestFileModel]
    id: int
    latestFiles: List[LatestFileModel]
    name: str
    summary: str
    links: LinksModel


class ModpackManifestModloaderModel(BaseModel):
    id: str


class ModpackManifestMinecraftModel(BaseModel):
    version: str
    modLoaders: List[ModpackManifestModloaderModel]


class ModpackManifestModel(BaseModel):
    minecraft: ModpackManifestMinecraftModel
