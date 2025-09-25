import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// CREATE
export const createTransaction = mutation({
  args: {
    id: v.string(), // external ID (from your schema)
    createdAt: v.number(),
    updatedAt: v.number(),
    amount: v.number(),
    description: v.string(),
    date: v.number(),
    userId: v.string(),
    type: v.string(),
    category: v.string(),
    categoryIcon: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transaction", args);
  },
});

// READ MANY (all transactions for a user)
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

// READ ONE (by Convex ID)
export const getTransaction = query({
  args: { transactionId: v.id("transaction") },
  handler: async (ctx, { transactionId }) => {
    return await ctx.db.get(transactionId);
  },
});

// READ ONE (by external id field)
export const getTransactionByExternalId = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("transaction")
      .withIndex("by_transactionId", (q) => q.eq("id", id))
      .unique();
  },
});

// UPDATE
export const updateTransaction = mutation({
  args: {
    transactionId: v.id("transaction"),
    amount: v.optional(v.number()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    categoryIcon: v.optional(v.string()),
    updatedAt: v.number(),
  },
  handler: async (ctx, { transactionId, ...updates }) => {
    await ctx.db.patch(transactionId, updates);
    return await ctx.db.get(transactionId);
  },
});

// DELETE
export const deleteTransaction = mutation({
  args: { transactionId: v.id("transaction") },
  handler: async (ctx, { transactionId }) => {
    await ctx.db.delete(transactionId);
    return { success: true };
  },
});
