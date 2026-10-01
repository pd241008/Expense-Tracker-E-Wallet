import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const categoryType = v.union(
  v.literal("income"),
  v.literal("expense"),
  v.literal("custom"),
);

// ---------------- CREATE ----------------
export const createCategory = mutation({
  args: {
    name: v.string(),
    icon: v.string(),
    type: categoryType,
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("category", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// ---------------- READ MANY ----------------
export const listCategories = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("category")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

// ---------------- UPDATE ----------------
export const updateCategory = mutation({
  args: {
    categoryId: v.id("category"),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
    type: v.optional(categoryType),
  },
  handler: async (ctx, { categoryId, ...updates }) => {
    await ctx.db.patch(categoryId, updates);
    return await ctx.db.get(categoryId);
  },
});

// ---------------- DELETE ----------------
export const deleteCategory = mutation({
  args: { categoryId: v.id("category") },
  handler: async (ctx, { categoryId }) => {
    await ctx.db.delete(categoryId);
    return { success: true };
  },
});
