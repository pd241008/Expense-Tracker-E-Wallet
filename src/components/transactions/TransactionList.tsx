"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TransactionCard } from "@/components/TransactionCard";
import type { Transaction } from "@/lib/types";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (tx: Transaction) => void;
  onEdit: (tx: Transaction) => void;
}

/** Transaction rows with a delete confirmation on each row. */
export function TransactionList({
  transactions,
  onDelete,
  onEdit,
}: TransactionListProps) {
  const [pending, setPending] = React.useState<Transaction | null>(null);

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div key={tx._id} className="relative">
          <TransactionCard tx={tx} onEdit={onEdit} onDelete={() => setPending(tx)} />
        </div>
      ))}

      <AlertDialog
        open={!!pending}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <AlertDialogTrigger asChild>
          <span className="hidden" aria-hidden />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {pending?.description}
              </span>{" "}
              from your history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (pending) onDelete(pending);
                setPending(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
