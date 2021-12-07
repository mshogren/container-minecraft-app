import strawberry


@strawberry.type
class Modpack:
    name: str


def get_modpacks():
    return [
        Modpack(
            name="Test Modpack"
        )
    ]
