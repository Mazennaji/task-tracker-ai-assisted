# Prompt Log

This log records the meaningful prompts used to implement both features, what the AI returned, and what was accepted, edited, or rejected. Exploratory/one-off prompts are omitted; only prompts that materially shaped the implementation are included.

---

## Feature 1: Due Dates + Overdue Filter

### Prompt 1.1 — Weak → Strong rewrite

**Weak prompt:**
> "Add due dates to tasks."

**Why it was weak:** No constraints on data type, validation behavior, where overdue is computed, or how it interacts with existing fields/status. Too open-ended — likely to produce a generic or over-scoped implementation.

**Rewritten (strong) prompt:**
> "In the FastAPI task model, add an optional `due_date` field (ISO 8601 date string). Update the create and update endpoints to validate the format and return a 422 with a clear message on invalid input. Do not change any other existing fields or endpoint behavior. Show me only the diff for the model and the two endpoint handlers."

**AI response summary:** Returned a Pydantic field addition (`due_date: Optional[date] = None`), validation via Pydantic's native date parsing, and updated create/update handlers with no unrelated changes.

**Decision:** Accepted the field definition and validation approach as-is. Edited the error response to match the project's existing error-message format (the AI's default FastAPI validation error shape didn't match the rest of the API's error conventions).

---

### Prompt 1.2 — Overdue computation logic

**Prompt:**
> "Given a task with `due_date` and `status`, write a function `is_overdue(task)` that returns True only if the due date is before today AND the task is not in the 'Done' status. Include a docstring and a short inline comment explaining the Done exclusion."

**AI response summary:** Provided a function comparing `due_date < date.today()` combined with a status check, with a docstring and comment as requested.

**Decision:** Accepted with a minor edit — changed the hardcoded status string comparison to use the existing status enum/constant already defined elsewhere in the codebase, to avoid a duplicate source of truth for status values.

---

### Prompt 1.3 — Overdue filter endpoint

**Prompt:**
> "Add an optional `overdue` boolean query parameter to `GET /tasks`. When `overdue=true`, return only tasks where `is_overdue()` is True. When the parameter is omitted, behavior must be unchanged. Do not modify the response schema."

**AI response summary:** Added the query parameter and a conditional filter step in the list handler, reusing the `is_overdue()` helper from Prompt 1.2.

**Decision:** Accepted as-is. Verified manually that omitting the parameter returned the full unfiltered list, confirming no regression.

---

### Prompt 1.4 — Frontend overdue indicator

**Prompt:**
> "In the Next.js task card component, add a small badge that reads 'Overdue' when the task's due date has passed and the task is not Done. Use existing card styling conventions — don't introduce a new color system."

**AI response summary:** Added a conditional badge using an existing utility class from the card component, based on a client-side date comparison.

**Decision:** Edited — the AI's version recomputed overdue logic in the frontend using slightly different date-comparison logic than the backend (it didn't exclude the "Done" status). Corrected to match backend behavior so overdue definition stays consistent across layers.

---

## Feature 2: Tags / Labels

### Prompt 2.1 — Weak → Strong rewrite

**Weak prompt:**
> "Add tags to tasks."

**Why it was weak:** Doesn't specify data shape (list vs. string), validation rules, or how tags interact with existing update behavior (risk of accidentally clearing tags on unrelated edits).

**Rewritten (strong) prompt:**
> "Add a `tags` field to the task model as a list of strings. On create and update, trim whitespace from each tag, reject empty/whitespace-only tags with a 422, and enforce a max of 10 tags and 30 characters per tag. If `tags` is omitted on an update request, do not clear existing tags — only overwrite when explicitly provided."

**AI response summary:** Added the `tags: List[str]` field, per-tag trimming and validation, and count/length limits. Initial version treated `tags` as always overwritten (including when omitted), which conflicted with the "preserve tags on unrelated update" requirement.

**Decision:** Edited — added an explicit check to distinguish "field omitted" from "field provided as empty list," so a partial update without `tags` doesn't wipe existing tags, while an explicit empty list still clears them intentionally.

---

### Prompt 2.2 — Tag filter endpoint

**Prompt:**
> "Add an optional `tag` query parameter to `GET /tasks` that returns only tasks whose tags list contains that value (case-insensitive match). No matches should return 200 with an empty array, not an error."

**AI response summary:** Implemented a case-insensitive containment check across each task's tag list, returning an empty list when nothing matches.

**Decision:** Accepted as-is after manually verifying both a matching tag and a non-existent tag returned correct results (list vs. empty list, both 200).

---

### Prompt 2.3 — Frontend tag chips and input

**Prompt:**
> "In the task modal, add a tag input that lets the user add multiple tags (press Enter or comma to add one), remove a tag by clicking an 'x' on its chip, and render existing tags as chips on the task card. Keep it visually consistent with the rest of the modal — no new component library."

**AI response summary:** Provided a tag-input component with add/remove behavior and card-level chip rendering, using existing modal input styling.

**Decision:** Accepted the interaction pattern. Edited the chip component to cap displayed tags on the card (e.g. show first 3 + "+N more") after noticing in manual testing that many tags on a narrow card broke the layout — this was a gap the AI's version didn't account for.

---

### Prompt 2.4 — Debugging a failing test

**Prompt:**
> "This pytest test is failing: [pasted `test_update_preserves_tags_on_unrelated_change`]. Here's the current update endpoint code: [pasted]. Explain why the tags are being cleared and suggest a minimal fix — don't rewrite the whole handler."

**AI response summary:** Identified that the update handler was using `.dict(exclude_unset=False)` (or equivalent) when merging the update payload, which included `tags` as its default empty value even when the client didn't send it — overwriting existing tags.

**Decision:** Accepted the diagnosis and the suggested minimal fix (switching to `exclude_unset=True` in the merge step). Re-ran the test suite to confirm the fix resolved the failure without affecting other update behavior.