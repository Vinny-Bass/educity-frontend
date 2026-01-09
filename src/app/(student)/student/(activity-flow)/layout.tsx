import { ActivityHeader } from "@/features/student/activity/components/ActivityHeader";
import { BottomBar } from "@/features/student/activity/components/BottomBar";

export default function ActivityFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      {/* Fixed header at the top */}
      <ActivityHeader />
      
      {/* Main content area (the page) - with top padding for fixed header */}
      <main className="flex-1 pb-32 pt-[72px]">{children}</main>

      {/* The persistent bottom bar for this flow */}
      <BottomBar />
    </div>
  );
}
