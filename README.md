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

The engineering process itself — prompting, reviewing AI output, testing, and debugging — is documented in [`docs/midcourse/`](./docs/midcourse) for full transparency.

---

## Tech Stack

| Layer      | Technology                     |
|------------|---------------------------------|
| Frontend   | Next.js (React)                |
| Backend    | FastAPI (Python)                |
| Testing    | Pytest                          |
| Data       | *(fill in: e.g. SQLite / in-memory / JSON store)* |

---

## Project Structure

```
task-tracker-ai-assisted/
├── backend/            # FastAPI application, models, routes, tests
├── frontend/            # Next.js application (board, modal, filters)
├── docs/
│   └── midcourse/
│       ├── user-stories.md
│       ├── mini-adr.md
│       ├── prompt-log.md
│       ├── verification.md
│       └── reflection.md
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
- **Node.js 20+** (required by this version of Next.js — older Node versions will fail to run the frontend)
- `npm` or `yarn`

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-tracker-ai-assisted
```

### 2. Run the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
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

---

## AI-Assisted Development Process

This project was built using a structured AI-assisted workflow: plan → constrain → implement in small steps → inspect AI output → verify in the running app → test → debug from evidence. Full documentation of that process — including prompts used, decisions made, and what was accepted, edited, or rejected — lives in [`docs/midcourse/`](./docs/midcourse):

| Document | Purpose |
|---|---|
| `user-stories.md` | User stories and acceptance criteria per feature |
| `mini-adr.md` | Design decisions and rejected alternatives |
| `prompt-log.md` | Key prompts, AI responses, and what was kept/changed |
| `verification.md` | Baseline results, test results, and manual verification steps |
| `reflection.md` | Reflection on the AI-assisted workflow |

---

## Roadmap / Not Included

The following were considered but intentionally scoped out to keep this milestone focused:

- Bulk operations (multi-select, batch actions)
- Saved filter presets / views
- Visual polish (themes, animations)

---

## License

Private project — for course submission purposes only.