"use client";

import { useState, type FormEvent } from "react";
import type { NewTask, Priority } from "@/types/task";

interface Props {
  onSubmit: (task: NewTask) => Promise<void>;
}

export default function TaskForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Pealkiri on kohustuslik");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null,
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Mis vaja teha?"
        maxLength={200}
        className="w-full border-0 text-lg font-medium outline-none placeholder:text-gray-400"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Kirjeldus (valikuline)"
        maxLength={1000}
        rows={2}
        className="mt-2 w-full resize-none border-0 text-sm text-gray-600 outline-none placeholder:text-gray-400"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Prioriteet
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="low">Madal</option>
            <option value="medium">Keskmine</option>
            <option value="high">Kõrge</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          Tähtaeg
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="ml-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Lisan…" : "Lisa ülesanne"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
