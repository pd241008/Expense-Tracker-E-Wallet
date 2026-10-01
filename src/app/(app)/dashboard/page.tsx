"use client";

import * as React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { fetchJson } from "@/lib/fetchJson";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/PageHeader";
import { TransactionCard } from "@/components/TransactionCard";
import {
  Wallet,
  Plus,
  Settings2,
  ArrowUpRight,
  ArrowDownRight,
  ReceiptText,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ChartDataItem {
  name: string;
  value: number;
}

type LoadState = "loading" | "ready" | "error";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [summary, setSummary] = React.useState<{
    income: number;
    expense: number;
  }>({ income: 0, expense: 0 });
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [recent, setRecent] = React.useState<Transaction[]>([]);
  const [state, setState] = React.useState<LoadState>("loading");

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    let cancelled = false;
    setState("loading");

    fetchJson<Transaction[]>(`/api/transactions?userId=${user.id}`)
      .then((txs) => {
        if (cancelled) return;
        const list = Array.isArray(txs) ? txs : [];

        const currentYear = new Date().getFullYear();
        const yearTxs = list.filter(
          (t) => t.date && new Date(t.date).getFullYear() === currentYear,
        );

        const totals = yearTxs.reduce(
          (acc, t) => {
            if (t.type === "income") acc.income += t.amount;
            else acc.expense += t.amount;
            return acc;
          },
          { income: 0, expense: 0 },
        );
        setSummary(totals);

        const catMap: Record<string, number> = {};
        yearTxs
          .filter((t) => t.type === "expense")
          .forEach((t) => {
            const cat = t.category || "Other";
            catMap[cat] = (catMap[cat] || 0) + t.amount;
          });
        setChartData(
          Object.entries(catMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value),
        );

        setRecent(list.slice(0, 5));
        setState("ready");
      })
      .catch((err) => {
        console.error("Failed to load dashboard:", err);
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || state === "loading") {
    return (
      <div>
        <PageHeader title="Dashboard" description="Your money this year." />
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[280px] w-full" />
            </CardContent>
          </Card>
          <Card className="md:col-span-3">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <p className="font-medium">Couldn&apos;t load your dashboard</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Something went wrong talking to the server. Check your connection
              and try again.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
       </CardContent>
        </Card>
      </div>
    );
  }

  const net = summary.income - summary.expense;

  const stats = [
    {
      label: "Net balance (YTD)",
      value: formatCurrency(net),
      positive: net >= 0,
      icon: Wallet,
    },
    {
      label: "Income (YTD)",
      value: formatCurrency(summary.income),
      positive: true,
      icon: ArrowUpRight,
    },
    {
      label: "Expenses (YTD)",
      value: formatCurrency(summary.expense),
      positive: false,
      icon: ArrowDownRight,
    },
  ];

  return (
    <div className="pb-20 md:pb-0">
      <PageHeader
        title="Dashboard"
        description="Your money this year."
      >
        <Button asChild size="sm">
          <Link href="/transaction">
            <Plus className="h-4 w-4" /> New transaction
          </Link>
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                  {s.label}
                  <Icon
                    className={
                      s.label.startsWith("Income")
                        ? "h-4 w-4 text-emerald-500"
                        : s.label.startsWith("Expenses")
                          ? "h-4 w-4 text-red-500"
                          : "h-4 w-4 text-muted-foreground"
                    }
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-2xl font-semibold tabular-nums ${
                    s.label.startsWith("Income")
                      ? "text-emerald-500"
                      : s.label.startsWith("Expenses")
                        ? "text-red-500"
                        : "text-foreground"
                  }`}
                >
                  {s.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts + activity */}
      <div className="mt-4 grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Expenses by category</CardTitle>
            <CardDescription>
              Current year · {chartData.length || "no"} categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center">
                <ReceiptText className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-medium">No expenses yet</p>
                <p className="text-sm text-muted-foreground">
                  Record your first expense to see the breakdown.
                </p>
              </div>
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="62%"
                      outerRadius="85%"
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-xs text-muted-foreground">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center">
                <ReceiptText className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-medium">Nothing here yet</p>
                <p className="text-sm text-muted-foreground">
                  Add a transaction to get started.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {recent.map((t) => (
                    <TransactionCard key={t._id} tx={t} compact />
                  ))}
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="mt-3 w-full text-muted-foreground"
                >
                  <Link href="/transaction">View all transactions</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/transaction">
              <Plus className="h-4 w-4" /> New transaction
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/manage">
              <Settings2 className="h-4 w-4" /> Manage categories
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
