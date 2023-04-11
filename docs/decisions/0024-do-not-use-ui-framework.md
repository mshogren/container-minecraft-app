# Do not use a UI framework

## Context and Problem Statement

To create an app with good quality and usability, and particularly a consistent look and feel, it could be good to utilize a UI framework that provides complex UI components.  Which UI framework should we use?

## Considered Options

* [Reactstrap](https://reactstrap.github.io/)
* [Material UI](https://mui.com/)
* No UI framework - we will use a minimal CSS library for a consistent look and feel.

## Decision Outcome

Chosen option: "No UI framework", because
* We have no immediate need for complex UI components like sliders, data grids, etc.
* Avoiding extra dependencies allows us to keep the bundle small and to lower complexity.

## Links

* [ADR-0017](0017-use-react-as-framework-for-app.md) - Use React as UI framework for app
