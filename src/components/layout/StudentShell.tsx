"use client";

import { type User } from "@/types/user";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { BottomNav } from "./BottomNav";
import { Sidebar, type SidebarItem } from "./Sidebar";

interface StudentShellProps {
  menuItems: SidebarItem[];
  children: ReactNode;
  user: User;
}

const shouldHideNavigation = (pathname: string | null): boolean => {
  if (!pathname) {
    return false;
  }

  const isActivityFlow =
    pathname.startsWith("/student/chapter/") && pathname.includes("/activity/");

  const legacyActivityPath = pathname.startsWith("/student/activity");

  return isActivityFlow || legacyActivityPath;
};

export function StudentShell({
  menuItems,
  children,
  user,
}: StudentShellProps) {
  const pathname = usePathname();

  const hideNavigation = shouldHideNavigation(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      {!hideNavigation && (
        <div className="hidden md:block">
          <Sidebar menuItems={menuItems} user={user} />
        </div>
      )}

      <main className="flex-1 pb-20 md:ml-0 md:pb-0">{children}</main>

      {!hideNavigation && (
        <div className="md:hidden">
          <BottomNav user={user} menuItems={menuItems} />
        </div>
      )}
    </div>
  );
}


