"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MonthPicker from "@/components/MonthPicker";
import ExpenseCard from "@/components/ExpenseCard";
import { useExpenses } from "@/hooks/useExpenses";
import { useCategories } from "@/hooks/useCategories";

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function ExpensesPage() {
  const router = useRouter();
  const [month, setMonth] = useState(getCurrentMonth);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const { expenses, loading } = useExpenses({ month, categoryId: selectedCategoryId });
  const { categories } = useCategories();

  const grouped = expenses.reduce<Record<string, typeof expenses>>((acc, expense) => {
    if (!acc[expense.date]) acc[expense.date] = [];
    acc[expense.date].push(expense);
    return acc;
  }, {});

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
  };

  return (
    <div className="px-4 pt-6 space-y-4">
      <h1 className="text-xl font-bold text-center text-gray-900">支出一覧</h1>

      <MonthPicker month={month} onChange={setMonth} />

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        <button
          onClick={() => setSelectedCategoryId(undefined)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !selectedCategoryId ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          すべて
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(
              selectedCategoryId === cat.id ? undefined : cat.id
            )}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategoryId === cat.id ? "text-white" : "bg-gray-100 text-gray-700"
            }`}
            style={selectedCategoryId === cat.id ? { backgroundColor: cat.color } : {}}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-4xl mb-2">📝</p>
          <p className="text-gray-500">支出がありません</p>
        </div>
      ) : (
        <>
          {Object.entries(grouped)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, dayExpenses]) => {
              const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
              return (
                <div key={date}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-600">{formatDateHeader(date)}</h3>
                    <span className="text-sm text-gray-500">¥{dayTotal.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2">
                    {dayExpenses.map((expense) => (
                      <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        category={categories.find((c) => c.id === expense.categoryId)}
                        onClick={() => router.push(`/add?expenseId=${expense.id}`)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <span className="text-sm text-gray-500">合計</span>
            <p className="text-xl font-bold text-gray-900">¥{total.toLocaleString()}</p>
          </div>
        </>
      )}
    </div>
  );
}
