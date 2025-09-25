import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// CREATE
export const createCategory = mutation({
  args: {
    createdAt: v.number(),
    name: v.string(),
    icon: v.string(),
    type: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("category", args);
  },
});

// READ (all categories by user)
export const listCategories = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("category")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

// READ (single category by ID)
export const getCategoryById = query({
  args: { categoryId: v.id("category") },
  handler: async (ctx, { categoryId }) => {
    return await ctx.db.get(categoryId);
  },
});

// UPDATE
export const updateCategory = mutation({
  args: {
    categoryId: v.id("category"),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, { categoryId, ...updates }) => {
    await ctx.db.patch(categoryId, updates);
    return await ctx.db.get(categoryId);
  },
});

// DELETE
export const deleteCategory = mutation({
  args: { categoryId: v.id("category") },
  handler: async (ctx, { categoryId }) => {
    await ctx.db.delete(categoryId);
    return { success: true };
  },
});
