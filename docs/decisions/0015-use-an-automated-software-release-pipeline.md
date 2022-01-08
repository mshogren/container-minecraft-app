# Use an automated software release pipeline

## Context and Problem Statement

We need to pick a method and associated tools to use to release our software package that
* reduces the friction and effort in releasing versioned software
* helps us generate release notes and changelogs
* maintains [semantic versioning](https://semver.org/)

Which one should we choose?

## Considered Options

* [semantic-release](https://semantic-release.gitbook.io/semantic-release/)
* [Standard Version](https://github.com/conventional-changelog/standard-version)
* [Release Please Action](https://github.com/marketplace/actions/release-please-action)
* [Conventional Changelog Action](https://github.com/marketplace/actions/conventional-changelog-action)
* [Manual processes for packaging](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#pushing-container-images) and [release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)

## Decision Outcome

Chosen option: "Conventional Changelog Action", because
* It provides a very flexible and fully automated solution without requiring many dependencies to be downloaded.
* semantic-release is extremely flexible but aimed at npm package publishers and somewhat more complicated for non-default configurations.
* semantic-release requires downloading more Javascript dependencies
* Standard Version is not a fully automated tool
* Release Please Action is missing some of the configuration options of the other tools, and creates release pull requests that still need to be merged (this might be worth consideration if the first decision doesn't go well).
* Manual processes are error prone and may be ignored or forgotten once changes become less frequent.
