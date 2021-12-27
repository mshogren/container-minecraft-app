# Use Uvicorn as web server

## Context and Problem Statement

We need to pick a Python ASGI server to serve our APIs.

Which one should we choose?

## Considered Options

* [Uvicorn](https://www.uvicorn.org/).

## Decision Outcome

Chosen option: "Uvicorn", because 
* Uvicorn is recommended by default by [FastAPI](https://fastapi.tiangolo.com/).

## Links

* [ADR-0004](0004-use-python-for-api.md)
* [ADR-0006](0006-use-fastapi-as-framework-for-api.md)