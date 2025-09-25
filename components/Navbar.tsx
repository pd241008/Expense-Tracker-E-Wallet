"use client";
import React from "react";
import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";

export function Navbar() {
  const { user, isLoaded, isSignedIn } = useUser();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold">Expense Manager</h1>
        <nav className="hidden md:flex gap-3 text-sm text-gray-300">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/transaction">Transaction</Link>
          <Link href="/manage">Manage</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {isLoaded && isSignedIn ? (
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-300">{user?.firstName}</div>
            <SignOutButton />
          </div>
        ) : (
          <Link href="/">Sign in</Link>
        )}
      </div>
    </div>
  );
}
