"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { Transaction } from "@/lib/types";
import { cn, formatCurrency, formatRelativeDay } from "@/lib/utils";

interface TransactionCardProps {
  tx: Transaction;
  onDelete?: (tx: Transaction) => void;
  onEdit?: (tx: Transaction) => void;
  compact?: boolean;
}

export function TransactionCard({
  tx,
  onDelete,
  onEdit,
  compact = false,
}: TransactionCardProps) {
  const isIncome = tx.type === "income";

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-accent/40",
        compact && "p-2.5",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
          isIncome
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
            : "border-red-500/20 bg-red-500/10 text-red-500",
        )}
      >
        <CategoryIcon icon={tx.categoryIcon} className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{tx.description}</p>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{formatRelativeDay(tx.date)}</span>
          {tx.category && (
            <>
              <span aria-hidden>·</span>
              <span className="truncate">{tx.category}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            isIncome ? "text-emerald-500" : "text-foreground",
          )}
        >
          {isIncome ? "+" : "−"}
          {formatCurrency(tx.amount)}
        </span>

        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit ${tx.description}`}
            className="h-8 w-8 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
            onClick={() => onEdit(tx)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${tx.description}`}
            className="h-8 w-8 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 hover:text-destructive"
            onClick={() => onDelete(tx)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
