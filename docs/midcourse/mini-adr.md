# Mini ADR — Due Dates + Overdue Filter & Tags / Labels

## Status
Accepted — implemented in branch `mid-course-project`.

## Context
The existing Task Tracker (Modules 1–3) supports creating, updating, and moving tasks across a Kanban board via a FastAPI backend and a Next.js frontend. This milestone adds two scoped features: due dates with overdue detection, and tags/labels. Both were chosen because they are small enough to implement end-to-end (backend validation, tests, and visible frontend UI) within the milestone window, while still exercising the full AI-assisted workflow (plan, implement, test, debug).

---

## Decision 1: Due Dates + Overdue Filter

### Chosen approach
- Add an optional `due_date` field (ISO 8601 date string) to the task model.
- Compute "overdue" status **at read time** (backend), rather than storing a persisted `is_overdue` flag.
- Exclude tasks with status `Done` from overdue calculation.
- Add an optional `overdue=true` query parameter on `GET /tasks` for server-side filtering, in addition to a frontend toggle.

### Alternatives considered (AI-suggested)
- **Store a computed/cached `is_overdue` boolean on the task record**, updated by a scheduled job. Rejected — introduces a background job/scheduler dependency and a stale-data risk (the flag could be wrong if the job hasn't run) for a feature that's cheap to compute on every read.
- **Compute overdue status only in the frontend**, treating the backend as unaware of "overdue" entirely. Rejected — this would prevent server-side filtering (`GET /tasks?overdue=true`), which the assignment explicitly lists as a "good test" to include, and would duplicate date logic in two places if filtering were ever needed elsewhere.

### Consequences
- Overdue logic lives in one place (backend), reducing duplication.
- Slight computation cost on every list request — acceptable at this scale.

---

## Decision 2: Tags / Labels

### Chosen approach
- Store tags as a **list of trimmed, non-empty strings** on the task record (not a separate relational table).
- Validate: no empty/whitespace-only tags, optional max tag count and max tag length.
- Filtering by tag is a query parameter on `GET /tasks` (`tag=<value>`), checking list membership.

### Alternatives considered (AI-suggested)
- **Normalized relational model** with a separate `Tag` table and a many-to-many join table. Rejected as too complex for this milestone — it adds migration/schema overhead and query joins for a feature that, at this scale, doesn't need tag reuse across tasks to be enforced at the database level.
- **Fixed/predefined tag vocabulary** (closed enum of allowed tags). Rejected — over-constrains the user and wasn't part of the original scope; free-form tags with basic validation meet the acceptance criteria without the extra design surface.
- **Comma-separated single string field** (e.g. `"bug,frontend,urgent"`) instead of a list type. Considered as a simpler alternative; ultimately rejected in favor of a native list where the backend/data layer supports it, since it avoids re-parsing/re-joining strings on every read and write and makes validation (trim, non-empty, max length) more direct per tag.

### Consequences
- Tags are simple to implement and test within scope.
- No tag reuse tracking or autocomplete-from-existing-tags across the whole board (explicitly out of scope — see Roadmap in README).

---

## Out of Scope (explicitly rejected for this milestone)
- Bulk operations (multi-select tagging or due-date updates).
- Saved filter presets/views.
- Tag autocomplete / suggested tags from existing board data.
- Persisted overdue flag with background recomputation.

These were flagged by AI as "nice to have" extensions but were deliberately excluded to keep both features small, end-to-end, and fully verifiable within the milestone window.