export interface Expense {
  id: string;
  date: string;
  storeName: string;
  amount: number;
  categoryId: string;
  memo?: string;
  imageId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  sortOrder: number;
  isDefault: boolean;
}

export interface ReceiptImage {
  id: string;
  blob: Blob;
  thumbnail: Blob;
  createdAt: string;
}

export interface MonthlySummary {
  month: string;
  total: number;
  categoryBreakdown: { categoryId: string; total: number }[];
  count: number;
}
