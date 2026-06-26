"use client";
import type { Expense, Category } from "@/types";
import CategoryBadge from "./CategoryBadge";

interface ExpenseCardProps {
  expense: Expense;
  category?: Category;
  onClick?: () => void;
}

export default function ExpenseCard({ expense, category, onClick }: ExpenseCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
    >
      {category && (
        <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-gray-50">
          {category.icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">{expense.storeName}</span>
          {category && <CategoryBadge category={category} />}
        </div>
        {expense.memo && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{expense.memo}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <div className="font-bold text-gray-900">
          ¥{expense.amount.toLocaleString()}
        </div>
        <div className="text-xs text-gray-400">{expense.date}</div>
      </div>
    </button>
  );
}
