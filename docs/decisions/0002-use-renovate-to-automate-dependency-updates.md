# Use renovate to automate dependency updates

## Context and Problem Statement

We want to have dependencies for this project kept up to date 
* for security reasons
* to maintain compatibility with latest runtime, tool and library versions

How should we achieve this?

## Considered Options

* [renovate](https://github.com/renovatebot/renovate) - Universal dependency update tool that fits into your workflows.
* [dependabot](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/about-dependabot-version-updates) - Automated dependency updates built into GitHub
* [snyk](https://snyk.io/)

## Decision Outcome

Chosen option: "renovate", because 
* renovate is open source and available to run ourselves should we need to in the future
* renovate is easy to integrate with our source repository (renovatebot creates a single pull request)
* dependabot appears to only be available for use with github repositories, thereby limiting our future choices
* snyk does not check golang dependencies at this time