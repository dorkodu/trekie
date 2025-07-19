import React from "react";

// Utility to map color prop to Tailwind classes
const colorMap: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/40",
    border: "border-2 border-blue-200 dark:border-blue-800",
    text: "text-blue-900 dark:text-blue-100",
    accent: "text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/40",
    border: "border-2 border-green-200 dark:border-green-800",
    text: "text-green-900 dark:text-green-100",
    accent: "text-green-600 dark:text-green-400",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/40",
    border: "border-2 border-red-200 dark:border-red-800",
    text: "text-red-900 dark:text-red-100",
    accent: "text-red-600 dark:text-red-400",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/40",
    border: "border-2 border-orange-200 dark:border-orange-800",
    text: "text-orange-900 dark:text-orange-100",
    accent: "text-orange-600 dark:text-orange-400",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-900/40",
    border: "border-2 border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-900 dark:text-yellow-100",
    accent: "text-yellow-600 dark:text-yellow-400",
  },
  gray: {
    bg: "bg-gray-100 dark:bg-gray-900/40",
    border: "border-2 border-gray-200 dark:border-gray-800",
    text: "text-gray-900 dark:text-gray-100",
    accent: "text-gray-600 dark:text-gray-400",
  },
};

export function SumCard({
  icon,
  value,
  subtext,
  color = "blue",
  kind,
}: {
  icon: React.ReactNode;
  value: number;
  color?: keyof typeof colorMap;
  kind?: string;
  subtext?: string;
}) {
  const colors = colorMap[color] ?? colorMap.blue;
  return (
    <div
      className={`rounded-xl border shadow-sm p-0 ${colors?.bg} ${colors?.border}`}
      style={{ boxShadow: "0px 3px 0px 0px rgba(0,0,0,0.04)" }}
    >
      <div className="flex flex-row items-stretch justify-between w-full">
        <div className="flex flex-col gap-0 px-2 py-1.5">
          <div className="flex flex-row items-end gap-1">
            <span
              className={`font-extrabold text-lg leading-tight ${colors?.text}`}
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.08)" }}
            >
              {value}
            </span>
            {subtext && (
              <span
                className={`font-medium text-xs leading-tight ${colors?.text}`}
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.08)" }}
              >
                {subtext}
              </span>
            )}
          </div>
          {kind && (
            <span
              className={`uppercase font-bold text-[11px] leading-4 ${colors?.accent}`}
            >
              {kind}
            </span>
          )}
        </div>
        <div className="pr-2 flex items-center">
          <div className="flex items-center justify-center">{icon}</div>
        </div>
      </div>
    </div>
  );
}
