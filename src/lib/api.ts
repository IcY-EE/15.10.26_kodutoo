import type { NewTask, Task, TaskUpdate } from "@/types/task";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Päring ebaõnnestus (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export type StatusFilter = "all" | "active" | "completed";

export const api = {
  list: (status: StatusFilter = "all") =>
    fetch(`/api/tasks?status=${status}`, { cache: "no-store" }).then((r) => handle<Task[]>(r)),

  create: (task: NewTask) =>
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    }).then((r) => handle<Task>(r)),

  update: (id: string, changes: TaskUpdate) =>
    fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    }).then((r) => handle<Task>(r)),

  remove: (id: string) =>
    fetch(`/api/tasks/${id}`, { method: "DELETE" }).then((r) => handle<void>(r)),
};
