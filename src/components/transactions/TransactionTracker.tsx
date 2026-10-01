"use client";

import * as React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toDateKey } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

interface HeatmapValue {
  date: string;
  /** 0-4 intensity bucket */
  count: number;
  income: number;
  expense: number;
}

export function TransactionTracker({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const { values } = React.useMemo(() => {
    const daily = new Map<
      string,
      { income: number; expense: number; txCount: number }
    >();

    for (const t of transactions) {
      const key = toDateKey(new Date(t.date ?? Date.now()));
      const day = daily.get(key) ?? { income: 0, expense: 0, txCount: 0 };
      if (t.type === "income") day.income += t.amount;
      else day.expense += t.amount;
      day.txCount += 1;
      daily.set(key, day);
    }

    const values: HeatmapValue[] = Array.from(daily.entries()).map(
      ([date, d]) => ({
        date,
        income: d.income,
        expense: d.expense,
        count: 0,
      }),
    );

    const maxDaily = values.reduce((m, v) => Math.max(m, v.expense), 0);
    for (const v of values) {
      v.count =
        v.expense <= 0
          ? 1
          : v.expense >= maxDaily
            ? 4
            : Math.min(4, 1 + Math.floor((v.expense / maxDaily) * 4));
    }

    return { values };
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly activity</CardTitle>
        <CardDescription>
          Daily spending intensity over the last 12 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {values.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No activity to show yet — record a transaction to see your year
            take shape.
          </p>
        ) : (
          <>
            <div className="heatmap-shell overflow-x-auto pb-1">
              <CalendarHeatmap
                startDate={
                  new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                }
                endDate={new Date()}
                values={values}
                showWeekdayLabels
                showMonthLabels
                classForValue={(value) => {
                  if (!value) return "hm-empty";
                  if (value.income > value.expense) return "hm-income";
                  return `hm-expense-${value.count}`;
                }}
                titleForValue={(value) => {
                  if (!value) return "No activity";
                  const parts = [`Spent: $${value.expense.toFixed(2)}`];
                  if (value.income > 0)
                    parts.push(`Earned: $${value.income.toFixed(2)}`);
                  return parts.join(" · ");
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
              <span>Less</span>
              <span className="hm-swatch hm-empty" />
              <span className="hm-swatch hm-expense-1" />
              <span className="hm-swatch hm-expense-2" />
              <span className="hm-swatch hm-expense-3" />
              <span className="hm-swatch hm-expense-4" />
              <span>More</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
