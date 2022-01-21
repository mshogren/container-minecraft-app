# Use React as UI framework for app

## Context and Problem Statement

We need to pick a UI framework for building our app.

Which one should we choose?

## Decision Drivers

These are the core decision drivers
* Need formatting, linting and testing.
* May need a client-side router.
* Prefer fewer dependencies.
* Prefer smaller bundle size.

## Considered Options

* [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
* [Preact](https://preactjs.com/) - Fast 3kB alternative to React with the same modern API.
* [Vue](https://vuejs.org/) - The Progressive JavaScript Framework.
* [Svelte](https://svelte.dev/) - Cybernetically enhanced web apps.
* [Angular](https://angular.io/) - The modern web developer's platform.

## Decision Outcome

Chosen option: "React", because
* We are familiar with React.
* React has a very rich ecosystem.
* Preact provides a smaller bundle size, but at the cost of possible compatibility issues with tools/components designed for React.
* Angular has a large bundle size for such a small app.
