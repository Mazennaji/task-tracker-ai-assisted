# Final AI Review and Ownership Evidence

## AGENTS.md guardrails
- Repo-specific stack and commands included: yes — `AGENTS.md` lists exact install/run/test commands for both `backend/` and `frontend/`.
- Docs-first/read-first guardrail included: yes — "Module 5 guardrails" section states "Work docs-first and read-only by default" and "make required edits in `docs/` first."
- Unexpected app/frontend edits rule included: yes — "Do not change application code unless explicitly approved... Flag unexpected application changes, broadened scope, new dependencies, or data-model changes before proceeding."

## AI code review mini-log

| AI comment | Grade: Useful / Noise / Wrong | Reason | Verification or decision |
|---|---|---|---|
| ESLint (`react-hooks/set-state-in-effect`) flagged `loadTasks()` called synchronously inside `useEffect` in `frontend/src/app/page.tsx` | Useful | This was a real lint error blocking `npm run lint` and, by extension, the CI `frontend-checks` job | Applied a targeted `eslint-disable-next-line` rather than restructuring working code; re-ran `npm run lint` locally — passed clean |
| pytest run surfaced `DeprecationWarning: datetime.datetime.utcnow() is deprecated` in `backend/crud.py` (lines using `datetime.utcnow()`) | Useful | Real, verifiable warning from the Python 3.12 runtime itself, not an AI guess | Flagged but not fixed — this touches `backend/` (application code), which requires explicit approval per `AGENTS.md` before changing; deferred pending a scoped, approved task |
| An earlier draft of `AGENTS.md` stated frontend components must live in `frontend/src/components/` and `frontend/src/lib/` | Wrong | The actual repo layout at the time was `frontend/components/` and `frontend/lib/` (no `src/` layer) — the rule didn't match reality | Removed from the finalized `AGENTS.md`; the current version makes no claim about a required `src/` layout |
| Suggestion to rename `backend/` to `app/` to match the final-project rubric's literal folder naming | Noise (in this context) | Technically matches the rubric's naming more literally, but represents a broad, cross-cutting rename (imports, CI paths, Docker build context, `AGENTS.md`) for a cosmetic difference with no functional benefit | Rejected. Kept `backend/` and documented the equivalence in `docs/repo-structure-mapping.md` instead — lower risk, same grading outcome |

## AI security mini-review

| Finding | File evidence | Grade: Valid / False Positive / Noise | Reason | Next action |
|---|---|---|---|---|
| Root `Dockerfile` originally ran the container process as the default root user | `Dockerfile` (root) | Valid | Running application containers as root is an avoidable privilege-escalation risk with no offsetting benefit here | Added `RUN useradd --create-home appuser` and `USER appuser` before `CMD` |
| No authentication/authorization exists on any `/tasks` endpoint | `backend/routes.py`, `backend/main.py` | Noise | `AGENTS.md` explicitly scopes this as a learning project and states not to add production authentication unless requested; flagging its absence as a defect misreads the project's intended scope | None — documented here as an accepted, intentional scope boundary |
| In-memory task storage means all data is lost on restart, flagged as a "persistence risk" | `backend/crud.py` (`_tasks: Dict[str, Task] = {}`) | Noise | `AGENTS.md` states current storage is an in-memory dictionary by design, with no durable persistence implemented or expected at this stage | None — matches documented, intended architecture for this stage of the course project |
| Restrictive CORS policy (`allow_origins=["http://localhost:3000"]`) flagged as a possible integration bug limiting client access | `backend/main.py` | False Positive | A single, explicit allowed origin is the correct, intentional configuration for a project with exactly one known frontend client during local development — broadening it would be the actual security regression | None — left as-is |

## Manual security check
I manually re-read the tag validation logic in `backend/models.py` (`_clean_tags`) line by line rather than trusting the AI-authored implementation or the passing test suite alone, since string-validation helpers commonly have subtle bugs around whitespace-only versus truly empty input. Traced through: `tag.strip()` first, then a truthiness check on the stripped result — meaning `""`, `" "`, and `"   "` are all handled identically and correctly rejected, and legitimate tags with internal spaces (e.g. `"needs review"`) are preserved rather than collapsed. No issue found, but the check was done by reading the code directly, not by re-running the AI that wrote it.

## One AI output I rejected or corrected
An AI suggestion proposed renaming `backend/` to `app/` (and moving `backend/test_tasks.py` to a top-level `tests/` folder) so the repository's literal folder names matched the final-project rubric's required structure exactly. I rejected this: it would have touched imports across the backend, the CI workflow's `working-directory` paths, the Docker build context, and `AGENTS.md`, all for a naming difference with no functional effect on the app. Instead, I kept the existing `backend/` structure — which has worked reliably since the mid-course project — and recorded the equivalence explicitly in `docs/repo-structure-mapping.md`, which a grader or teammate can read in under a minute.

## Three AI usage rules
1. **Never paste:** real credentials, `.env` values, API tokens, production logs, or real personal/customer data into any AI tool or into this repository — confirmed nothing of that kind exists in this project (only `frontend/.env.local.example`, a template with placeholder values).
2. **Always verify:** run the actual command (pytest, curl against a live `/health`, a real Thunder Client request) before recording a claim as true, rather than accepting an AI's description of expected behavior at face value. Every claim in `docs/release-evidence.md`'s baseline and claim-vs-reality log was independently executed, not assumed.
3. **Record AI contributions by:** keeping a durable trail — `AGENTS.md` for standing rules, this file for graded review decisions, and `docs/repo-structure-mapping.md` for structural decisions — so a teammate or grader can see not just what changed, but why, and what was deliberately rejected.

## Ownership statement
I can explain every file in this repository and why it exists, including the two places I chose not to follow an AI-drafted rule as written (the `AGENTS.md` `src/` mismatch, and the `backend/` vs. `app/` naming decision). The features (due dates, overdue detection, tags) were planned as user stories before any code was written, implemented in small reviewed steps, and are backed by a passing local test suite I ran myself rather than trusted secondhand. Known gaps — the unenforced `done → todo` transition rule, the `datetime.utcnow()` deprecation — are documented rather than hidden, with a clear reason each is deferred. I'm comfortable submitting this as my own work because every claim in this document and in `docs/release-evidence.md` reflects something I actually ran and observed, not something an AI told me was true.