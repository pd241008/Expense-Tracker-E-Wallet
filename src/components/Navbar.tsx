"use client";
import React from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/toggle-theme";

export function Navbar() {
  const { isLoaded, isSignedIn } = useUser();
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <Link
            href="/"
            className="text-md font-bold tracking-wide text-foreground">
            EXPENSEMGR
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isLoaded && isSignedIn ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                // Automatically matches Clerk's modal to your dark/light theme
                baseTheme: theme === "dark" ? dark : undefined,
                elements: {
                  avatarBox: "w-9 h-9 border border-border",
                },
              }}
            />
          ) : (
            <Link href="/">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
