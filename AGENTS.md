# Codex instructions

This is a Python 3.11+ repository.

## Setup

Run:

```bash
bash scripts/codex-setup.sh
```

## Validation

Before completing a task, run:

```bash
python -m compileall -q src tests
python -m pytest -q
```

Keep credentials out of the repository. Use Codex environment variables or secrets
for cloud tasks, and use `.env` only for local development.
