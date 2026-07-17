"use client";

import { Task } from "@/lib/types";

interface ManifestHeaderProps {
  tasks: Task[];
  onNewTask: () => void;
}

interface ReadoutProps {
  label: string;
  value: number;
  tone?: "paper" | "amber" | "teal" | "crimson";
}

function Readout({ label, value, tone = "paper" }: ReadoutProps) {
  const toneClass = {
    paper: "text-paper",
    amber: "text-amber",
    teal: "text-teal",
    crimson: "text-crimson",
  }[tone];

  return (
    <div className="flex flex-col gap-1 px-6 py-4 first:pl-0 last:pr-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper-dim">
        {label}
      </span>
      <span
        key={value}
        className={`font-mono text-4xl font-medium tabular-figures animate-flip ${toneClass}`}
      >
        {String(value).padStart(2, "0")}
      </span>
    </div>
  );
}

export default function ManifestHeader({ tasks, onNewTask }: ManifestHeaderProps) {
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const done = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter((t) => t.overdue).length;

  return (
    <header className="border-b border-ink-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim">
            Workspace / Board 01
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold italic text-paper">
            Task Tracker
          </h1>
        </div>

        <div className="flex flex-wrap items-center divide-x divide-ink-line rounded-lg border border-ink-line bg-ink-raised/60 px-2">
          <Readout label="To Do" value={todo} />
          <Readout label="In Progress" value={inProgress} tone="teal" />
          <Readout label="Done" value={done} />
          <Readout label="Overdue" value={overdue} tone={overdue > 0 ? "crimson" : "paper"} />
        </div>

        <button
          onClick={onNewTask}
          className="focus-ring inline-flex h-11 items-center justify-center rounded-md bg-amber px-5 font-sans text-sm font-medium text-ink transition hover:brightness-110"
        >
          New Task
        </button>
      </div>
    </header>
  );
}