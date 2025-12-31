"use client";

import * as React from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  size?: "sm" | "figma";
}

export function SearchInput({
  onSearch,
  className = "",
  size = "sm",
  ...props
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const inputSizeClasses =
    size === "figma"
      ? // Figma export: h=50, border=2, radius=10, font 16 medium-ish, padding 24
        "h-[50px] pl-6 pr-12 py-3 border-2 rounded-[10px] text-[16px] font-medium"
      : "h-9 pl-10 pr-3 py-1.5 border rounded-lg text-[13px] font-normal";

  return (
    <div className="relative">
      <input
        type="text"
        className={`
          ${inputSizeClasses}
          w-full
          bg-white border-gray-300
          text-[#87838F]
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-[#9056F5] focus:border-transparent
          transition-all
          ${className}
        `}
        style={{ fontFamily: "var(--font-abc-diatype), sans-serif", color: "#87838F" }}
        {...props}
        onChange={handleChange}
      />
      <div
        className={
          size === "figma"
            ? "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            : "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        }
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="7"
            cy="7"
            r="5"
            stroke="#9056F5"
            strokeWidth="2"
          />
          <path
            d="M11 11L14 14"
            stroke="#9056F5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

