"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/transaction", icon: Receipt },
    { name: "Manage", href: "/manage", icon: Settings2 },
  ];

  return (
    <aside
      className={cn(
        "relative hidden flex-col border-r border-border bg-card md:flex transition-all duration-300 min-h-[calc(100vh-3.5rem)]",
        isCollapsed ? "w-20" : "w-64",
      )}>
      {/* Collapse Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-6 z-10 h-8 w-8 rounded-full border-border bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="flex-1 px-3 py-6 space-y-2 overflow-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors group",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                isCollapsed ? "justify-center" : "gap-3",
              )}
              title={isCollapsed ? item.name : undefined}>
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && (
                <span className="truncate transition-opacity duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {!isCollapsed && (
        <div className="p-4 border-t border-border whitespace-nowrap overflow-hidden">
          <p className="text-xs text-muted-foreground text-center">
            Minimal • Fast • Secure
          </p>
        </div>
      )}
    </aside>
  );
}
