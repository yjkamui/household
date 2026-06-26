"use client";
import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Category } from "@/types";

const PRESET_COLORS = [
  "#EF4444", "#F97316", "#EAB308", "#10B981",
  "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899",
];

const PRESET_ICONS = ["🍽️", "🏠", "🚃", "💡", "🏥", "👕", "🎮", "📚", "📱", "📦", "🎬", "✈️", "🐱", "💼", "🎁"];

export default function CategoriesPage() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState(PRESET_COLORS[0]);
  const [editIcon, setEditIcon] = useState(PRESET_ICONS[0]);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
    setEditIcon(cat.icon);
    setShowAdd(false);
  };

  const startAdd = () => {
    setShowAdd(true);
    setEditingId(null);
    setEditName("");
    setEditColor(PRESET_COLORS[0]);
    setEditIcon(PRESET_ICONS[0]);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    if (editingId) {
      await updateCategory(editingId, { name: editName, color: editColor, icon: editIcon });
      setEditingId(null);
    }
  };

  const handleSaveAdd = async () => {
    if (!editName.trim()) return;
    await addCategory({ name: editName, color: editColor, icon: editIcon });
    setShowAdd(false);
    setEditName("");
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="px-4 pt-6 space-y-4">
      <h1 className="text-xl font-bold text-center text-gray-900">カテゴリ管理</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: cat.color + "20" }}
                >
                  {cat.icon}
                </span>
                <span className="flex-1 font-medium text-gray-900">{cat.name}</span>
                <button
                  onClick={() => startEdit(cat)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  ✏️
                </button>
                {!cat.isDefault && (
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    🗑️
                  </button>
                )}
              </div>

              {editingId === cat.id && (
                <div className="mt-2 p-4 bg-gray-50 rounded-xl space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
                    placeholder="カテゴリ名"
                  />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">色</p>
                    <div className="flex gap-2 flex-wrap">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setEditColor(c)}
                          className={`w-8 h-8 rounded-full transition-transform ${editColor === c ? "scale-125 ring-2 ring-offset-2 ring-gray-400" : ""}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">アイコン</p>
                    <div className="flex gap-2 flex-wrap">
                      {PRESET_ICONS.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setEditIcon(icon)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${editIcon === icon ? "scale-125 ring-2 ring-offset-2 ring-gray-400 bg-gray-100" : ""}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                    >
                      保存
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd ? (
        <div className="p-4 bg-white rounded-xl shadow-sm space-y-3">
          <h3 className="font-medium text-gray-900">新しいカテゴリ</h3>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
            placeholder="カテゴリ名"
          />
          <div>
            <p className="text-xs text-gray-500 mb-1">色</p>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setEditColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${editColor === c ? "scale-125 ring-2 ring-offset-2 ring-gray-400" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">アイコン</p>
            <div className="flex gap-2 flex-wrap">
              {PRESET_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setEditIcon(icon)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${editIcon === icon ? "scale-125 ring-2 ring-offset-2 ring-gray-400 bg-gray-100" : ""}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm"
            >
              キャンセル
            </button>
            <button
              onClick={handleSaveAdd}
              className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm"
            >
              追加
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startAdd}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-medium"
        >
          + カテゴリを追加
        </button>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="カテゴリを削除"
        message={`「${deleteTarget?.name}」を削除しますか？このカテゴリの支出は「その他」に移動されます。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
