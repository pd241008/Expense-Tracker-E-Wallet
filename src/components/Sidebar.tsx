"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Settings2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transaction", icon: ArrowLeftRight },
  { name: "Categories", href: "/manage", icon: Settings2 },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside
      data-collapsed={isCollapsed}
      className={cn(
        "relative hidden shrink-0 flex-col border-r bg-sidebar transition-[width] duration-200 ease-in-out md:flex",
        isCollapsed ? "w-[68px]" : "w-60",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-4 top-4 z-10 h-7 w-7 rounded-full border bg-background shadow-sm"
        onClick={() => setIsCollapsed((v) => !v)}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-3.5 w-3.5" />
        ) : (
          <PanelLeftClose className="h-3.5 w-3.5" />
        )}
      </Button>

      <nav className="flex-1 space-y-1 overflow-hidden px-3 py-4">
        {!isCollapsed && (
          <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Menu
          </p>
        )}
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          const link = (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center px-0",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
            </Link>
          );

          return isCollapsed ? (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          ) : (
            link
          );
        })}
      </nav>

      <div className="border-t px-4 py-3">
        <p
          className={cn(
            "text-[11px] text-muted-foreground",
            isCollapsed ? "text-center" : "text-left",
          )}
        >
          {isCollapsed ? "v1.0" : "Spendly · v1.0"}
        </p>
      </div>
    </aside>
  );
}

// Re-export for the mobile nav to keep nav items in one place.
export { NAV_ITEMS };
