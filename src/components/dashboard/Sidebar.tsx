"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/ui/Logo";
import { UserButton } from "@clerk/nextjs";

const routeConfig = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Active Operations", icon: Briefcase },
  { href: "/resume/builder", label: "Resume Studio", icon: FileText },
  { href: "/dashboard/report", label: "Market Intelligence", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  const routes = routeConfig.map((route) => ({
    ...route,
    icon: <route.icon className="h-5 w-5" />,
  }));

  return (
    <div className="flex h-full flex-col border-r bg-card text-card-foreground">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex-1 flex flex-col gap-1 px-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            {route.icon}
            {route.label}
          </Link>
        ))}
      </div>
      <div className="p-4 border-t border-border flex items-center justify-between">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
