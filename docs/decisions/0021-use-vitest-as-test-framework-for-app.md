# Use Vitest as test framework for app

## Context and Problem Statement

We need to pick a test framework for testing our app.

Which one should we choose?

## Considered Options

* [Jest](https://jestjs.io/) - Delightful JavaScript Testing.
* [Mocha](https://mochajs.org/) - The fun, simple, flexible JavaScript test framework.
* [Vitest](https://vitest.dev/) - A blazing fast unit-test framework powered by Vite.

## Decision Outcome

Chosen option: "Vitest", because
* Our previous choice, Jest,
  * is the default testing framework used by many React projects.
  * is slow to run even a small number of tests.
  * has a test runner in VS Code that is less reliable and feature-ful than the Python test runner we are familiar with.
* Vitest integrates with our chosen application bundler, Vite.
* Vitest has almost all the features of Jest that we require.

### Positive Consequences

* The development feedback loop has been significantly sped up.

### Negative Consequences

* It is not currently possible to use the [custom matchers from @testing-library/jest-dom](https://github.com/testing-library/jest-dom).

## Links

* [ADR-0017](0017-use-react-as-framework-for-app.md) - Use React as UI framework for app
* [ADR-0018](0018-use-vite-as-bundler-for-app.md) - Use Vite as bundler for app
* [ADR-0019](0019-use-jest-as-test-framework-for-app.md) - Use Jest as test framework for app
