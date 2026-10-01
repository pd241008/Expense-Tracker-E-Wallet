import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// UPSERT
export const upsertYearHistory = mutation({
  args: {
    userId: v.string(),
    month: v.number(),
    year: v.number(),
    income: v.number(),
    expense: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("yearhistory")
      .withIndex("by_year", (q) =>
        q
          .eq("userId", args.userId)
          .eq("year", args.year)
          .eq("month", args.month)
      )
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        income: args.income,
        expense: args.expense,
      });
    }

    return await ctx.db.insert("yearhistory", args);
  },
});

// READ
export const listYearHistory = query({
  args: { userId: v.string(), year: v.number() },
  handler: async (ctx, { userId, year }) => {
    return await ctx.db
      .query("yearhistory")
      .withIndex("by_year", (q) => q.eq("userId", userId).eq("year", year))
      .collect();
  },
});
