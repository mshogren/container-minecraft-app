# Use React hooks

## Context and Problem Statement

Since the last time we used it the React framework has introduced Hooks.  Should we use this new feature or continue to develop class-based React components with lifecycle methods, render-props, etc?

## Considered Options

* Use React Hooks
* Use class-based React components and implement lifecycle methods, render-props, etc.

## Decision Outcome

Chosen option: "Use React Hooks", because this seems to be the consensus opinion in articles written by exerts
* [Hooks FAQ](https://legacy.reactjs.org/docs/hooks-faq.html)
* [Why hooks are the best thing to happen to React](https://stackoverflow.blog/2021/10/20/why-hooks-are-the-best-thing-to-happen-to-react)

A summary of this consensus is that using hooks allows the creation of functional components that are simpler to develop, test and reason about, and these components will be more easily composable, flexible and extendable than the class-based alternative.

## Links

* [ADR-0017](0017-use-react-as-framework-for-app.md) - Use React as UI framework for app
