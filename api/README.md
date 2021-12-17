To install dependencies
```
pip install --user pipenv 
python3 -m venv .venv
source .venv/bin/activate
pipenv install --dev
```

To run the api for development
```
uvicorn main:app --reload --log-config logging.yaml
```