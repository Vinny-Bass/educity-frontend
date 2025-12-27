"use client";

import { resetEnrollmentProgress } from "@/features/student/actions";
import { type User } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

const defaultTeacherMenuItems: SidebarItem[] = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: "/navbar_dashboard.svg" },
  { label: "Course", href: "/teacher/course", icon: "/navbar_course.svg" },
  { label: "Leaderboard", href: "/teacher/leaderboard", icon: "/navbar_leaderboard.svg" },
  { label: "Diagnostic Test", href: "/teacher/diagnostic-test", icon: "/navbar_diag_test.svg" },
  { label: "Sendos", href: "/teacher/sendos", icon: "/navbar_sendos.svg" },
  { label: "Team", href: "/teacher/team", icon: "/navbar_team.svg" },
];

interface SidebarProps {
  menuItems?: SidebarItem[];
  user?: User; // Make user optional for teacher sidebar
}

export function Sidebar({
  menuItems = defaultTeacherMenuItems,
  user,
}: SidebarProps) {
  const pathname = usePathname();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      setIsResetting(true);
      try {
        const result = await resetEnrollmentProgress();
        if (result.success) {
          alert("Progress reset successfully!");
          window.location.reload();
        } else {
          alert("Failed to reset progress.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred.");
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 lg:w-58 bg-white border-r border-gray-200 h-screen sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-8">
        <Image
          src="/cat.svg"
          alt="Flosendo"
          width={40}
          height={40}
          className="shrink-0"
        />
        <span className="font-baloo text-2xl font-normal text-brand-purple">
          Flosendo
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors ${
                    isActive
                      ? "bg-[#F3ECFF]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                    className={isActive ? "brightness-0 saturate-100" : ""}
                    style={
                      isActive
                        ? {
                            filter:
                              "invert(42%) sepia(85%) saturate(3027%) hue-rotate(246deg) brightness(97%) contrast(92%)",
                          }
                        : undefined
                    }
                  />
                  <span
                    className={`text-[14px] font-bold ${
                      isActive ? "text-[#9056F5]" : "text-gray-700"
                    }`}
                    style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}

          {/* Reset Demo Button */}
          <li>
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-[10px] transition-colors hover:bg-red-50 text-red-600"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                 {/* Simple Trash Icon or similar */}
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
              </div>
              <span
                className="text-[14px] font-bold"
                style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
              >
                {isResetting ? "Resetting..." : "Reset Demo"}
              </span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      {user && (
        <div className="px-4 py-4 mt-auto border-t border-gray-200">
          <Link
            href="/student/sendos"
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-gray-50"
          >
            <Image
              src="/profile-icon.svg" // Placeholder icon
              alt="Profile"
              width={24}
              height={24}
            />
            <span className="text-[14px] font-bold text-gray-700">
              {user.username}
            </span>
          </Link>
        </div>
      )}
    </aside>
  );
}

