"use client";

import clsx from "clsx";

export type SendosTransactionsFilterValue = "all" | "earned" | "spent";

interface SendosTransactionsFilterProps {
  value: SendosTransactionsFilterValue;
  onChange: (value: SendosTransactionsFilterValue) => void;
}

const options: Array<{ value: SendosTransactionsFilterValue; label: string }> = [
  { value: "all", label: "All" },
  { value: "earned", label: "Earned" },
  { value: "spent", label: "Spent" },
];

export function SendosTransactionsFilter({
  value,
  onChange,
}: SendosTransactionsFilterProps) {
  return (
    <div
      className="w-full max-w-xl bg-[#87838F] rounded-full p-1 flex items-center h-12"
      role="tablist"
      aria-label="Sendos transactions filter"
    >
      {options.map((opt) => {
        const isActive = value === opt.value;

        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={clsx(
              "flex-1 h-full rounded-full font-baloo-2 font-semibold text-[16px] transition-colors cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#87838F]",
              isActive
                ? "bg-white text-[#0E0420] shadow-sm"
                : "bg-transparent text-white hover:bg-white/10"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}


