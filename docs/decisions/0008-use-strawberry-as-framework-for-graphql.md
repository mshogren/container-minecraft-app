# Use Strawberry as framework for GraphQL

## Context and Problem Statement

We need to pick a Python library to help us implement our GraphQL APIs.

Which one should we choose?

## Considered Options

* [Graphene](https://graphene-python.org/).
* [Strawberry](https://strawberry.rocks/).

## Decision Outcome

Chosen option: "Strawberry", because 
* Strawberry is recommended by [FastAPI](https://fastapi.tiangolo.com/advanced/graphql/).
* Strawberry allows a [code-first](https://stackoverflow.com/questions/5446316/code-first-vs-model-database-first) approach which should make prototyping faster and easier than managing the API definition separately from the code that implements it.

## Links

* [ADR-0003](0003-implement-a-graphql-endpoint.md)
* [ADR-0004](0004-use-python-for-api.md)
* [ADR-0006](0006-use-fastapi-as-framework-for-api.md)