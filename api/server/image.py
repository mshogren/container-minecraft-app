import strawberry


@strawberry.type
class Image:
    # pylint: disable=too-few-public-methods
    name: str
    tag: str

    def __init__(self, image: str):
        self.name = image
        self.tag = "latest"
