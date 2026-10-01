import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ---------------- CREATE ----------------
export const createTransaction = mutation({
  args: {
    amount: v.number(),
    description: v.string(),
    date: v.number(),
    userId: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    categoryIcon: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("transaction", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ---------------- READ MANY ----------------
export const listTransactions = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("transaction")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// ---------------- UPDATE ----------------
export const updateTransaction = mutation({
  args: {
    transactionId: v.id("transaction"),
    amount: v.optional(v.number()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    categoryIcon: v.optional(v.string()),
    type: v.optional(v.union(v.literal("income"), v.literal("expense"))),
  },
  handler: async (ctx, { transactionId, ...updates }) => {
    await ctx.db.patch(transactionId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(transactionId);
  },
});

// ---------------- DELETE ----------------
export const deleteTransaction = mutation({
  args: { transactionId: v.id("transaction") },
  handler: async (ctx, { transactionId }) => {
    await ctx.db.delete(transactionId);
    return { success: true };
  },
});
