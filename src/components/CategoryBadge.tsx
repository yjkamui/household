import type { Category } from "@/types";

export default function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: category.color }}
    >
      <span>{category.icon}</span>
      <span>{category.name}</span>
    </span>
  );
}
