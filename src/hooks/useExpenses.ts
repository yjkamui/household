"use client";
import { useState, useEffect, useCallback } from "react";
import type { Expense } from "@/types";
import * as expensesLib from "@/lib/expenses";

export function useExpenses(filters?: { month?: string; categoryId?: string }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    let data: Expense[];
    if (filters?.month) {
      data = await expensesLib.getExpensesByMonth(filters.month);
    } else {
      data = await expensesLib.getRecentExpenses(100);
    }
    if (filters?.categoryId) {
      data = data.filter((e) => e.categoryId === filters.categoryId);
    }
    data.sort((a, b) => b.date.localeCompare(a.date));
    setExpenses(data);
    setLoading(false);
  }, [filters?.month, filters?.categoryId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, loading, refetch: fetchExpenses };
}
