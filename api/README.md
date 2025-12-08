This project uses [uv](https://docs.astral.sh/uv/) to manage Python versions and package dependencies

To install dependencies
```
uv sync
```

To run the api for development
```
uvicorn main:app --reload --log-config logging.yaml
```