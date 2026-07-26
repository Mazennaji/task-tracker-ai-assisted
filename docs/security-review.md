# Module 5 Security Review

## Scope

This was a read-only review of the Task Tracker backend, frontend, Docker files, CI workflow, dependency manifests, and project instructions. No application code, containers, tests, or dependency scans were run.

## Valid findings

### SEC-01 — No authentication or ownership authorization

The task API exposes read and mutation routes without authentication or ownership checks. This is an intentional learning-project limitation, but it must be addressed before any shared or production deployment.

Evidence: `backend/routes.py` defines task CRUD routes without an authentication dependency; `AGENTS.md` identifies production authentication as out of scope for this learning project.

Recommended action: keep the API local/course-scoped. Before shared deployment, add authentication and per-task authorization.

### SEC-04 — Frontend Docker build does not use the lockfile

The frontend Dockerfile copies only `package.json` before running `npm install`, even though `frontend/package-lock.json` exists. The resulting container build is not lockfile-pinned.

Evidence: `frontend/Dockerfile` lines 3-4 and `frontend/package-lock.json`.

Recommended action: copy `package-lock.json` into the Docker dependency stage and use `npm ci`.

### SEC-06 — Containers do not declare a non-root runtime user

Neither Dockerfile declares a `USER` instruction. This is a low-severity hardening gap for any deployment outside the course environment.

Evidence: `backend/Dockerfile` and `frontend/Dockerfile` contain no `USER` instruction.

Recommended action: create and use an unprivileged runtime user in both images before deployment.

## Findings treated as non-actionable for Module 5

- The API has unbounded list-query inputs and no pagination, but no public deployment or scale requirement is in scope.
- CORS is restricted to `http://localhost:3000`; credentials and wildcard methods/headers should be revisited only if the deployment model changes.
- The frontend Docker build context can include `.env` files; no secret exposure was demonstrated, but a `.dockerignore` remains useful future hardening.

## Module 5 decision

No application or container changes are made for this review. The findings above are documented as course-scope limitations or future deployment backlog items.
