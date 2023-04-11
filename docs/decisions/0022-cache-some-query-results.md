# Cache some query results

## Context and Problem Statement

Some of the dropdown choices on the website are based on third-party data.  Loading them each time the dropdown is loaded in the UI is quite expensive.  Caching the results of this very static data would improve the UI performance.  What is the best option for caching the results of these queries?

## Considered Options

* Implement strawberry Data Loader pattern
* Use a python attribute to memoize the result of function calls

## Decision Outcome

Chosen option: "Use a python attribute to memoize the result of function calls", because
* The Data Loader pattern works well for calls to retrieve records by id, but is less useful for implementing the paginated lists that we are trying to utilize.
* Using an attribute to memoize the results of function calls is much simpler to implement that a Data Loader pattern.

### Positive Consequences

* Performance of the modpack and Minecraft version endpoints is much better in real world testing.

### Negative Consequences

* Memoization may not be a solution that can be generally applied to other API endpoints.

## Links

* [ADR-0004](0004-use-python-for-api.md) - Use python for API
* [ADR-0008](0008-use-strawberry-as-framework-for-graphql.md) - Use Strawberry as framework for GraphQL
