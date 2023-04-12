# Use cypress for end-to-end tests

## Context and Problem Statement

Automated dependency updates in the project ended up causing a bug that was not caught by the unit tests in place.  Integration tests of the API including a real Docker back-end likely would have caught it.  However at the current scale of the project, it seems likely to be simpler to implement a very few end-to-end tests rather than integration tests.  These end-to-end tests will signal problems adequately and cover more possible bugs.  API Integration tests would probably allow a faster and more precise way to determine the cause of and resolve bugs like the one that was found, but wouldn't cover interactions between the UI and the API.

Having decided to build some end-to-end tests the decision required is which end-to-end testing framework should we use.  We need to pick one
* that provides us with an opportunity to learn a new ecosystem
* allows us to implement the technical requirements of the project
* allows us to be productive

Which one should we choose?

## Considered Options

* [Cypress](https://www.cypress.io/) - With Cypress, you can easily create tests for your modern web applications, debug them visually, and automatically run them in your continuous integration builds.
* [Playwright](https://playwright.dev/) - Playwright enables reliable end-to-end testing for modern web apps.
* [Puppeteer](https://pptr.dev/) - Puppeteer is a Node.js library which provides a high-level API to control Chrome/Chromium over the DevTools Protocol. Puppeteer runs in headless mode by default, but can be configured to run in full (non-headless) Chrome/Chromium.
* [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) - WebDriver drives a browser natively, as a user would, either locally or on a remote machine using the Selenium server, marks a leap forward in terms of browser automation.

## Decision Outcome

Chosen option: "Cypress", because
* Cypress appears to be easier to initially setup than Playwright.
* The documentation for using Cypress appears to more complete and easier to follow than Playwright's documentation.
* Puppeteer is an automation tool rather than a testing tool and does not have built in testing and assertion helpers.
* Puppeteer only works with Chrome, which may hamper future testing efforts as the project matures.
* Selenium is older and slower but supports older browsers, which is not a requirement that we have.

## Links

* [ADR-0002](0002-use-renovate-to-automate-dependency-updates.md) - Use renovate to automate dependency updates
