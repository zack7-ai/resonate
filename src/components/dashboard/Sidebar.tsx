"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Mail, 
  MessageSquare,
  Target,
  LogOut,
  Settings,
  TrendingUp
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function Sidebar() {
  const pathname = usePathname();

  const operationsItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/dashboard/jobs",
      label: "Scout",
      icon: <Search className="h-5 w-5" />,
    },
    {
      href: "/dashboard/report",
      label: "Market Value",
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  const tacticalItems: NavItem[] = [
    {
      href: "/resume/builder",
      label: "Resume Builder",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/dashboard/cover-letter",
      label: "Cover Letter Gen",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      href: "/dashboard/interview-prep",
      label: "Interview Prep",
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];

  const strategyItems: NavItem[] = [
    {
      href: "/dashboard/90-day-plan",
      label: "90-Day Plan",
      icon: <LogOut className="h-5 w-5" />,
    },
    {
      href: "/dashboard/resignation-protocol",
      label: "Resignation Protocol",
      icon: <LogOut className="h-5 w-5" />,
    },
  ];

  const settingsItems: NavItem[] = [
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  const NavSection = ({ title, items }: { title: string; items: NavItem[] }) => (
    <div className="mb-8">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  item.badge === "Beta"
                    ? "bg-success/20 text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="hidden h-screen w-64 flex-col border-r border-border bg-card lg:flex">
      {/* Logo / Header */}
      <div className="border-b border-border p-6">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <NavSection title="Operations" items={operationsItems} />
        <NavSection title="Tactical" items={tacticalItems} />
        <NavSection title="Strategy" items={strategyItems} />
        <NavSection title="Account" items={settingsItems} />
      </div>

      {/* Footer Section */}
      <div className="border-t border-border p-4 space-y-3">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        
        {/* User Section */}
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Account</p>
            <p className="text-xs text-muted-foreground">Settings & Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}

