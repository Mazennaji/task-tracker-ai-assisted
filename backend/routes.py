from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

import crud
from crud import InvalidTransitionError
from models import Task, TaskCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=List[Task])
def list_tasks(
    status: Optional[str] = Query(default=None),
    tag: Optional[str] = Query(default=None),
    overdue: Optional[bool] = Query(default=None),
):
    return crud.list_tasks(status=status, tag=tag, overdue=overdue)


@router.post("", response_model=Task, status_code=201)
def create_task(payload: TaskCreate):
    return crud.create_task(payload)


@router.get("/{task_id}", response_model=Task)
def get_task(task_id: str):
    task = crud.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=Task)
def update_task(task_id: str, payload: TaskUpdate):
    try:
        task = crud.update_task(task_id, payload)
    except InvalidTransitionError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: str):
    deleted = crud.delete_task(task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")