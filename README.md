# Task Tracker — AI-Assisted

> A Kanban-style task tracker built with **FastAPI** (backend) and **Next.js** (frontend), extended with due dates, overdue filtering, and tag-based organization — developed through a documented, AI-assisted engineering workflow.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/frontend-Next.js-black)
![License](https://img.shields.io/badge/license-private-lightgrey)

---

## Overview

Task Tracker is a lightweight project management board that lets you create, organize, and track tasks across statuses (e.g. **To Do → In Progress → Done**). This version extends the core Modules 1–3 build with two additional features:

- **Due Dates & Overdue Filter** — assign due dates to tasks, see overdue tasks flagged on their cards, and filter the board to show only what's late.
- **Tags / Labels** — attach lightweight labels to tasks for categorization, with filtering and chip-style display on cards.

The engineering process itself — prompting, reviewing AI output, testing, and debugging — is documented in [`docs/midcourse/`](./docs/midcourse) (mid-course milestone) and [`docs/`](./docs) (final project milestone) for full transparency.

---

## Tech Stack

| Layer      | Technology                     |
|------------|---------------------------------|
| Frontend   | Next.js (React)                |
| Backend    | FastAPI (Python)                |
| Testing    | Pytest                          |
| Data       | In-memory dictionary (no durable persistence — see `AGENTS.md`) |

---

## Project Structure

```
task-tracker-ai-assisted/
├── backend/            # FastAPI application, models, routes, tests
├── frontend/            # Next.js application (board, modal, filters)
├── docs/
│   ├── midcourse/
│   │   ├── user-stories.md
│   │   ├── mini-adr.md
│   │   ├── prompt-log.md
│   │   ├── verification.md
│   │   └── reflection.md
│   ├── release-evidence.md
│   ├── final-ai-review.md
│   ├── ai-playbook.md
│   └── repo-structure-mapping.md
├── .github/workflows/ci.yml
├── Dockerfile
├── .dockerignore
├── AGENTS.md
└── README.md
```

---

## Features

### ✅ Core (Modules 1–3)
- Create, update, delete tasks
- Kanban-style status board
- Task modal for editing details

### 🆕 Due Dates + Overdue Filter
- Optional `due_date` field on tasks, validated on create/update
- Overdue detection (computed relative to current date)
- Overdue indicator shown on task cards
- Filter to show only overdue tasks

### 🆕 Tags / Labels
- Add one or more tags per task
- Trimmed, non-empty tag validation
- Tag chips rendered on cards
- Filter/search tasks by tag

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- `npm` or `yarn`
- Docker Desktop (optional, for containerized run)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-tracker-ai-assisted
```

### 2. Run the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000` (interactive docs at `/docs`).

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

### 4. Run tests

```bash
cd backend
pytest -v
```

### 5. Run with Docker

```bash
docker build -t task-tracker .
docker run -p 8000:8000 task-tracker
curl http://localhost:8000/health
```

---

## AI-Assisted Development Process

This project was built using a structured AI-assisted workflow: plan → constrain → implement in small steps → inspect AI output → verify in the running app → test → debug from evidence. Full documentation of that process from the mid-course milestone — including prompts used, decisions made, and what was accepted, edited, or rejected — lives in [`docs/midcourse/`](./docs/midcourse):

| Document | Purpose |
|---|---|
| `user-stories.md` | User stories and acceptance criteria per feature |
| `mini-adr.md` | Design decisions and rejected alternatives |
| `prompt-log.md` | Key prompts, AI responses, and what was kept/changed |
| `verification.md` | Baseline results, test results, and manual verification steps |
| `reflection.md` | Reflection on the AI-assisted workflow |

---

## Final Project

Branch reviewed: `final-project`

**Note on structure:** this project's backend folder is named `backend/`, not `app/`, and its tests live at `backend/test_tasks.py` rather than a top-level `tests/` folder. This is a deliberate, documented decision — see [`docs/repo-structure-mapping.md`](./docs/repo-structure-mapping.md) for the full mapping and reasoning.

### What this submission demonstrates
- Existing Task Tracker app still runs inside the intended course scope (no new product features added).
- CI runs the pytest suite on push and pull request via `.github/workflows/ci.yml`.
- A root-level Docker image builds and runs the backend, with `/health` returning `200` — verified by both the container's own access log and an external `curl` check (see `docs/release-evidence.md`).
- AI review, security, and ownership evidence is in `docs/`.

### How to run locally
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

### How to run tests
```bash
cd backend
pytest -v
```

### How to run with Docker
```bash
# From the repo root
docker build -t task-tracker .
docker run -p 8000:8000 task-tracker
curl http://localhost:8000/health
```

### Evidence files
- [`docs/release-evidence.md`](./docs/release-evidence.md)
- [`docs/final-ai-review.md`](./docs/final-ai-review.md)
- [`docs/ai-playbook.md`](./docs/ai-playbook.md)
- [`docs/repo-structure-mapping.md`](./docs/repo-structure-mapping.md)

### AI assistance summary
AI helped draft or review: CI workflow, Dockerfile, documentation, security review, debugging (an ESLint failure, a Docker Desktop engine issue, a datetime deprecation warning).
I verified the work by: running the pytest suite directly, building and running the actual Docker image and confirming `/health` returned 200 (both via the container's access log and an external `curl`), running `npm run lint` / `npm run build` locally, and sending real requests through Thunder Client.
One AI suggestion I rejected or corrected: a suggestion to rename `backend/` to `app/` to match the rubric's literal folder naming — rejected as an unnecessarily broad, cross-cutting change; documented the equivalence instead in `docs/repo-structure-mapping.md`.

---

## Roadmap / Not Included

The following were considered but intentionally scoped out to keep this milestone focused:

- Bulk operations (multi-select, batch actions)
- Saved filter presets / views
- Visual polish (themes, animations)

---

## License

Private project — for course submission purposes only.