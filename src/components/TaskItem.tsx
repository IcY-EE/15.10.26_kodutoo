"use client";

import { useState } from "react";
import type { Priority, Task, TaskUpdate } from "@/types/task";

const PRIORITY_STYLE: Record<Priority, { label: string; className: string }> = {
  low: { label: "Madal", className: "bg-gray-100 text-gray-600" },
  medium: { label: "Keskmine", className: "bg-amber-100 text-amber-800" },
  high: { label: "Kõrge", className: "bg-red-100 text-red-700" },
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function isOverdue(task: Task) {
  if (!task.due_date || task.completed) return false;
  const today = new Date().toLocaleDateString("sv-SE");
  return task.due_date < today;
}

interface Props {
  task: Task;
  onUpdate: (id: string, changes: TaskUpdate) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TaskItem({ task, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  async function saveTitle() {
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) await onUpdate(task.id, { title: trimmed });
    else setTitle(task.title);
    setEditing(false);
  }

  const priority = PRIORITY_STYLE[task.priority];

  return (
    <li className="group flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onUpdate(task.id, { completed: !task.completed })}
        className="mt-1 h-5 w-5 cursor-pointer accent-indigo-600"
        aria-label="Märgi tehtuks"
      />

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") {
                setTitle(task.title);
                setEditing(false);
              }
            }}
            maxLength={200}
            className="w-full rounded border border-indigo-300 px-1 font-medium outline-none"
          />
        ) : (
          <p
            onDoubleClick={() => setEditing(true)}
            title="Topeltklõps muutmiseks"
            className={`cursor-text font-medium ${task.completed ? "text-gray-400 line-through" : ""}`}
          >
            {task.title}
          </p>
        )}

        {task.description && (
          <p className="mt-1 text-sm text-gray-500">{task.description}</p>
        )}

        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className={`rounded-full px-2 py-0.5 font-medium ${priority.className}`}>
            {priority.label}
          </span>
          {task.due_date && (
            <span
              className={`rounded-full px-2 py-0.5 ${
                isOverdue(task) ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {isOverdue(task) ? "Hilinenud: " : "Tähtaeg: "}
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          if (confirm(`Kustutan „${task.title}“?`)) onDelete(task.id);
        }}
        className="rounded-md px-2 py-1 text-sm text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
        aria-label="Kustuta"
      >
        Kustuta
      </button>
    </li>
  );
}
