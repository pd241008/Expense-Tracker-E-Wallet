import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// CREATE
export const createUser = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("user", { id: args.id });
  },
});

// READ
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("user").collect();
  },
});
