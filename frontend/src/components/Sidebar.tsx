"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Cpu,
  Compass as CompassIcon,
  Map,
  FileText,
  BookOpen,
  Briefcase,
  Sparkles,
  Share2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Digital Twin", href: "/dashboard/digital-twin", icon: Cpu },
  { label: "Career Advisor", href: "/dashboard/career-advisor", icon: CompassIcon },
  { label: "Learning Roadmap", href: "/dashboard/roadmap", icon: Map },
  { label: "CV Analyzer", href: "/dashboard/cv-analyzer", icon: FileText },
  { label: "Lecture Intelligence", href: "/dashboard/lectures", icon: BookOpen },
  { label: "Opportunities", href: "/dashboard/opportunities", icon: Briefcase },
  { label: "Future Simulator", href: "/dashboard/simulator", icon: Sparkles },
  { label: "Portfolio Builder", href: "/dashboard/portfolio", icon: Share2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-white transition-all duration-300 select-none z-30",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="text-base font-bold text-navy">FuturePath</span>
              <span className="text-base font-light text-primary ml-0.5">AI</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Compass className="h-4 w-4" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-muted hover:text-navy hover:bg-[#F1F5F9] transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-light text-primary font-semibold"
                  : "text-muted hover:text-navy hover:bg-[#F8FAFC]",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-primary" : "text-muted")} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-border p-3">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#EDF3FF] border border-[#CBD5E1] flex items-center justify-center text-primary font-semibold text-xs flex-shrink-0">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-navy truncate">{user?.full_name || "Student"}</p>
                <p className="text-[11px] text-muted truncate">{user?.email || "student@futurepath.edu"}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-muted hover:text-error hover:bg-error-light rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            title="Sign Out"
            className="w-full flex justify-center p-2 text-muted hover:text-error hover:bg-error-light rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
