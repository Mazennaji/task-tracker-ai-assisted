# Verification

This document records the baseline check, backend test results, manual browser verification, the behavior contract before/after refactor, and Break Test evidence.

---

## 1. Baseline Check

Performed on branch `mid-course-project`.

**Commands run:**
```powershell
cd backend
venv\Scripts\activate
pytest -v
```

**Baseline result:**
```
============================================================ test session starts =============================================================
platform win32 -- Python 3.13.1, pytest-9.1.1, pluggy-1.6.0 -- C:\Users\lenovo\task-tracker-ai-assisted\backend\venv\Scripts\python.exe
cachedir: .pytest_cache
rootdir: C:\Users\lenovo\task-tracker-ai-assisted\backend
plugins: anyio-4.14.2
collected 11 items

test_tasks.py::test_create_task_with_valid_due_date PASSED                                                                              [  9%]
test_tasks.py::test_create_task_invalid_due_date_format PASSED                                                                          [ 18%]
test_tasks.py::test_task_marked_overdue_when_past_due_and_not_done PASSED                                                               [ 27%]
test_tasks.py::test_filter_tasks_overdue_only PASSED                                                                                    [ 36%]
test_tasks.py::test_create_task_with_tags PASSED                                                                                        [ 45%]
test_tasks.py::test_reject_empty_tag PASSED                                                                                             [ 54%]
test_tasks.py::test_filter_tasks_by_tag PASSED                                                                                          [ 63%]
test_tasks.py::test_filter_tasks_by_tag_no_match_returns_empty_list PASSED                                                              [ 72%]
test_tasks.py::test_update_preserves_tags_on_unrelated_change PASSED                                                                    [ 81%]
test_tasks.py::test_delete_missing_task_returns_404 PASSED                                                                              [ 90%]
test_tasks.py::test_update_missing_task_returns_404 PASSED                                                                              [100%]

====================================================== 11 passed, 16 warnings in 0.83s =======================================================
```

- [x] All existing pytest tests passed: `11 passed in 0.83s`
- [x] App loaded successfully at `http://localhost:3000`, board rendered with existing tasks
- [x] No console errors on load

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
| `test_filter_tasks_by_tag_no_match_returns_empty_list` | Tags | Non-existent tag filter returns empty list, not an error | ✅ Pass |
| `test_update_preserves_tags_on_unrelated_change` | Tags | Updating title/status does not clear tags | ✅ Pass |
| `test_delete_missing_task_returns_404` | Core | Deleting a non-existent task returns 404 | ✅ Pass |
| `test_update_missing_task_returns_404` | Core | Updating a non-existent task returns 404 | ✅ Pass |

**Full suite result:** `11 passed in 0.83s`

*Pending addition: `test_cannot_move_done_to_todo`, covering the restored status-transition rule (Done cannot move back to To Do). Will be added and this table updated before final resubmission.*

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
| Done → To Do blocked | Drag a Done task back to To Do → backend rejects with 400, board shows a dismissible error banner instead of crashing | ✅ |

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
- `PATCH /tasks/{id}` rejects a Done → To Do status change with `400` and a descriptive message; all other status transitions behave as before.

**Confirmed unchanged:** task creation without due date/tags, existing task listing without query parameters, all status transitions other than Done → To Do.

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