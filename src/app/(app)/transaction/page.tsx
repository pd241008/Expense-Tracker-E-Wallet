"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { fetchJson } from "@/lib/fetchJson";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionTracker } from "@/components/transactions/TransactionTracker";
import { EditTransactionDialog } from "@/components/transactions/EditTransactionDialog";
import { CategoryIcon } from "@/components/CategoryIcon";
import defaultCategoriesData from "@/data/defaultCategories.json";
import type { Category, Transaction, TransactionType } from "@/lib/types";
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  ReceiptText,
} from "lucide-react";

const DEFAULT_CATEGORIES = defaultCategoriesData as Category[];

type LoadState = "loading" | "ready" | "error";

export default function TransactionsPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [state, setState] = React.useState<LoadState>("loading");
  const [saving, setSaving] = React.useState(false);
  const [editingTx, setEditingTx] = React.useState<Transaction | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  // Form state
  const [amount, setAmount] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [type, setType] = React.useState<TransactionType>("expense");

  const load = React.useCallback(async (uid: string) => {
    setState("loading");
    try {
      const [txs, cats] = await Promise.all([
        fetchJson<Transaction[]>(`/api/transactions?userId=${uid}`),
        fetchJson<Category[]>(`/api/categories?userId=${uid}`),
      ]);
      setTransactions(
        (Array.isArray(txs) ? txs : []).sort((a, b) => (b.date ?? 0) - (a.date ?? 0)),
      );
      setCategories(Array.isArray(cats) ? cats : []);
      setState("ready");
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setState("error");
    }
  }, []);

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    load(user.id);
  }, [isLoaded, isSignedIn, user, load]);

  const allCategories = React.useMemo(
    () => [...DEFAULT_CATEGORIES, ...categories],
    [categories],
  );

  React.useEffect(() => {
    if (!category && allCategories.length > 0) {
      setCategory(allCategories[0].name);
    }
  }, [allCategories, category]);

  const amountNumber = Number(amount);
  const canSave =
    amount.trim() !== "" &&
    Number.isFinite(amountNumber) &&
    amountNumber > 0 &&
    !!category &&
    !saving;

  const createTransaction = async () => {
    if (!canSave || !user) return;
    const parsedAmount = Number(amount);
    const optimistic: Transaction = {
      _id: `temp-${crypto.randomUUID()}`,
      amount: parsedAmount,
      description: desc.trim() || "Untitled",
      date: Date.now(),
      userId: user.id,
      type,
      category,
      categoryIcon: allCategories.find((c) => c.name === category)?.icon,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setSaving(true);
    setTransactions((prev) => [optimistic, ...prev]);
    const prevAmount = amount;
    const prevDesc = desc;
    setAmount("");
    setDesc("");

    try {
      await fetchJson("/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          amount: parsedAmount,
          description: optimistic.description,
          date: optimistic.date,
          type,
          category,
          categoryIcon: optimistic.categoryIcon,
        }),
      });
      await load(user.id);
      toast.success(
        `${type === "income" ? "Income" : "Expense"} of $${parsedAmount.toFixed(2)} recorded`,
      );
    } catch (err) {
      console.error("Failed to create transaction:", err);
      // Roll back the optimistic row and restore the form
      setTransactions((prev) => prev.filter((t) => t._id !== optimistic._id));
      setAmount(prevAmount);
      setDesc(prevDesc);
      toast.error("Couldn't save the transaction. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (updatedTx: Transaction) => {
    if (!user) return;
    try {
      await fetchJson("/api/transactions", {
        method: "PUT",
        body: JSON.stringify(updatedTx),
      });
      setIsEditOpen(false);
      setEditingTx(null);
      await load(user.id);
      toast.success("Transaction updated");
    } catch (err) {
      console.error("Failed to update transaction:", err);
      toast.error("Couldn't update the transaction. Please try again.");
    }
  };

  const deleteTransaction = async (tx: Transaction) => {
    if (!user) return;
    const prev = transactions;
    setTransactions((cur) => cur.filter((t) => t._id !== tx._id));
    try {
      await fetchJson("/api/transactions", {
        method: "DELETE",
        body: JSON.stringify({ transactionId: tx._id }),
      });
      toast.success("Transaction deleted");
    } catch {
      setTransactions(prev);
      toast.error("Couldn't delete the transaction. Please try again.");
    }
  };

  const grouped = React.useMemo(() => {
    const groups = new Map<string, Transaction[]>();
    for (const t of transactions) {
      const d = new Date(t.date ?? 0);
      const key = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const bucket = groups.get(key);
      if (bucket) bucket.push(t);
      else groups.set(key, [t]);
    }
    return Array.from(groups.entries());
  }, [transactions]);

  if (!isLoaded || state === "loading") {
    return (
      <div>
        <PageHeader
          title="Transactions"
          description="Record and review your activity."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:order-2 lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-5 w-36" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card className="lg:order-1">
            <CardHeader>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
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
        <PageHeader title="Transactions" />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <p className="font-medium">Couldn&apos;t load your transactions</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Something went wrong. Check your connection and try again.
            </p>
            <Button variant="outline" onClick={() => load(user!.id)}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-16 md:pb-0">
      <PageHeader
        title="Transactions"
        description="Record and review your activity."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* List */}
        <div className="order-2 lg:order-1 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>
                {transactions.length}{" "}
                {transactions.length === 1 ? "transaction" : "transactions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-14 text-center">
                  <ReceiptText className="mb-3 h-9 w-9 text-muted-foreground/50" />
                  <p className="text-sm font-medium">No transactions yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use the form to record your first one.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {grouped.map(([dayLabel, items]) => (
                    <section key={dayLabel}>
                      <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {dayLabel}
                      </h3>
                      <TransactionList
                        transactions={items}
                        onDelete={deleteTransaction}
                        onEdit={(tx) => {
                          setEditingTx(tx);
                          setIsEditOpen(true);
                        }}
                      />
                    </section>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <div className="order-1 lg:order-2">
          <Card className="lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle>New transaction</CardTitle>
              <CardDescription>Amounts are recorded in USD.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type toggle */}
              <div
                role="radiogroup"
                aria-label="Transaction type"
                className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
              >
                {(["expense", "income"] as const).map((t) => {
                  const active = type === t;
                  const Icon = t === "income" ? ArrowUpRight : ArrowDownRight;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setType(t)}
                      className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-all ${
                        active
                          ? "bg-background shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          t === "income" ? "text-emerald-500" : "text-red-500"
                        }`}
                      />
                      {t === "income" ? "Income" : "Expense"}
                    </button>
                  );
                })}
              </div>

              <div>
                <label
                  htmlFor="tx-amount"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Amount
                </label>
                <Input
                  id="tx-amount"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  placeholder="0.00"
                  inputMode="decimal"
                  autoComplete="off"
                />
              </div>

              <div>
                <label
                  htmlFor="tx-desc"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Description{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <Input
                  id="tx-desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g., Weekly groceries"
                  maxLength={120}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((c) => (
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

              <Button
                className="w-full"
                onClick={createTransaction}
                disabled={!canSave}
              >
                <Plus className="h-4 w-4" />
                {saving ? "Saving…" : `Add ${type}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Yearly heatmap */}
      <div className="mt-6">
        <TransactionTracker transactions={transactions} />
      </div>

      <EditTransactionDialog
        open={isEditOpen}
        transaction={editingTx}
        categories={allCategories}
        onOpenChange={setIsEditOpen}
        onSave={saveEdit}
      />
    </div>
  );
}
