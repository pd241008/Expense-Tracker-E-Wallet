"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchJson } from "../../lib/fetchJson";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ReceiptText,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import defaultCategoriesData from "@/data/defaultCategories.json";
import { TransactionTracker } from "@/components/transactions/TransactionTracker";
import { EditTransactionDialog } from "@/components/transactions/EditTransactionDialog";
import { TransactionCard } from "@/components/TransactionCard";

export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date?: number;
  userId?: string;
  type?: "income" | "expense";
  category?: string;
  categoryIcon?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  type?: string;
}

const DEFAULT_CATEGORIES = defaultCategoriesData as Category[];

export default function TransactionsPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form State
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const fetchData = useCallback(
    async (uid: string) => {
      setLoading(true);
      try {
        const [txs, cats] = await Promise.all([
          fetchJson(`/api/transactions?userId=${uid}`),
          fetchJson(`/api/categories?userId=${uid}`),
        ]);

        const sortedTxs = (txs || []).sort(
          (a: Transaction, b: Transaction) => (b.date || 0) - (a.date || 0),
        );
        setTransactions(sortedTxs);

        const combinedCategories = [...DEFAULT_CATEGORIES, ...(cats || [])];
        setCategories(combinedCategories);

        if (combinedCategories.length > 0 && !category) {
          setCategory(combinedCategories[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [category],
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    fetchData(user.id);
  }, [isLoaded, isSignedIn, user, fetchData]);

  const createTransaction = async () => {
    if (!amount || !category) return;
    const uid = user!.id;
    const tempId = crypto.randomUUID();

    const payload: Transaction = {
      _id: tempId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      amount: Number(amount),
      description: desc || "No description",
      date: Date.now(),
      userId: uid,
      type,
      category,
    };

    setTransactions((prev) => [payload, ...prev]);
    setAmount("");
    setDesc("");

    await fetchJson("/api/transactions", {
      method: "POST",
      body: JSON.stringify({ ...payload, id: tempId }),
    });

    await fetchData(uid);
  };

  const saveEdit = async (updatedTx: Transaction) => {
    await fetchJson("/api/transactions", {
      method: "PUT",
      body: JSON.stringify(updatedTx),
    });
    setIsEditOpen(false);
    if (user) fetchData(user.id);
  };

  const deleteTransaction = async (txId: string) => {
    if (!user) return;
    setTransactions((prev) => prev.filter((t) => t._id !== txId));
    try {
      const response = await fetchJson(`/api/transactions`, {
        method: "DELETE",
        body: JSON.stringify({ transactionId: txId }),
      });
      if (response?.error) await fetchData(user.id);
    } catch {
      await fetchData(user.id);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-tight text-foreground">
          Transactions
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="border-border bg-card shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Record Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Type Toggle */}
              <div className="flex p-1 bg-secondary rounded-lg">
                <button
                  onClick={() => setType("expense")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                    type === "expense"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}>
                  <TrendingDown className="h-4 w-4" /> Expense
                </button>
                <button
                  onClick={() => setType("income")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                    type === "income"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}>
                  <TrendingUp className="h-4 w-4" /> Income
                </button>
              </div>

              <div className="space-y-4">
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (e.g., 49.99)"
                  type="number"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
                />
                <input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Description"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 appearance-none transition-all">
                  <option
                    value=""
                    disabled
                    className="text-muted-foreground">
                    Select Category
                  </option>
                  {categories.map((c) => (
                    <option
                      key={c._id}
                      value={c.name}
                      className="text-foreground">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={createTransaction}
                disabled={!amount || !category}
                className={`w-full h-11 gap-2 ${
                  type === "income"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : ""
                }`}>
                <Plus className="h-4 w-4" />
                Save {type === "income" ? "Income" : "Expense"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card className="border-border bg-card shadow-sm h-full min-h-[400px]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-background/50">
                  <ReceiptText className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-sm font-medium text-foreground">
                    No transactions found
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use the form to record your first activity.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3">
                  {transactions.map((t) => (
                    <TransactionCard
                      key={t._id}
                      tx={t}
                      onDelete={deleteTransaction}
                      onEdit={(tx) => {
                        setEditingTx(tx);
                        setIsEditOpen(true);
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Financial Activity Monitor — full width below */}
      <TransactionTracker transactions={transactions} />

      <EditTransactionDialog
        open={isEditOpen}
        transaction={editingTx}
        onOpenChange={setIsEditOpen}
        onSave={saveEdit}
      />
    </div>
  );
}
