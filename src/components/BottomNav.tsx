"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/camera", label: "撮影", icon: "📷", primary: true },
  { href: "/expenses", label: "一覧", icon: "📋" },
  { href: "/categories", label: "カテゴリ", icon: "🏷️" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                item.primary
                  ? ""
                  : isActive
                    ? "text-indigo-600"
                    : "text-gray-500"
              }`}
            >
              {item.primary ? (
                <span className="flex items-center justify-center w-12 h-12 -mt-4 rounded-full bg-indigo-600 text-white text-xl shadow-lg">
                  {item.icon}
                </span>
              ) : (
                <span className="text-xl">{item.icon}</span>
              )}
              <span className={`text-xs mt-0.5 ${item.primary ? "text-indigo-600 font-medium" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
