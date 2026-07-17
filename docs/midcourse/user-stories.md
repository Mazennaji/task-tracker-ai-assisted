# User Stories

This document defines the user stories and acceptance criteria for the two features added in this milestone: **Due Dates + Overdue Filter** and **Tags / Labels**. Each story was drafted with AI assistance, then reviewed and corrected against the actual scope of the Task Tracker.

---

## Feature 1: Due Dates + Overdue Filter

### Story 1.1 — Set a due date on a task
As a user, I want to set an optional due date when creating or editing a task, so that I know when it needs to be completed.

**Acceptance Criteria:**
- The task modal includes an optional due date field.
- Tasks can be created and updated with or without a due date.
- Invalid date formats are rejected with a clear validation error.

### Story 1.2 — See overdue tasks at a glance
As a user, I want overdue tasks to be visually flagged on the board, so that I can prioritize them without opening each card.

**Acceptance Criteria:**
- A task is overdue if its due date is in the past.
- Overdue tasks display a visible indicator (e.g. a pill or badge) on their card.
- The indicator updates correctly as the current date changes (no stale flags).

### Story 1.3 — Filter the board to overdue tasks only
As a user, I want to filter the board to show only overdue tasks, so that I can focus on what's late.

**Acceptance Criteria:**
- A filter control (toggle or dropdown) exists to show overdue tasks only.
- Clearing the filter restores the full board.
- The filter combines correctly with existing status columns.

### Story 1.4 — Update or clear a due date
As a user, I want to change or remove a task's due date after creation, so that I can adjust plans as they change.

**Acceptance Criteria:**
- Editing a task allows changing the due date.
- Clearing the due date field removes it (task becomes "no due date," not overdue).
- Updating the due date does not affect unrelated task fields (title, status, tags).

**AI assumption corrected:** The initial AI draft assumed a task marked "Done" with a past due date should still show as "overdue." This was corrected — overdue status only applies to tasks that are not yet complete, since flagging completed work as late is misleading and not useful to the user.

---

## Feature 2: Tags / Labels

### Story 2.1 — Add tags to a task
As a user, I want to add one or more tags to a task, so that I can categorize and group related work.

**Acceptance Criteria:**
- The task modal includes a tag input (add multiple tags per task).
- Empty or whitespace-only tags are rejected.
- Tags are trimmed of leading/trailing whitespace before saving.

### Story 2.2 — See tags on task cards
As a user, I want tags to display as chips on the task card, so that I can identify a task's category without opening it.

**Acceptance Criteria:**
- Each tag renders as a distinct, readable chip on the card.
- Cards with no tags render cleanly with no empty/broken UI.
- Long tag lists degrade gracefully (wrap or truncate) rather than breaking the card layout.

### Story 2.3 — Filter tasks by tag
As a user, I want to filter the board by a specific tag, so that I can quickly see all tasks in that category.

**Acceptance Criteria:**
- A filter/search control lets the user select or type a tag.
- Only tasks containing the selected tag are shown.
- No matches returns an empty, clearly-labeled state (not an error).

### Story 2.4 — Preserve tags on unrelated updates
As a user, I want a task's tags to remain intact when I update other fields, so that I don't lose categorization by accident.

**Acceptance Criteria:**
- Updating title, status, or due date does not clear existing tags.
- Only an explicit tag edit changes the tag list.

**AI assumption corrected:** The AI's first draft suggested enforcing a fixed, predefined tag vocabulary (a closed set of allowed tags). This was corrected — tags are free-form, user-defined strings within simple validation rules (non-empty, trimmed, optional max length/count), since a fixed vocabulary was out of scope and added unnecessary complexity for this milestone.