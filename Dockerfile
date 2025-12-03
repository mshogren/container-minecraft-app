FROM python:3.13-slim AS base

# Setup env
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONFAULTHANDLER=1


FROM base AS python-deps

# Install pipenv and compilation dependencies
RUN pip install pipenv

# Install python dependencies in /.venv
COPY api/Pipfile .
COPY api/Pipfile.lock .
RUN PIPENV_VENV_IN_PROJECT=1 pipenv install --deploy


FROM node:24 AS node-deps

WORKDIR /app
COPY app/package*.json ./
RUN npm ci
COPY app ./
RUN npm run build


FROM base AS runtime

# Copy virtual env from python-deps stage
COPY --from=python-deps /.venv /.venv
ENV PATH="/.venv/bin:$PATH"

# Install application into container
WORKDIR /project
COPY api/ ./
COPY --from=node-deps app/dist/ ../app/


# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80", "--log-config", "logging.yaml"]
