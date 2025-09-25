"use client";
import React from "react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 p-6 hidden md:block bg-gradient-to-b from-black/40 to-transparent border-r border-white/6">
      <div className="mb-6">
        <div className="text-xs text-gray-400">App</div>
        <div className="text-xl font-semibold mt-1">Expense Manager</div>
      </div>
      <nav className="space-y-2">
        <Link
          className="block p-3 rounded-lg hover:bg-white/3"
          href="/dashboard">
          Dashboard
        </Link>
        <Link
          className="block p-3 rounded-lg hover:bg-white/3"
          href="/transaction">
          Transaction
        </Link>
        <Link
          className="block p-3 rounded-lg hover:bg-white/3"
          href="/manage">
          Manage
        </Link>
      </nav>

      <div className="mt-6 text-sm text-gray-400">Minimal • Fast • Secure</div>
    </aside>
  );
}
