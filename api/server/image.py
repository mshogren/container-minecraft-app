import strawberry


@strawberry.type
class Image:
    name: str
    tag: str

    def __init__(self, image: str):
        self.name = image
        self.tag = "latest"
