"use client";

import { Task, TaskStatus } from "@/lib/types";
import TaskCard from "./TaskCard";

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  accent: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDropTask: (taskId: string, status: TaskStatus) => void;
}

export default function Column({ title, status, tasks, accent, onEdit, onDelete, onDropTask }: ColumnProps) {
  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        const taskId = event.dataTransfer.getData("text/plain");
        if (taskId) onDropTask(taskId, status);
      }}
      className="flex min-h-[320px] flex-1 flex-col gap-3 rounded-xl border border-ink-line bg-ink/40 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${accent}`} />
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-paper-dim">{title}</h2>
        </div>
        <span className="font-mono text-xs tabular-figures text-paper-dim">{tasks.length}</span>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.length === 0 && (
          <div className="rounded-lg border border-dashed border-ink-line px-3 py-6 text-center font-mono text-[11px] text-paper-dim">
            Nothing here
          </div>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(event) => event.dataTransfer.setData("text/plain", task.id)}
          >
            <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
}