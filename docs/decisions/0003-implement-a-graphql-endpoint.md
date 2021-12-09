# Implement a GraphQL endpoint

## Context and Problem Statement

We need to pick an architectural approach to communication between our app and its backend APIs
* that provides us with an opportunity to learn new approaches and technologies
* allows us to implement the technical requirements of the project
* allows us to be productive
Which one should we choose?

## Decision Drivers

* [Backends for Frontends](https://samnewman.io/patterns/architectural/bff/) - Following this principle has some benefits that we would like to learn more about.
* [CQRS (Command Query Responsibility Segregation)](https://martinfowler.com/bliki/CQRS.html) - Following this principle has some benefits that we would like to learn more about.
* Real-time subscriptions will provide a more responsive UI if available.

## Considered Options

* [GraphQL](https://graphql.org/)
* [REST](https://www.redhat.com/en/topics/api/what-is-a-rest-api)
* [gRPC](https://grpc.io/)
* [SOAP](https://en.wikipedia.org/wiki/SOAP)

## Decision Outcome

Chosen option: "GraphQL", because
* GraphQL separates queries from mutations, helping to fulfil the CQRS design principle.
* GraphQL provides for real-time subscriptions as part of the spec.
* GraphQL provides mechanisms for continuous evolution of a schema.
* REST is a set of constraints, rather than a standard, and implementations are often too vague and unopinionated to drive quick, consistent development progress.
* Modeling non-CRUD operations on data in REST is clunky.
* gRPC requires extra effort to keep the protocol between the services and their clients synchronized.
* gRPCs benefits mostly concern performance, which is not a high priority for this project.
* SOAP is considered a legacy technology and is very heavyweight for this project.
* GraphQL is a more marketable skill than the others at this time.
