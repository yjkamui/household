import { v4 as uuidv4 } from "uuid";
import type { Category } from "@/types";
import { getDB } from "./db";

export async function getCategories(): Promise<Category[]> {
  const db = await getDB();
  return db.getAllFromIndex("categories", "by-sort");
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const db = await getDB();
  return db.get("categories", id);
}

export async function addCategory(data: {
  name: string;
  color: string;
  icon: string;
}): Promise<Category> {
  const db = await getDB();
  const all = await getCategories();
  const maxOrder = all.reduce((max, c) => Math.max(max, c.sortOrder), -1);
  const category: Category = {
    id: uuidv4(),
    ...data,
    sortOrder: maxOrder + 1,
    isDefault: false,
  };
  await db.put("categories", category);
  return category;
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, "id" | "isDefault">>
): Promise<Category> {
  const db = await getDB();
  const existing = await db.get("categories", id);
  if (!existing) throw new Error("Category not found");
  const updated: Category = { ...existing, ...data };
  await db.put("categories", updated);
  return updated;
}

export async function deleteCategory(id: string): Promise<void> {
  const db = await getDB();
  const category = await db.get("categories", id);
  if (!category) return;
  if (category.isDefault) throw new Error("デフォルトカテゴリは削除できません");

  const allCategories = await getCategories();
  const otherCategory = allCategories.find((c) => c.name === "その他");
  if (otherCategory) {
    const expenses = await db.getAllFromIndex("expenses", "by-category", id);
    const tx = db.transaction("expenses", "readwrite");
    for (const expense of expenses) {
      expense.categoryId = otherCategory.id;
      await tx.store.put(expense);
    }
    await tx.done;
  }

  await db.delete("categories", id);
}
