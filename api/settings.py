from pydantic import BaseSettings


class Settings(BaseSettings):
    default_image: str = "minecraft-server"
