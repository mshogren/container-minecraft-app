# Use pydantic for python application configuration management

## Context and Problem Statement

We need to pick a Python library for managing application configuration.

Which one should we choose?

## Considered Options

* [pydantic](https://pydantic-docs.helpmanual.io/)

## Decision Outcome

Chosen option: "pydantic", because 
* It is already installed by FastAPI
* It is also useful for working with the external APIs because we can create a model for data returned by those APIs that allows us
    * to validate the data against the model
    * minimize the use of [magic strings](https://softwareengineering.stackexchange.com/a/365344) in referring to parts of the data
    * reducing the possibility of certain classes of runtime errors

## Links

* [ADR-0004](0004-use-python-for-api.md)
* [ADR-0006](0006-use-fastapi-as-framework-for-api.md)