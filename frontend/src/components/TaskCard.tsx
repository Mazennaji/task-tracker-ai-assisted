"use client";

import { Task } from "@/lib/types";
import { formatDueDate } from "@/lib/format";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const VISIBLE_TAGS = 3;

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const visibleTags = task.tags.slice(0, VISIBLE_TAGS);
  const extraTags = task.tags.length - visibleTags.length;

  return (
    <div
      onClick={() => onEdit(task)}
      className="group animate-riseIn cursor-pointer rounded-lg border border-ink-line bg-ink-raised p-4 transition hover:border-paper-dim/60"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-sans text-sm font-medium leading-snug text-paper">{task.title}</h3>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onDelete(task);
          }}
          className="focus-ring shrink-0 rounded p-1 text-paper-dim opacity-0 transition hover:text-crimson group-hover:opacity-100"
          aria-label="Delete task"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-2 text-xs text-paper-dim">{task.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {task.due_date && (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] ${
              task.overdue
                ? "border-crimson/40 bg-crimson/10 text-crimson"
                : "border-ink-line text-paper-dim"
            }`}
          >
            {task.overdue ? "Overdue" : formatDueDate(task.due_date)}
          </span>
        )}
        {visibleTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-teal/30 bg-teal/10 px-2 py-0.5 font-mono text-[11px] text-teal"
          >
            {tag}
          </span>
        ))}
        {extraTags > 0 && (
          <span className="rounded-full border border-ink-line px-2 py-0.5 font-mono text-[11px] text-paper-dim">
            +{extraTags} more
          </span>
        )}
      </div>
    </div>
  );
}