# Use Github Actions for CI/CD

## Context and Problem Statement

We need to pick a tool for Continuous Integration and Continuous Delivery
* that provides us with an opportunity to learn a new technology
* allows us to implement the technical requirements of the project
* allows us to be productive

Which one should we choose?

## Decision Drivers

These are the core decision drivers
* Cost, either monetary for a hosted service, or in time, effort and maintenance for a self-hosted solution.
* Plain text configuration allows the build configuration to be stored modified and diff'ed in the same repository as the source code for the project.
* Features
  * Monorepo compatibility
  * Build chaining
  * Storing and reusing build artifacts

Another nice-to-have set of features we are familiar with from TeamCity is build chaining, and defining artifact dependencies to speed up chained builds.
We can explain with an example
* Our project builds four separate things
  * A documentation website
  * An API backend
  * A front-end app
  * A container image to run the app and API together
* The container image should be rebuilt when any of the following three things happen
  * Its definition or external dependencies on other images have changed
  * The API backend has been changed
  * The front-end app has changed
* The container image does not need to be rebuilt if documentation has changed.
* The above requirements are handled quite well by all the tools mentioned below.
* In the case where building the API or the front-end are expensive operations, they should not be repeated when building the docker image.
* The docker build should retrieve artifacts from the API and app builds rather than repeating them.
* These sorts of artifact dependencies should be possible to define for even the most complex n-tier application projects

## Considered Options

* [Github Actions](https://docs.github.com/en/actions)
* [Azure DevOps Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops)
* [Gitlab CI/CD](https://docs.gitlab.com/ee/ci/index.html)
* [TravisCI](https://www.travis-ci.com/)
* [CircleCI](https://circleci.com/docs/)
* [TeamCity](https://www.jetbrains.com/help/teamcity/teamcity-documentation.html)
* [Jenkins](https://www.jenkins.io/doc/)

## Decision Outcome

Chosen option: "Github Actions", because
* TeamCity and Jenkins cost too much or require dedicated effort to install and run
* TravisCI is no longer free to use in all cases
* Github Actions has advanced features, good documentation, and is currently being improved by Github
* Github Actions is well integrated with our chosen source repository
* Github Actions may help with other tasks in a Github repository and be worth learning just for that
* The current project is not likely to require the advanced artifact dependencies and build chaining features mentioned above, but if it is unable to handle that in the future we can try to use Gitlab CI/CD or CircleCI instead, though it is not clear that they would be better.
