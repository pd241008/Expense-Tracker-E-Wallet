/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchJson } from "@/lib/fetchJson";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [summary, setSummary] = useState<{
    income: number;
    expense: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;

    const uid = user!.id;
    fetchJson(`/api/yearhistory?userId=${uid}&year=${new Date().getFullYear()}`)
      .then((data) => {
        // reduce to totals
        const totals = data.reduce(
          (acc: { income: number; expense: number }, r: any) => {
            acc.income += r.income || 0;
            acc.expense += r.expense || 0;
            return acc;
          },
          { income: 0, expense: 0 }
        );
        setSummary(totals);
      })
      .catch(() => setSummary({ income: 0, expense: 0 }))
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6">
        <main className="mt-6">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-semibold">
            Dashboard
          </motion.h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-black/50 border border-white/6 shadow-lg">
              <h3 className="text-sm text-gray-300">This Month</h3>
              {loading ? (
                <p className="mt-4">Loading...</p>
              ) : (
                <div className="mt-4">
                  <p className="text-3xl font-bold">{summary?.income ?? 0}</p>
                  <p className="text-red-400">
                    Expense: {summary?.expense ?? 0}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-black/50 border border-white/6 shadow-lg">
              <h3 className="text-sm text-gray-300">Quick Actions</h3>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={() => (location.href = "/transaction")}
                  className="w-full rounded-xl py-2 bg-gradient-to-r from-blue-500 to-purple-500 font-semibold">
                  Add Transaction
                </button>

                <button
                  onClick={() => (location.href = "/manage")}
                  className="w-full rounded-xl py-2 border border-white/10">
                  Manage Categories
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/50 border border-white/6 shadow-lg">
              <h3 className="text-sm text-gray-300">Tips</h3>
              <ul className="mt-3 text-gray-300 list-inside list-disc">
                <li>Keep categories simple (3-8 categories).</li>
                <li>Use recurring transactions for salary / rent.</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
