/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchJson } from "@/lib/fetchJson";
import { TransactionCard } from "@/components/TransactionCard";

export default function TransactionsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const uid = user!.id;
    Promise.all([
      fetchJson(`/api/transactions?userId=${uid}`),
      fetchJson(`/api/categories?userId=${uid}`),
    ])
      .then(([txs, cats]) => {
        setTransactions(txs || []);
        setCategories(cats || []);
      })
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, user]);

  const createTransaction = async () => {
    if (!amount || !category) return;
    const uid = user!.id;
    const payload = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      amount: Number(amount),
      description: desc || "No description",
      date: Date.now(),
      userId: uid,
      type: "expense",
      category,
      categoryIcon: categories.find((c) => c.name === category)?.icon || "💸",
    };
    await fetchJson("/api/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setAmount("");
    setDesc("");
    setCategory("");
    const txs = await fetchJson(`/api/transactions?userId=${uid}`);
    setTransactions(txs);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6">
        <main className="mt-6">
          <h2 className="text-2xl font-semibold">Transactions</h2>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : transactions.length === 0 ? (
              <div className="p-6 rounded-xl bg-black/40 border border-white/6">
                <p className="mb-3">No transactions yet. Add one:</p>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  type="number"
                  className="mb-3 w-full rounded-lg bg-transparent border border-white/8 p-3"
                />
                <input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Description"
                  className="mb-3 w-full rounded-lg bg-transparent border border-white/8 p-3"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mb-3 w-full rounded-lg bg-black/60 border border-white/8 p-3">
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option
                      key={c._id}
                      value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={createTransaction}
                  className="w-full rounded-xl py-2 bg-gradient-to-r from-blue-500 to-purple-500">
                  Create
                </button>
              </div>
            ) : (
              <>
                {/* List */}
                {transactions.map((t) => (
                  <TransactionCard
                    key={t._id}
                    tx={t}
                  />
                ))}

                {/* Always available create form */}
                <div className="p-6 rounded-xl bg-black/40 border border-white/6 mt-6">
                  <h3 className="mb-3 font-semibold">Add Transaction</h3>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    type="number"
                    className="mb-3 w-full rounded-lg bg-transparent border border-white/8 p-3"
                  />
                  <input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Description"
                    className="mb-3 w-full rounded-lg bg-transparent border border-white/8 p-3"
                  />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mb-3 w-full rounded-lg bg-black/60 border border-white/8 p-3">
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option
                        key={c._id}
                        value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={createTransaction}
                    className="w-full rounded-xl py-2 bg-gradient-to-r from-blue-500 to-purple-500">
                    Add
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
