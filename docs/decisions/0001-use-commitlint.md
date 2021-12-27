# Use commitlint

## Context and Problem Statement

We want to enforce standardized commit messages for this project for reasons outlined [here](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#why-use-conventional-commits). 

How should we achieve this?

## Considered Options

* [commitlint](https://github.com/conventional-changelog/commitlint) - Lint commit messages
* [commitizen](https://github.com/commitizen/cz-cli) - Simple commit conventions for internet citizens

## Decision Outcome

Chosen option: "commitlint", because 
* commitlint in conjunction with [husky](https://github.com/conventional-changelog/commitlint#getting-started) can enforce a standard commit message format for all users of the repository.  
* Other options including commitizen provide a way to assist users in creating well formatted commit messages without forcing the user to use them.  
* Use of these other tools should be left at the discretion of the individual.