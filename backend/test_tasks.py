from datetime import date, timedelta

import pytest
from fastapi.testclient import TestClient

import crud
from main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_storage():
    crud.reset()
    yield
    crud.reset()


def _create(**overrides):
    payload = {"title": "Sample task", "status": "todo"}
    payload.update(overrides)
    return client.post("/tasks", json=payload)


def test_create_task_with_valid_due_date():
    due = (date.today() + timedelta(days=5)).isoformat()
    response = _create(due_date=due)
    assert response.status_code == 201
    assert response.json()["due_date"] == due


def test_create_task_invalid_due_date_format():
    response = _create(due_date="not-a-date")
    assert response.status_code == 422


def test_task_marked_overdue_when_past_due_and_not_done():
    past = (date.today() - timedelta(days=3)).isoformat()
    created = _create(due_date=past, status="in_progress").json()
    assert created["overdue"] is True

    done = _create(due_date=past, status="done").json()
    assert done["overdue"] is False


def test_filter_tasks_overdue_only():
    past = (date.today() - timedelta(days=1)).isoformat()
    future = (date.today() + timedelta(days=1)).isoformat()
    _create(due_date=past, status="todo")
    _create(due_date=future, status="todo")

    response = client.get("/tasks", params={"overdue": True})
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["due_date"] == past


def test_create_task_with_tags():
    response = _create(tags=["design", "urgent"])
    assert response.status_code == 201
    assert response.json()["tags"] == ["design", "urgent"]


def test_reject_empty_tag():
    response = _create(tags=["  "])
    assert response.status_code == 422


def test_filter_tasks_by_tag():
    _create(tags=["backend"])
    _create(tags=["frontend"])

    response = client.get("/tasks", params={"tag": "backend"})
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["tags"] == ["backend"]


def test_filter_tasks_by_tag_no_match_returns_empty_list():
    _create(tags=["backend"])
    response = client.get("/tasks", params={"tag": "nonexistent"})
    assert response.status_code == 200
    assert response.json() == []


def test_update_preserves_tags_on_unrelated_change():
    created = _create(tags=["keep-me"]).json()
    task_id = created["id"]

    response = client.patch(f"/tasks/{task_id}", json={"title": "Renamed task"})
    assert response.status_code == 200
    assert response.json()["tags"] == ["keep-me"]


def test_delete_missing_task_returns_404():
    response = client.delete("/tasks/does-not-exist")
    assert response.status_code == 404


def test_update_missing_task_returns_404():
    response = client.patch("/tasks/does-not-exist", json={"title": "x"})
    assert response.status_code == 404