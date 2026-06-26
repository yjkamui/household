"use client";
import { useState } from "react";
import Link from "next/link";
import MonthPicker from "@/components/MonthPicker";
import MonthlySummaryComponent from "@/components/MonthlySummary";
import ExpenseCard from "@/components/ExpenseCard";
import { useMonthlySummary } from "@/hooks/useMonthlySummary";
import { useExpenses } from "@/hooks/useExpenses";
import { useCategories } from "@/hooks/useCategories";

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function HomePage() {
  const [month, setMonth] = useState(getCurrentMonth);
  const { summary, loading: summaryLoading } = useMonthlySummary(month);
  const { expenses, loading: expensesLoading } = useExpenses({ month });
  const { categories } = useCategories();

  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="px-4 pt-6 space-y-6">
      <h1 className="text-xl font-bold text-center text-gray-900">家計簿</h1>

      <MonthPicker month={month} onChange={setMonth} />

      <MonthlySummaryComponent
        summary={summary}
        categories={categories}
        loading={summaryLoading}
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">最近の支出</h2>
          <Link
            href="/expenses"
            className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
          >
            すべて見る →
          </Link>
        </div>

        {expensesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentExpenses.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl">
            <p className="text-4xl mb-2">📝</p>
            <p className="text-gray-500 text-sm">まだ支出がありません</p>
            <Link
              href="/add"
              className="inline-block mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700"
            >
              支出を追加
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                category={categories.find((c) => c.id === expense.categoryId)}
                onClick={() => {
                  window.location.href = `/add?expenseId=${expense.id}`;
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Link
        href="/add"
        className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-indigo-700 transition-colors z-40"
      >
        +
      </Link>
    </div>
  );
}
