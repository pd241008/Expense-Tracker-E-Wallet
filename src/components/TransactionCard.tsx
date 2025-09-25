"use client";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TransactionCard({ tx }: { tx: any }) {
  const date = new Date(tx.date || tx.createdAt || Date.now());
  return (
    <div className="p-4 rounded-xl bg-black/40 border border-white/6 flex justify-between items-center">
      <div>
        <div className="font-medium">{tx.description}</div>
        <div className="text-sm text-gray-400">{date.toLocaleDateString()}</div>
      </div>
      <div
        className={`font-semibold ${tx.type === "expense" ? "text-red-400" : "text-green-400"}`}>
        {tx.amount}
      </div>
    </div>
  );
}
