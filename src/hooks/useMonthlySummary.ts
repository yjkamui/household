"use client";
import { useState, useEffect } from "react";
import type { MonthlySummary } from "@/types";
import { getExpensesByMonth } from "@/lib/expenses";

export function useMonthlySummary(month: string) {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const expenses = await getExpensesByMonth(month);
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      const breakdownMap = new Map<string, number>();
      for (const e of expenses) {
        breakdownMap.set(e.categoryId, (breakdownMap.get(e.categoryId) || 0) + e.amount);
      }
      const categoryBreakdown = Array.from(breakdownMap.entries())
        .map(([categoryId, total]) => ({ categoryId, total }))
        .sort((a, b) => b.total - a.total);

      setSummary({ month, total, categoryBreakdown, count: expenses.length });
      setLoading(false);
    })();
  }, [month]);

  return { summary, loading };
}
