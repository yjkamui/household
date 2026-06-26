"use client";
import { useState, useEffect, useCallback } from "react";
import type { Category } from "@/types";
import * as categoriesLib from "@/lib/categories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const data = await categoriesLib.getCategories();
    setCategories(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (data: { name: string; color: string; icon: string }) => {
    await categoriesLib.addCategory(data);
    await fetchCategories();
  };

  const updateCategory = async (id: string, data: Partial<Omit<Category, "id" | "isDefault">>) => {
    await categoriesLib.updateCategory(id, data);
    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    await categoriesLib.deleteCategory(id);
    await fetchCategories();
  };

  return { categories, loading, addCategory, updateCategory, deleteCategory, refetch: fetchCategories };
}
