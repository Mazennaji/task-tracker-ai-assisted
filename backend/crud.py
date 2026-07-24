import uuid
from datetime import date, datetime
from typing import Dict, List, Optional

from models import Task, TaskCreate, TaskUpdate

_tasks: Dict[str, Task] = {}

INVALID_TRANSITIONS = {
    ("done", "todo"),
}


class InvalidTransitionError(ValueError):
    pass


def _compute_overdue(task: Task) -> bool:
    if not task.due_date or task.status == "done":
        return False
    return task.due_date < date.today()


def create_task(payload: TaskCreate) -> Task:
    now = datetime.utcnow()
    task = Task(
        id=str(uuid.uuid4()),
        created_at=now,
        updated_at=now,
        overdue=False,
        **payload.model_dump(),
    )
    task.overdue = _compute_overdue(task)
    _tasks[task.id] = task
    return task


def list_tasks(
    status: Optional[str] = None,
    tag: Optional[str] = None,
    overdue: Optional[bool] = None,
) -> List[Task]:
    results = list(_tasks.values())
    for task in results:
        task.overdue = _compute_overdue(task)

    if status:
        results = [t for t in results if t.status == status]
    if tag:
        lowered = tag.lower()
        results = [t for t in results if lowered in [x.lower() for x in t.tags]]
    if overdue is not None:
        results = [t for t in results if t.overdue == overdue]

    return sorted(results, key=lambda t: t.created_at)


def get_task(task_id: str) -> Optional[Task]:
    task = _tasks.get(task_id)
    if task:
        task.overdue = _compute_overdue(task)
    return task


def update_task(task_id: str, payload: TaskUpdate) -> Optional[Task]:
    task = _tasks.get(task_id)
    if not task:
        return None

    data = payload.model_dump(exclude_unset=True)
    clear_due_date = data.pop("clear_due_date", False)

    new_status = data.get("status")
    if new_status is not None and (task.status, new_status) in INVALID_TRANSITIONS:
        raise InvalidTransitionError(
            f"cannot move a task from '{task.status}' back to '{new_status}'"
        )

    for key, value in data.items():
        setattr(task, key, value)

    if clear_due_date:
        task.due_date = None

    task.updated_at = datetime.utcnow()
    task.overdue = _compute_overdue(task)
    _tasks[task_id] = task
    return task


def delete_task(task_id: str) -> bool:
    return _tasks.pop(task_id, None) is not None


def reset() -> None:
    _tasks.clear()


def _seed() -> None:
    samples = [
        TaskCreate(
            title="Design the dashboard layout",
            description="Explore column widths and card density.",
            status="todo",
            tags=["design", "ui"],
        ),
        TaskCreate(
            title="Set up CI pipeline",
            status="in_progress",
            tags=["infra"],
            due_date=date(2026, 7, 20),
        ),
        TaskCreate(
            title="Write onboarding docs",
            status="done",
            tags=["docs"],
        ),
        TaskCreate(
            title="Fix overdue badge alignment",
            status="todo",
            tags=["bug", "frontend"],
            due_date=date(2026, 7, 10),
        ),
    ]
    for sample in samples:
        create_task(sample)


_seed()