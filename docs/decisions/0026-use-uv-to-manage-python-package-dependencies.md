# Use uv to manage python package dependencies

## Context and Problem Statement

We need to pick a package dependency management tool for our Python projects.

Which one should we choose?

## Considered Options

* [Pipenv](https://pipenv.pypa.io/).
* [Poetry](https://python-poetry.org/).
* [uv](https://docs.astral.sh/uv/).

## Decision Outcome

Chosen option: "uv", because
* uv allows us to easily install different versions of python independently of the version installed with our operating system.

## Links

* [ADR-0004](0004-use-python-for-api.md) - Use python for API
* [ADR-0026](0005-use-pipenv-to-manage-python-package-dependencies.md) - Use Pipenv to manage python package dependencies.
