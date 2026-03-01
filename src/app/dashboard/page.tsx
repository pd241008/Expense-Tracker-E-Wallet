"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchJson } from "../../lib/fetchJson";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Plus,
  Tags,
  Lightbulb,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Transaction } from "../transaction/page"; // Import the type we made

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [summary, setSummary] = useState<{
    income: number;
    expense: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const uid = user!.id;
    const currentYear = new Date().getFullYear();

    // FIXED: Fetching from the actual transactions table instead of the broken yearhistory table
    fetchJson(`/api/transactions?userId=${uid}`)
      .then((txs: Transaction[]) => {
        // Filter transactions strictly for the current year
        const yearTxs = (txs || []).filter((t) => {
          if (!t.date) return false;
          return new Date(t.date).getFullYear() === currentYear;
        });

        // Calculate totals accurately based on type
        const totals = yearTxs.reduce(
          (acc, r) => {
            if (r.type === "income") acc.income += r.amount;
            else acc.expense += r.amount;
            return acc;
          },
          { income: 0, expense: 0 },
        );

        setSummary(totals);
      })
      .catch((err) => {
        console.error("Dashboard calculation error:", err);
        setSummary({ income: 0, expense: 0 });
      })
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, user]);

  const netBalance = (summary?.income ?? 0) - (summary?.expense ?? 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </motion.h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Metric 1: Net Balance */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Balance (This Year)
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mt-1" />
              ) : (
                <div
                  className={`text-2xl font-bold ${netBalance >= 0 ? "text-primary" : "text-destructive"}`}>
                  $
                  {netBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Metric 2: Income */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mt-1" />
              ) : (
                <div className="text-2xl font-bold text-foreground">
                  $
                  {(summary?.income ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Metric 3: Expense */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expense
              </CardTitle>
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mt-1" />
              ) : (
                <div className="text-2xl font-bold text-foreground">
                  $
                  {(summary?.expense ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div
          variants={itemVariants}
          className="col-span-4">
          <Card className="h-full min-h-[300px] flex items-center justify-center border-border bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">
              Financial Activity Chart (Coming Soon)
            </p>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="col-span-3 space-y-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link
                href="/transaction"
                passHref>
                <Button
                  className="w-full justify-start gap-2"
                  variant="default">
                  <Plus className="h-4 w-4" />
                  Add New Transaction
                </Button>
              </Link>
              <Link
                href="/manage"
                passHref>
                <Button
                  className="w-full justify-start gap-2"
                  variant="outline">
                  <Tags className="h-4 w-4" />
                  Manage Categories
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Categorize every expense for accurate analysis.
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Set up recurring transactions for bills.
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Review your dashboard weekly.
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
