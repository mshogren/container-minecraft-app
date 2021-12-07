from types import SimpleNamespace

import server


def test_is_container_relevant_with_no_container():
    actual = server.is_container_relevant(None, None)
    assert actual is False


def test_is_container_relevant_with_container_with_no_image():
    container = SimpleNamespace()
    actual = server.is_container_relevant(container, "image1")
    assert actual is False


def test_is_container_relevant_with_matching_image_name():
    container = SimpleNamespace()
    container.image = "'image1:tag1'"
    actual = server.is_container_relevant(container, "image1")
    assert actual is True


def test_is_container_relevant_with_partial_matching_image_name():
    container = SimpleNamespace()
    container.image = "'image1:tag1'"
    actual = server.is_container_relevant(container, "age1")
    assert actual is False


def test_is_container_relevant_without_image_name():
    container = SimpleNamespace()
    container.image = "'image1:tag1'"
    actual = server.is_container_relevant(container, None)
    assert actual is False
