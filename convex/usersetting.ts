import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// UPSERT
export const upsertUserSettings = mutation({
  args: {
    userId: v.string(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("usersettings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, { currency: args.currency });
    }

    return await ctx.db.insert("usersettings", args);
  },
});

// READ
export const getUserSettings = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("usersettings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});
