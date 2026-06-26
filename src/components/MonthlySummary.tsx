"use client";
import type { MonthlySummary as MonthlySummaryType, Category } from "@/types";

interface MonthlySummaryProps {
  summary: MonthlySummaryType | null;
  categories: Category[];
  loading: boolean;
}

export default function MonthlySummary({ summary, categories, loading }: MonthlySummaryProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
      </div>
    );
  }

  if (!summary || summary.count === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <p className="text-3xl font-bold text-gray-900">¥0</p>
        <p className="text-sm text-gray-500 mt-1">支出はありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-3xl font-bold text-center text-gray-900">
        ¥{summary.total.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 text-center mt-1">{summary.count}件の支出</p>

      <div className="mt-4 space-y-2">
        {summary.categoryBreakdown.map(({ categoryId, total }) => {
          const cat = categories.find((c) => c.id === categoryId);
          if (!cat) return null;
          const percentage = Math.round((total / summary.total) * 100);
          return (
            <div key={categoryId} className="flex items-center gap-2 text-sm">
              <span>{cat.icon}</span>
              <span className="flex-1 text-gray-700">{cat.name}</span>
              <div className="w-24 bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                />
              </div>
              <span className="text-gray-900 font-medium w-20 text-right">
                ¥{total.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
