import { Category } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: uuidv4(), name: "食費", color: "#EF4444", icon: "🍽️", sortOrder: 0, isDefault: true },
  { id: uuidv4(), name: "日用品", color: "#F97316", icon: "🏠", sortOrder: 1, isDefault: true },
  { id: uuidv4(), name: "交通費", color: "#3B82F6", icon: "🚃", sortOrder: 2, isDefault: true },
  { id: uuidv4(), name: "光熱費", color: "#EAB308", icon: "💡", sortOrder: 3, isDefault: true },
  { id: uuidv4(), name: "医療費", color: "#10B981", icon: "🏥", sortOrder: 4, isDefault: true },
  { id: uuidv4(), name: "衣服", color: "#EC4899", icon: "👕", sortOrder: 5, isDefault: true },
  { id: uuidv4(), name: "娯楽", color: "#8B5CF6", icon: "🎮", sortOrder: 6, isDefault: true },
  { id: uuidv4(), name: "教育", color: "#06B6D4", icon: "📚", sortOrder: 7, isDefault: true },
  { id: uuidv4(), name: "通信費", color: "#6366F1", icon: "📱", sortOrder: 8, isDefault: true },
  { id: uuidv4(), name: "その他", color: "#6B7280", icon: "📦", sortOrder: 9, isDefault: true },
];
