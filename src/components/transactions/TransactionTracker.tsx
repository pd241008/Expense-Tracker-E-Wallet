"use client";
import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Card, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/app/transaction/page";

interface HeatmapValue {
  date: string;
  count: number;
  type: "income" | "expense" | "neutral";
}

export function TransactionTracker({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const dailyStats = transactions.reduce(
    (acc: Record<string, { income: number; expense: number }>, t) => {
      const date = new Date(t.date || Date.now()).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = { income: 0, expense: 0 };

      if (t.type === "income") acc[date].income += t.amount;
      else acc[date].expense += t.amount;

      return acc;
    },
    {},
  );

  const heatmapValues: HeatmapValue[] = Object.entries(dailyStats).map(
    ([date, stats]) => ({
      date,
      count: 1,
      type:
        stats.income > stats.expense
          ? "income"
          : stats.expense > stats.income
            ? "expense"
            : "neutral",
    }),
  );

  return (
    <Card className="p-6 border-border bg-card shadow-sm">
      <CardTitle className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-widest">
        Financial Activity Monitor
      </CardTitle>
      <div className="h-32 transaction-heatmap">
        <CalendarHeatmap
          startDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
          endDate={new Date()}
          values={heatmapValues}
          classForValue={(value) => {
            const heatmapValue = value as HeatmapValue | undefined;
            if (!heatmapValue) return "fill-secondary opacity-10";
            if (heatmapValue.type === "income")
              return "fill-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]";
            if (heatmapValue.type === "expense")
              return "fill-destructive opacity-80";
            return "fill-primary";
          }}
        />
      </div>
    </Card>
  );
}
