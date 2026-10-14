"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type StatusFilter } from "@/lib/api";
import type { NewTask, Task, TaskUpdate } from "@/types/task";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";
import FilterTabs from "@/components/FilterTabs";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await api.list(filter));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate(task: NewTask) {
    const created = await api.create(task);
    if (filter !== "completed") setTasks((prev) => [created, ...prev]);
  }

  async function handleUpdate(id: string, changes: TaskUpdate) {
    try {
      const updated = await api.update(id, changes);
      setTasks((prev) =>
        prev
          .map((t) => (t.id === id ? updated : t))
          .filter((t) =>
            filter === "active" ? !t.completed : filter === "completed" ? t.completed : true
          )
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(id: string) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.remove(id);
    } catch (e) {
      setTasks(previous);
      setError((e as Error).message);
    }
  }

  const openCount = tasks.filter((t) => !t.completed).length;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Ülesannete haldur</h1>
        <p className="mt-1 text-sm text-gray-500">Next.js + Supabase</p>
      </header>

      <TaskForm onSubmit={handleCreate} />

      <div className="mt-8 mb-4 flex items-center justify-between">
        <FilterTabs value={filter} onChange={setFilter} />
        {!loading && filter === "all" && (
          <span className="text-sm text-gray-500">{openCount} pooleli</span>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={loadTasks} className="font-medium underline">
            Proovi uuesti
          </button>
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-gray-400">Laen…</p>
      ) : tasks.length === 0 ? (
        <p className="py-10 text-center text-gray-400">Ülesandeid pole.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
