"use client";

import * as React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function Select({ children, className = "", ...props }: SelectProps) {
  return (
    <select
      className={`
        h-9 px-3 py-1.5
        bg-white border border-gray-300 rounded-lg
        text-[13px] font-bold text-[#87838F]
        appearance-none
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-[#9056F5] focus:border-transparent
        transition-all
        ${className}
      `}
      style={{
        fontFamily: "ABC Diatype Unlicensed Trial, sans-serif",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239056F5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        paddingRight: "32px",
        color: "#87838F",
      }}
      {...props}
    >
      {children}
    </select>
  );
}

