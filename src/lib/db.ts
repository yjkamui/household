import { openDB, type IDBPDatabase } from "idb";
import { DEFAULT_CATEGORIES } from "./constants";

const DB_NAME = "kakeibo-db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const expenseStore = db.createObjectStore("expenses", { keyPath: "id" });
        expenseStore.createIndex("by-date", "date");
        expenseStore.createIndex("by-category", "categoryId");

        const categoryStore = db.createObjectStore("categories", { keyPath: "id" });
        categoryStore.createIndex("by-sort", "sortOrder");

        db.createObjectStore("images", { keyPath: "id" });

        DEFAULT_CATEGORIES.forEach((cat) => categoryStore.add(cat));
      },
    });
  }
  return dbPromise;
}
