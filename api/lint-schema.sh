#! /bin/sh

.venv/bin/strawberry export-schema src.schema | npx graphql-schema-linter -s -e relay-page-info-spec