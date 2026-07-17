"use client";

import { useEffect, useState } from "react";
import { Task, TaskStatus } from "@/lib/types";

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    description: string;
    status: TaskStatus;
    due_date: string | null;
    tags: string[];
  }) => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function TaskModal({ task, onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [dueDate, setDueDate] = useState(task?.due_date ?? "");
  const [tags, setTags] = useState<string[]>(task?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function addTag() {
    const value = tagDraft.trim();
    if (!value) return;
    if (tags.includes(value)) {
      setTagDraft("");
      return;
    }
    if (tags.length >= 10) {
      setError("A task can have at most 10 tags");
      return;
    }
    setTags([...tags, value]);
    setTagDraft("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      due_date: dueDate || null,
      tags,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-ink-line bg-ink-raised p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold italic text-paper">
            {task ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={onClose}
            className="focus-ring rounded p-1 text-paper-dim hover:text-paper"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label className="font-mono text-[11px] uppercase tracking-wide text-paper-dim">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="focus-ring mt-1 w-full rounded-md border border-ink-line bg-ink px-3 py-2 text-sm text-paper"
              placeholder="What needs to get done?"
              autoFocus
            />
          </div>

          <div>
            <label className="font-mono text-[11px] uppercase tracking-wide text-paper-dim">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="focus-ring mt-1 w-full resize-none rounded-md border border-ink-line bg-ink px-3 py-2 text-sm text-paper"
              placeholder="Optional details"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-wide text-paper-dim">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as TaskStatus)}
                className="focus-ring mt-1 w-full rounded-md border border-ink-line bg-ink px-3 py-2 text-sm text-paper"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-wide text-paper-dim">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="focus-ring mt-1 w-full rounded-md border border-ink-line bg-ink px-3 py-2 text-sm text-paper"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[11px] uppercase tracking-wide text-paper-dim">Tags</label>
            <div className="mt-1 flex flex-wrap items-center gap-2 rounded-md border border-ink-line bg-ink px-3 py-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full border border-teal/30 bg-teal/10 px-2 py-0.5 font-mono text-[11px] text-teal"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                value={tagDraft}
                onChange={(event) => setTagDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                onBlur={addTag}
                placeholder={tags.length === 0 ? "Add a tag and press Enter" : ""}
                className="focus-ring min-w-[100px] flex-1 bg-transparent text-sm text-paper placeholder:text-paper-dim"
              />
            </div>
          </div>

          {error && <p className="font-mono text-xs text-crimson">{error}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="focus-ring rounded-md border border-ink-line px-4 py-2 text-sm text-paper-dim hover:text-paper"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="focus-ring rounded-md bg-amber px-4 py-2 text-sm font-medium text-ink hover:brightness-110"
            >
              {task ? "Save changes" : "Create task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}