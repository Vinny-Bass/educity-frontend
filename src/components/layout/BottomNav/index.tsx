"use client";

import { type User } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarItem } from "../Sidebar";

interface BottomNavProps {
  user?: User;
  menuItems?: SidebarItem[];
}

export const BottomNav = ({ user, menuItems = [] }: BottomNavProps) => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] shadow-[0_-4px_20px_rgba(14,4,32,0.1)] z-50">
      <div className="flex items-center justify-around px-4 py-3 max-w-2xl mx-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 p-2 transition-opacity ${
                isActive ? "opacity-100" : "opacity-50 hover:opacity-75"
              }`}
              aria-label={item.label}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
