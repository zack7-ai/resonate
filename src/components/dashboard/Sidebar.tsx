"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Briefcase,
  TrendingUp,
  CreditCard,
  Search,
  Mail,
  MessageSquare,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/ui/Logo";
import { UserButton } from "@clerk/nextjs";

const routes = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: "/dashboard/jobs",
    label: "Active Operations",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    href: "/resume/builder",
    label: "Resume Studio",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    href: "/dashboard/report",
    label: "Market Intelligence",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

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
