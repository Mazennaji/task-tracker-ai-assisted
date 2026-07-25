# Release Evidence

## Baseline

- Branch: `final-project`
- Date: 2026-07-25
- Local app run command: `cd backend && uvicorn main:app --host 0.0.0.0 --port 8000`
- `/health` result: `GET http://localhost:8000/health` → `200 {"status": "ok"}` — verified with `curl -s -w "\nHTTP_STATUS:%{http_code}\n" http://localhost:8000/health`
- Frontend check: opened with `cd frontend && npm run dev`, visited `http://localhost:3000`. Kanban board (To Do / In Progress / Done columns), the manifest header task-count readout, and the create/edit task modal are all present and functional as of this baseline.
- Test command: `cd backend && python -m pytest -v`
- Test result: **11 passed**, 0 failed. 16 deprecation warnings from `datetime.utcnow()` (Python 3.12 flags this as deprecated in favor of `datetime.now(timezone.utc)`) — warnings only, not failures, and pre-existing (not introduced by final-project work).

## CI evidence

- Workflow file: `.github/workflows/ci.yml`
- Latest run link or note: CI is configured correctly and triggers on push to `final-project`. As of this writing, GitHub Actions runs are failing to start with "account is locked due to a billing issue" — a GitHub account-level billing block, not a workflow or code defect. The same commands the workflow runs (`pytest -v` for backend; `npm run lint` and `npm run build` for frontend) were run locally and passed (see Baseline above and Documentation claim-vs-reality log below).
- Test command used by CI: `pytest -v` (backend-tests job), `npm run lint` + `npm run build` (frontend-checks job)
- Shortcut check: confirmed **no** `continue-on-error`, **no** `|| true`, pytest is **not** skipped or conditionally gated, and the Python version is pinned explicitly (`3.12`, via `actions/setup-python@v5` with `python-version: "3.12"`) rather than left unspecified.

## Docker evidence

- Build command: `docker build -t task-tracker .` (run from repo root; builds `backend/` as the app per `docs/repo-structure-mapping.md`)
- Run command: `docker run -p 8000:8000 task-tracker`
- `/health` check: *(run locally and record the result here — this sandbox does not have Docker available to execute the build)* — expected: `curl http://localhost:8000/health` → `200 {"status": "ok"}`, matching the non-containerized baseline above.
- Non-root check: implemented. The root `Dockerfile` creates and switches to a non-root user (`RUN useradd --create-home appuser` / `USER appuser`) before the container's `CMD` runs.
- No-baked-secrets check: confirmed by inspection. Root `.dockerignore` excludes `backend/.env`, `backend/.env.local`, `frontend/.env`, and `frontend/.env.local`, plus `.git/` and `docs/`. No `.env` file exists in this repo at all (only `frontend/.env.local.example`, a template with no real values), so there is nothing to accidentally bake into the image.

## Documentation claim-vs-reality log

| Claim checked | Evidence used | Result | Change made, if any |
|---|---|---|---|
| README claims `GET /health` returns 200 | Ran `curl -s -w "HTTP_STATUS:%{http_code}" http://localhost:8000/health` against the locally running app | Confirmed — returned `200 {"status": "ok"}` | None needed |
| README/AGENTS.md claim the backend test command is `pytest -v` and all tests pass | Ran `cd backend && python -m pytest -v` | Confirmed — 11 passed, 0 failed | None needed |
| AGENTS.md claims tags submitted as empty/whitespace strings are rejected with a validation error | Sent `POST /tasks` with `{"title": "Bad tag test", "tags": ["   "]}` via Thunder Client | Confirmed — returned `422` with `"msg": "Value error, tags cannot be empty or whitespace"` | None needed |