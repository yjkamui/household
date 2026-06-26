"use client";
import type { Category } from "@/types";

interface CategoryPickerProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export default function CategoryPicker({ categories, selectedId, onSelect }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
            selectedId === cat.id
              ? "bg-indigo-50 ring-2 ring-indigo-500"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <span className="text-2xl">{cat.icon}</span>
          <span className="text-xs text-gray-700 truncate w-full text-center">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
