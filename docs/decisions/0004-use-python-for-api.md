# Use python for API

## Context and Problem Statement

We need to pick a programming language and associated tools to use to implement our API
* that provides us with an opportunity to learn a new ecosystem
* allows us to implement the technical requirements of the project
* allows us to be productive
Which one should we choose?

## Decision Drivers 
* The container run-times and orchestration technologies we have considered
  * docker
  * Kubernetes
  * Hashicorp Nomad
  each provide officially supported client libraries for Go and Python.
* Go and Python both have [library options for implementing a GraphQL API](https://graphql.org/code/#language-support).
* Go and Python are both languages that it would be useful to learn more about in the context of professional development.


## Considered Options

* [Python](https://www.python.org/).
* [Go](https://go.dev/).

## Decision Outcome

Chosen option: "Python", because 
* Python is quicker to prototype with.
* Python has a richer ecosystem.
* Python is easy to find answers to questions about on [Stack Overflow](https://stackoverflow.com/).

## Links

* [ADR-0003](0003-implement-a-graphql-endpoint.md)