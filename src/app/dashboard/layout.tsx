export const dynamic = "force-dynamic";

import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <MobileNav />
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">{children}</main>
    </div>
  );
}

