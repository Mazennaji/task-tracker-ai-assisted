# Codex Instructions

## Stack and commands

- Backend: FastAPI/Python in `backend/`; frontend: Next.js/React/TypeScript in `frontend/`.
- Install backend dependencies: `cd backend; python -m venv venv; venv\\Scripts\\Activate.ps1; pip install -r requirements.txt`.
- Run the API: `cd backend; uvicorn main:app --reload` (http://localhost:8000; docs at `/docs`).
- Run backend tests: `cd backend; pytest -v`.
- Install and run the frontend: `cd frontend; npm install; npm run dev` (http://localhost:3000).
- Frontend checks: `cd frontend; npm run lint` and, when relevant, `npm run build`.

## Project rules

- Keep task status values exactly `todo`, `in_progress`, or `done`; a task cannot move from `done` back to `todo`.
- Due dates are optional ISO dates. A task is overdue only when its due date is before today and its status is not `done`; compute this at read time.
- Tags are free-form, trimmed, non-empty strings; permit at most 10 tags per task and 30 characters per tag. Preserve tags on unrelated updates.
- Put API models and validation in `backend/models.py`, routes in `backend/routes.py`, and task behavior in `backend/crud.py`. Put frontend components in `frontend/src/components/` and shared frontend helpers/types in `frontend/src/lib/`.
- This is a learning project: do not add production authentication, persistence infrastructure, background jobs, bulk operations, saved views, or tag autocomplete unless explicitly requested.

## Module 5 boundaries

- Prefer read-only analysis. For required changes, edit or add documentation under `docs/`.
- Do not change `backend/` or `frontend/` for Module 5 work. Flag unexpected app changes and ask before making them.

## Review expectations

- Cite the files you inspected; do not invent project structure or behavior.
- Ask before broad edits, new dependencies, or changes outside the requested scope.
- Explain the proposed diff and run the smallest relevant verification available.
