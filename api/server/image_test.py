from server.image import Image


class TestParseHostPorts:
    @staticmethod
    def test_image_with_no_tag():
        actual = Image("container-name")
        assert actual.name == "container-name"
        assert actual.tag == "latest"

    @staticmethod
    def test_image_with_empty_tag():
        actual = Image("container-name:")
        assert actual.name == "container-name"
        assert actual.tag == "latest"

    @staticmethod
    def test_image_with_tag():
        actual = Image("container-name:tag-name")
        assert actual.name == "container-name"
        assert actual.tag == "tag-name"
