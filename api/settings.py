from pydantic import BaseSettings


class Settings(BaseSettings):
    # pylint: disable=too-few-public-methods
    default_image: str = "itzg/minecraft-server"
