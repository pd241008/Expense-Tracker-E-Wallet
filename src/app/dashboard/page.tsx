"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchJson } from "../../lib/fetchJson";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Plus,
  Tags,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Transaction } from "../transaction/page";

interface ChartDataItem {
  name: string;
  value: number;
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [summary, setSummary] = useState<{
    income: number;
    expense: number;
  } | null>(null);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    fetchJson(`/api/transactions?userId=${user.id}`)
      .then((txs: Transaction[]) => {
        const currentYear = new Date().getFullYear();
        const yearTxs = (txs || []).filter(
          (t) => t.date && new Date(t.date).getFullYear() === currentYear,
        );

        const totals = yearTxs.reduce(
          (acc, r) => {
            if (r.type === "income") acc.income += r.amount;
            else acc.expense += r.amount;
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
          Object.entries(catMap).map(([name, value]) => ({ name, value })),
        );
      })
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, user]);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (!isLoaded || loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((summary?.income || 0) - (summary?.expense || 0)).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              +${summary?.income.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expense
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              -${summary?.expense.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value">
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href="/transaction"
              className="block">
              <Button className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" /> New Transaction
              </Button>
            </Link>
            <Link
              href="/manage"
              className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-2">
                <Tags className="h-4 w-4" /> Categories
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
