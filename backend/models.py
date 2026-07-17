from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

STATUSES = ["todo", "in_progress", "done"]
MAX_TAGS = 10
MAX_TAG_LENGTH = 30


def _clean_tags(tags: List[str]) -> List[str]:
    cleaned = []
    for tag in tags:
        value = tag.strip()
        if not value:
            raise ValueError("tags cannot be empty or whitespace")
        if len(value) > MAX_TAG_LENGTH:
            raise ValueError(f"tags must be {MAX_TAG_LENGTH} characters or fewer")
        cleaned.append(value)
    if len(cleaned) > MAX_TAGS:
        raise ValueError(f"a task cannot have more than {MAX_TAGS} tags")
    return cleaned


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: str = "todo"
    due_date: Optional[date] = None
    tags: List[str] = Field(default_factory=list)

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        if value not in STATUSES:
            raise ValueError(f"status must be one of {STATUSES}")
        return value

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, value: List[str]) -> List[str]:
        return _clean_tags(value)


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: Optional[str] = None
    due_date: Optional[date] = None
    clear_due_date: bool = False
    tags: Optional[List[str]] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and value not in STATUSES:
            raise ValueError(f"status must be one of {STATUSES}")
        return value

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, value: Optional[List[str]]) -> Optional[List[str]]:
        if value is None:
            return value
        return _clean_tags(value)


class Task(TaskBase):
    id: str
    created_at: datetime
    updated_at: datetime
    overdue: bool = False