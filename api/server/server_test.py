from types import SimpleNamespace

from server import is_container_relevant


class TestIsContainerRelevant:
    @staticmethod
    def test_is_container_relevant_with_no_container():
        actual = is_container_relevant(None, None)
        assert actual is False

    @staticmethod
    def test_is_container_relevant_with_container_with_no_image():
        container = SimpleNamespace()
        actual = is_container_relevant(container, None)  # type: ignore
        assert actual is False

    @staticmethod
    def test_is_container_relevant_with_matching_image_name():
        container = SimpleNamespace()
        container.image = "'image1:tag1'"
        actual = is_container_relevant(container, "image1")  # type: ignore
        assert actual is True

    @staticmethod
    def test_is_container_relevant_with_partial_matching_image_name():
        container = SimpleNamespace()
        container.image = "'image1:tag1'"
        actual = is_container_relevant(container, "age1")  # type: ignore
        assert actual is False

    @staticmethod
    def test_is_container_relevant_without_image_name():
        container = SimpleNamespace()
        container.image = "'image1:tag1'"
        actual = is_container_relevant(container, None)  # type: ignore
        assert actual is False
