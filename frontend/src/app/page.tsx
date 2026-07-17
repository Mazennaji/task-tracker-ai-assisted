"use client";

import { useEffect, useMemo, useState } from "react";
import { Task, TaskStatus } from "@/lib/types";
import { createTask, deleteTask, fetchTasks, updateTask } from "@/lib/api";
import ManifestHeader from "@/components/ManifestHeader";
import FilterBar from "@/components/FilterBar";
import Board from "@/components/Board";
import TaskModal from "@/components/TaskModal";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((task) => task.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (tag && !task.tags.includes(tag)) return false;
      if (overdueOnly && !task.overdue) return false;
      return true;
    });
  }, [tasks, search, tag, overdueOnly]);

  function openNewTaskModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  async function handleSubmit(values: {
    title: string;
    description: string;
    status: TaskStatus;
    due_date: string | null;
    tags: string[];
  }) {
    if (editingTask) {
      await updateTask(editingTask.id, {
        title: values.title,
        description: values.description,
        status: values.status,
        due_date: values.due_date,
        clear_due_date: values.due_date === null,
        tags: values.tags,
      });
    } else {
      await createTask(values);
    }
    setModalOpen(false);
    setEditingTask(null);
    await loadTasks();
  }

  async function handleDelete(task: Task) {
    await deleteTask(task.id);
    await loadTasks();
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    const current = tasks.find((t) => t.id === taskId);
    if (!current || current.status === status) return;
    await updateTask(taskId, { status });
    await loadTasks();
  }

  return (
    <main>
      <ManifestHeader tasks={tasks} onNewTask={openNewTaskModal} />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        tag={tag}
        onTagChange={setTag}
        overdueOnly={overdueOnly}
        onOverdueToggle={() => setOverdueOnly(!overdueOnly)}
        availableTags={availableTags}
      />

      {loading ? (
        <div className="mx-auto max-w-6xl px-6 py-16 text-center font-mono text-sm text-paper-dim">
          Loading board
        </div>
      ) : (
        <Board
          tasks={filteredTasks}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
}