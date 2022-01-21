# Use Vite as bundler for app

## Context and Problem Statement

We need to pick a bundler/framework for building our app.

Which one should we choose?

## Decision Drivers

These are the core decision drivers
* Want a pure static site.
* Don't need SEO, SSR, splitting, etc.
* Prefer not to worry about bundler setup.
* Need formatting, linting and testing.
* Prefer fewer dependencies.
* Prefer smaller bundle size.
* Prefer flexibility in configuration.

## Considered Options

* [Next.js](https://nextjs.org/) - The React Framework for Production.
* [Create React App](https://create-react-app.dev/) - Set up a modern web app by running one command.
* [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling.


## Decision Outcome

Chosen option: "Vite", because
* Vite is a tool that is compatible for use with Svelte or Vue if we decide to change UI frameworks in the future.
* Create React App is simple but opinionated and less flexible.
* Create React App has a bigger dependency tree.
* Next.js has a large bundle size for such a small app.
* Next doesn't generate a pure static website very easily.  It loads capabilities for SSR and hydration which will not nbe used for our app.

## Links

* [ADR-0017](0017-use-react-as-framework-for-app.md) - Use React as UI framework for app
