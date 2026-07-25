# Codex Instructions

## Project summary

Task Tracker is a learning-project Kanban board with a FastAPI API and a Next.js frontend. It supports task creation, updates, deletion, status grouping, optional due dates with overdue filtering, and free-form tags. The current storage is an in-memory dictionary; no durable persistence is implemented.

## Stack and commands

- Backend: Python, FastAPI, Pydantic, and pytest in `backend/`.
- Frontend: Next.js, React, TypeScript, and ESLint in `frontend/`.
- Install backend dependencies: `cd backend; pip install -r requirements.txt`
- Run the API: `cd backend; uvicorn main:app --reload`
- Run backend tests: `cd backend; pytest -v`
- Install frontend dependencies: `cd frontend; npm install`
- Run the frontend: `cd frontend; npm run dev`
- Run frontend linting: `cd frontend; npm run lint`
- Build the frontend: `cd frontend; npm run build`

## Business rules

- Valid task statuses are exactly `todo`, `in_progress`, and `done`.
- A task cannot transition from `done` to `todo`.
- Title is required and must be 1–200 characters. Description is optional and limited to 2,000 characters.
- Due dates are optional ISO date values. A task is overdue only when its due date is before today and its status is not `done`; overdue status is computed when tasks are read.
- Tags are free-form strings. Each tag is trimmed, cannot be empty or whitespace-only, has a 30-character maximum, and a task can have at most 10 tags.
- Tag filtering is case-insensitive. Updating unrelated fields must preserve tags unless tags are explicitly supplied.
- Task priority: not confirmed; no priority field or rule is visible in the inspected code.

## Module 5 guardrails

- Work docs-first and read-only by default.
- Use one clearly scoped task per Codex thread.
- For Module 5, make required edits in `docs/` first.
- Do not change application code unless explicitly approved. This repository has no `app/` directory; treat `backend/` and `frontend/` as application code.
- Flag unexpected application changes, broadened scope, new dependencies, or data-model changes before proceeding.

## Security and governance

- Never paste, log, commit, or expose secrets, tokens, credentials, or `.env` contents.
- Do not run destructive commands or discard user changes without explicit approval.
- Cite the files inspected for conclusions and distinguish facts from assumptions.
- Do not invent commands, architecture, requirements, test results, or business rules. Mark unverified items as **not confirmed**.