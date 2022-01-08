# Avoid expensive modpack scraping

## Context and Problem Statement

 The external API we are calling requires two requests per modpack returned bya query, and won't allow us to batch requests using a dataloader pattern.

 How should we deal with this to ensure that our API is robust and performant?

## Considered Options

* Publish a GraphQL endpoint the allows the API users to resolve the URL of the server modpack file
* Retrieve the URL of the server modpack file just-in-time to use it while performing the mutation to add a server

## Decision Outcome

Chosen option: "Retrieve the URL of the server modpack file just-in-time to use it while performing the mutation to add a server", because after assessing the tradeoffs listed below, it was decided that a performant and robust API was more important in this case than flexibility, especially given the known use cases for the API.

## Pros and Cons of the Options

### Publish a GraphQL endpoint the allows the API users to resolve the URL of the server modpack file

The initial thoughts were that we would have a Modpack type in our schema as follows

```python
@strawberry.type
class Modpack:
    id: strawberry.ID
    name: str
    website_url: str
    summary: str
    thumbnail_url: Optional[str]
    categories: List[str]
    download_count: int

    @strawberry.field
    def modpack_server_file(self) -> str:
      return the_url
```

If the user queried and included the `modpack_server_file` field in the query it would execute the resolver.  If the query returned many modpacks then the resolver would be executed once for each modpack.

* Good, because we encapsulate all the information about a modpack in a single schema type
* Bad, because the external API we are calling requires two requests per execution of the resolver, and won't allow us to batch requests using a [dataloader](https://strawberry.rocks/docs/guides/dataloaders) pattern

### Retrieve the URL of the server modpack file just-in-time to use it while performing the mutation to add a server

Instead of exposing the field to the user, we could just use the resolver function to retrieve the URL only at the point that we need it, which is to supply it as an environment variable to a container we are creating.

* Good, because we avoid the possibility of slow and expensive queries which hit the external API multiple times
* Bad, because the API is less flexible, and can only be used for a constrained set of use cases that don't involve returning this information in bulk.
