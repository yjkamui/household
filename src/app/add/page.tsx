"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import CategoryPicker from "@/components/CategoryPicker";
import { addExpense, getExpense, updateExpense, deleteExpense } from "@/lib/expenses";
import { getImage, createImageUrl } from "@/lib/images";
import ConfirmDialog from "@/components/ConfirmDialog";

function AddExpenseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageIdParam = searchParams.get("imageId");
  const expenseIdParam = searchParams.get("expenseId");
  const { categories, loading: categoriesLoading } = useCategories();

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [storeName, setStoreName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [memo, setMemo] = useState("");
  const [imageId, setImageId] = useState<string | null>(imageIdParam);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const isEdit = !!expenseIdParam;

  useEffect(() => {
    if (expenseIdParam) {
      getExpense(expenseIdParam).then((expense) => {
        if (expense) {
          setDate(expense.date);
          setStoreName(expense.storeName);
          setAmount(String(expense.amount));
          setCategoryId(expense.categoryId);
          setMemo(expense.memo || "");
          setImageId(expense.imageId || null);
        }
      });
    }
  }, [expenseIdParam]);

  useEffect(() => {
    if (imageId) {
      getImage(imageId).then((img) => {
        if (img) {
          const url = createImageUrl(img.thumbnail);
          setImageUrl(url);
          return () => URL.revokeObjectURL(url);
        }
      });
    }
  }, [imageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !amount || !categoryId) return;
    setSaving(true);
    const data = {
      date,
      storeName,
      amount: parseInt(amount, 10),
      categoryId,
      memo: memo || undefined,
      imageId: imageId || undefined,
    };
    if (isEdit && expenseIdParam) {
      await updateExpense(expenseIdParam, data);
    } else {
      await addExpense(data);
    }
    router.push("/");
  };

  const handleDelete = async () => {
    if (expenseIdParam) {
      await deleteExpense(expenseIdParam);
      router.push("/");
    }
  };

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="text-xl font-bold text-center text-gray-900 mb-6">
        {isEdit ? "支出を編集" : "支出を追加"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">店名</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="例: スーパーマーケット"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
          {categoriesLoading ? (
            <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <CategoryPicker
              categories={categories}
              selectedId={categoryId}
              onSelect={setCategoryId}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">メモ（任意）</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="メモを入力..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">レシート写真</label>
          {imageUrl ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="レシート" className="w-20 h-20 object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => { setImageId(null); setImageUrl(null); }}
                className="text-sm text-red-500 hover:text-red-600"
              >
                写真を削除
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/camera")}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              📷 レシートを撮影
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={saving || !storeName || !amount || !categoryId}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "保存中..." : isEdit ? "更新" : "保存"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="w-full py-3 rounded-xl border border-red-300 text-red-500 font-medium hover:bg-red-50"
          >
            この支出を削除
          </button>
        )}
      </form>

      <ConfirmDialog
        open={showDelete}
        title="支出を削除"
        message="この支出を削除してもよろしいですか？この操作は取り消せません。"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}

export default function AddPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6"><div className="h-8 bg-gray-200 rounded animate-pulse" /></div>}>
      <AddExpenseForm />
    </Suspense>
  );
}
