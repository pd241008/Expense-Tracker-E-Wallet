"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { Category, Transaction, TransactionType } from "@/lib/types";

interface EditProps {
  transaction: Transaction | null;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedTx: Transaction) => Promise<void> | void;
}

export function EditTransactionDialog({
  transaction,
  categories,
  open,
  onOpenChange,
  onSave,
}: EditProps) {
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [type, setType] = React.useState<TransactionType>("expense");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (transaction && open) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setCategory(transaction.category ?? "");
      setType(transaction.type ?? "expense");
    }
  }, [transaction, open]);

  if (!transaction) return null;

  const parsedAmount = Number(amount);
  const canSave =
    amount.trim() !== "" && Number.isFinite(parsedAmount) && parsedAmount > 0;

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await onSave({
        ...transaction,
        amount: parsedAmount,
        description: description.trim() || "Untitled",
        category: category || transaction.category,
        categoryIcon:
          categories.find((c) => c.name === category)?.icon ??
          transaction.categoryIcon,
        type,
        updatedAt: Date.now(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
          <DialogDescription>
            Update the details and save your changes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
            {(["expense", "income"] as const).map((t) => {
              const active = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setType(t)}
                  className={`rounded-md py-1.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "income" ? "Income" : "Expense"}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="edit-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-desc" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={120}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c.name}>
                    <span className="flex items-center gap-2">
                      <CategoryIcon icon={c.icon} className="h-4 w-4" />
                      {c.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave || saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
