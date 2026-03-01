"use client";
import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/app/transaction/page";

interface TransactionCardProps {
  tx: Transaction;
  onDelete: (id: string) => void;
  onEdit: (tx: Transaction) => void;
}

export function TransactionCard({
  tx,
  onDelete,
  onEdit,
}: TransactionCardProps) {
  const isIncome = tx.type === "income";

  return (
    <div className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-all shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${isIncome ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}`}>
          {isIncome ? (
            <TrendingUp className="h-5 w-5" />
          ) : (
            <TrendingDown className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {tx.description}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Calendar className="h-3 w-3" />
            {tx.date ? new Date(tx.date).toLocaleDateString() : "Recent"}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p
          className={`text-base font-semibold mr-2 ${isIncome ? "text-emerald-500" : "text-foreground"}`}>
          {isIncome ? "+" : "-"}${tx.amount.toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(tx)}
          className="opacity-0 group-hover:opacity-100 h-8 w-8">
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(tx._id)}
          className="opacity-0 group-hover:opacity-100 text-destructive h-8 w-8">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
