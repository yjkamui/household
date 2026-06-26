import { v4 as uuidv4 } from "uuid";
import type { Expense } from "@/types";
import { getDB } from "./db";

export async function addExpense(
  data: Omit<Expense, "id" | "createdAt" | "updatedAt">
): Promise<Expense> {
  const db = await getDB();
  const now = new Date().toISOString();
  const expense: Expense = {
    ...data,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  await db.put("expenses", expense);
  return expense;
}

export async function updateExpense(
  id: string,
  data: Partial<Omit<Expense, "id" | "createdAt">>
): Promise<Expense> {
  const db = await getDB();
  const existing = await db.get("expenses", id);
  if (!existing) throw new Error("Expense not found");
  const updated: Expense = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await db.put("expenses", updated);
  return updated;
}

export async function deleteExpense(id: string): Promise<void> {
  const db = await getDB();
  const expense = await db.get("expenses", id);
  if (expense?.imageId) {
    await db.delete("images", expense.imageId);
  }
  await db.delete("expenses", id);
}

export async function getExpense(id: string): Promise<Expense | undefined> {
  const db = await getDB();
  return db.get("expenses", id);
}

export async function getExpensesByMonth(month: string): Promise<Expense[]> {
  const db = await getDB();
  const [year, mon] = month.split("-").map(Number);
  const start = `${year}-${String(mon).padStart(2, "0")}-01`;
  const lastDay = new Date(year, mon, 0).getDate();
  const end = `${year}-${String(mon).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  const range = IDBKeyRange.bound(start, end);
  return db.getAllFromIndex("expenses", "by-date", range);
}

export async function getRecentExpenses(limit: number): Promise<Expense[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("expenses", "by-date");
  return all.reverse().slice(0, limit);
}
