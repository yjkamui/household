"use client";

interface MonthPickerProps {
  month: string;
  onChange: (month: string) => void;
}

export default function MonthPicker({ month, onChange }: MonthPickerProps) {
  const [year, mon] = month.split("-").map(Number);

  const prev = () => {
    const d = new Date(year, mon - 2, 1);
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const next = () => {
    const d = new Date(year, mon, 1);
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button onClick={prev} className="p-2 rounded-full hover:bg-gray-100 text-lg">
        ◀
      </button>
      <span className="text-lg font-bold min-w-[120px] text-center">
        {year}年{mon}月
      </span>
      <button onClick={next} className="p-2 rounded-full hover:bg-gray-100 text-lg">
        ▶
      </button>
    </div>
  );
}
