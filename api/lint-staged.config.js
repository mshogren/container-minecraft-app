export default {
  "**/*.py": [
    ".venv/bin/autopep8 --experimental --in-place",
    ".venv/bin/pylint --rcfile=.pylintrc",
    () => "./lint-schema.sh",
  ]
}
