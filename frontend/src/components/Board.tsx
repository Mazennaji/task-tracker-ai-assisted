"use client";

import { Task, TaskStatus } from "@/lib/types";
import Column from "./Column";

interface BoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export default function Board({ tasks, onEdit, onDelete, onStatusChange }: BoardProps) {
  const columns: { title: string; status: TaskStatus; accent: string }[] = [
    { title: "To Do", status: "todo", accent: "bg-paper-dim" },
    { title: "In Progress", status: "in_progress", accent: "bg-teal" },
    { title: "Done", status: "done", accent: "bg-amber" },
  ];

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 pb-16 md:grid-cols-3">
      {columns.map((column) => (
        <Column
          key={column.status}
          title={column.title}
          status={column.status}
          accent={column.accent}
          tasks={tasks.filter((t) => t.status === column.status)}
          onEdit={onEdit}
          onDelete={onDelete}
          onDropTask={onStatusChange}
        />
      ))}
    </div>
  );
}