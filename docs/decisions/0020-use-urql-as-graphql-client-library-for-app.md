# Use URQL as GraphQL client library for app

## Context and Problem Statement

We need to pick a client library for fetching data from our GraphQL API.

Which one should we choose?

## Considered Options

* [Apollo Client](https://www.apollographql.com/docs/react/) - The best way to build with GraphQL.
* [Relay](https://relay.dev/) - The GraphQL client that scales with you.
* [URQL](https://formidable.com/open-source/urql/) - The highly customizable and versatile GraphQL client for React, Svelte, Vue, or plain JavaScript, with which you add on features like normalized caching as you grow..

## Decision Outcome

Chosen option: "URQL", because
* Relay has a steeper learning curve but provides scalability this app does not require.
* Apollo client doubled our app's bundle size and significantly increased build times.
* URQL appears to have the [same features](https://formidable.com/open-source/urql/docs/comparison/) as Apollo but is much leaner.

## Links

* [ADR-0003](0003-implement-a-graphql-endpoint.md) - Implement a GraphQL endpoint
* [ADR-0017](0017-use-react-as-framework-for-app.md) - Use React as UI framework for app
