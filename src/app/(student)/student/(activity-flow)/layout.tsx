import { BottomBar } from "@/features/student/activity/components/BottomBar";

export default function ActivityFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      {/* Main content area (the page) */}
      <main className="flex-1 pb-32">{children}</main>

      {/* The persistent bottom bar for this flow */}
      <BottomBar />
    </div>
  );
}
