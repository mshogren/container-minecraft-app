import strawberry


@strawberry.type
class Volume:
    # pylint: disable=too-few-public-methods
    name: str
    source: str

    def __init__(self, volume):
        self.name = volume["Name"]
        self.source = volume["Source"]
