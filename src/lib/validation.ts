import type { NewTask, Priority, TaskUpdate } from "@/types/task";

const PRIORITIES: Priority[] = ["low", "medium", "high"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function checkFields(body: Record<string, unknown>): string | null {
  if ("title" in body) {
    if (typeof body.title !== "string" || body.title.trim().length === 0)
      return "Pealkiri ei tohi olla tühi";
    if (body.title.trim().length > 200) return "Pealkiri on liiga pikk (max 200 märki)";
  }
  if ("description" in body && body.description !== null) {
    if (typeof body.description !== "string") return "Kirjeldus peab olema tekst";
    if (body.description.length > 1000) return "Kirjeldus on liiga pikk (max 1000 märki)";
  }
  if ("priority" in body && !PRIORITIES.includes(body.priority as Priority))
    return "Prioriteet peab olema low, medium või high";
  if ("due_date" in body && body.due_date !== null && body.due_date !== "") {
    if (typeof body.due_date !== "string" || !DATE_RE.test(body.due_date))
      return "Tähtaeg peab olema kujul YYYY-MM-DD";
  }
  if ("completed" in body && typeof body.completed !== "boolean")
    return "completed peab olema true või false";
  return null;
}

export function validateNewTask(body: unknown): Result<NewTask> {
  if (!isObject(body)) return { ok: false, error: "Vigane päringu sisu" };
  if (!("title" in body)) return { ok: false, error: "Pealkiri on kohustuslik" };

  const error = checkFields(body);
  if (error) return { ok: false, error };

  return {
    ok: true,
    data: {
      title: (body.title as string).trim(),
      description: (body.description as string | undefined)?.trim() || null,
      priority: (body.priority as Priority | undefined) ?? "medium",
      due_date: (body.due_date as string | undefined) || null,
    },
  };
}

export function validateTaskUpdate(body: unknown): Result<TaskUpdate> {
  if (!isObject(body)) return { ok: false, error: "Vigane päringu sisu" };

  const error = checkFields(body);
  if (error) return { ok: false, error };

  const data: TaskUpdate = {};
  if ("title" in body) data.title = (body.title as string).trim();
  if ("description" in body)
    data.description = (body.description as string | null)?.trim() || null;
  if ("priority" in body) data.priority = body.priority as Priority;
  if ("due_date" in body) data.due_date = (body.due_date as string | null) || null;
  if ("completed" in body) data.completed = body.completed as boolean;

  if (Object.keys(data).length === 0)
    return { ok: false, error: "Ühtegi muudetavat välja ei antud" };

  return { ok: true, data };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: string) => UUID_RE.test(v);
