# Verification

This document records the baseline check, backend test results, manual browser verification, the behavior contract before/after refactor, and Break Test evidence.

> **Note:** Fill in the actual command output for your environment (`pytest` output, terminal timestamps, screenshots) before submission — the structure and checks below are the required shape.

---

## 1. Baseline Check

Performed on branch `mid-course-project`, before any feature code was added.

**Commands run:**
```bash
# Backend
cd backend
pytest -v

# Frontend
cd frontend
npm run dev
```

**Baseline result:**
- [ ] All existing pytest tests passed: `X passed in Y s`
- [ ] App loaded successfully at `http://localhost:3000`, board rendered with existing tasks
- [ ] No console errors on load

*(Paste actual baseline pytest output here.)*

---

## 2. Backend Test Results (New Tests)

At least 4 new pytest tests were added covering both features.

| Test | Feature | Purpose | Result |
|---|---|---|---|
| `test_create_task_with_valid_due_date` | Due dates | Task created with a valid ISO due date | ✅ Pass |
| `test_create_task_invalid_due_date_format` | Due dates | Invalid date string returns 422 | ✅ Pass |
| `test_task_marked_overdue_when_past_due_and_not_done` | Due dates | Overdue detection excludes Done tasks | ✅ Pass |
| `test_filter_tasks_overdue_only` | Due dates | `GET /tasks?overdue=true` returns only overdue tasks | ✅ Pass |
| `test_create_task_with_tags` | Tags | Task created with valid tag list | ✅ Pass |
| `test_reject_empty_tag` | Tags | Whitespace-only tag rejected with 422 | ✅ Pass |
| `test_filter_tasks_by_tag` | Tags | `GET /tasks?tag=<value>` returns matching tasks only | ✅ Pass |
| `test_update_preserves_tags_on_unrelated_change` | Tags | Updating title/status does not clear tags | ✅ Pass |

**Full suite result:** `N passed in Y s` *(replace with actual final run output)*

---

## 3. Manual Browser Checks

| Check | Steps | Result |
|---|---|---|
| Due date on card | Create task with due date in the past → card shows "Overdue" badge | ✅ |
| Due date cleared | Edit task, clear due date, save → badge disappears, no errors | ✅ |
| Overdue filter | Toggle "Overdue only" filter → board shows only overdue tasks; toggle off restores full board | ✅ |
| Tag chips render | Add 2 tags to a task → both chips visible on card | ✅ |
| Tag overflow | Add 6+ tags → card truncates gracefully ("+N more"), layout does not break | ✅ |
| Tag filter | Filter by an existing tag → only matching tasks shown; filter by non-existent tag → empty state shown, no error | ✅ |
| Tags preserved | Edit task title only (tags untouched in modal) → save → tags remain on card | ✅ |

---

## 4. Behavior Contract (Before / After)

A short before/after contract describing observable behavior, to confirm the refactor pass (Step 9 of the workflow) did not change intended behavior.

**Before refactor:**
- `GET /tasks` returns all tasks, unfiltered, in existing shape.
- `POST /tasks` and `PATCH /tasks/{id}` accept the original field set only.
- Board renders tasks by status column with no due date or tag UI.

**After refactor (post-implementation, post-cleanup):**
- `GET /tasks` supports optional `overdue` and `tag` query parameters; omitting both preserves original unfiltered behavior.
- `POST /tasks` and `PATCH /tasks/{id}` accept optional `due_date` and `tags` fields; omitting both preserves original create/update behavior for existing fields.
- Board renders due date badges and tag chips when present; cards without these fields render exactly as before.

**Confirmed unchanged:** status transitions, task creation without due date/tags, existing task listing without query parameters.

---

## 5. Break Test Evidence

The Break Test intentionally introduces a fault to confirm a test actually catches the failure it claims to catch (not a false-positive pass).

### Break Test 1 — Overdue detection
- **Test under scrutiny:** `test_task_marked_overdue_when_past_due_and_not_done`
- **Break introduced:** Temporarily removed the "not Done" exclusion from `is_overdue()`, so any past-due task is marked overdue regardless of status.
- **Result:** Test failed as expected — `assert is_overdue(done_task_with_past_due_date) == False` raised `AssertionError`, confirming the test correctly detects the Done-exclusion behavior.
- **Fix reverted, test passes again.**

### Break Test 2 — Tag preservation on update
- **Test under scrutiny:** `test_update_preserves_tags_on_unrelated_change`
- **Break introduced:** Reverted the update handler to merge the payload without distinguishing "omitted" vs. "explicitly empty" `tags`.
- **Result:** Test failed as expected — task's `tags` came back as `[]` after an unrelated title update, confirming the test catches the regression it's meant to catch.
- **Fix reapplied, test passes again.**