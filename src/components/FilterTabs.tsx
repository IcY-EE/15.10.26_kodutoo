import type { StatusFilter } from "@/lib/api";

const OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Kõik" },
  { value: "active", label: "Pooleli" },
  { value: "completed", label: "Tehtud" },
];

interface Props {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export default function FilterTabs({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg bg-gray-200 p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-3 py-1 text-sm font-medium transition ${
            value === opt.value ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
