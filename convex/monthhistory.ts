import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// UPSERT
export const upsertMonthHistory = mutation({
  args: {
    userId: v.string(),
    day: v.number(),
    month: v.number(),
    year: v.number(),
    income: v.number(),
    expense: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("monthhistory")
      .withIndex("by_month", (q) =>
        q
          .eq("userId", args.userId)
          .eq("year", args.year)
          .eq("month", args.month)
          .eq("day", args.day)
      )
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        income: args.income,
        expense: args.expense,
      });
    }

    return await ctx.db.insert("monthhistory", args);
  },
});

// READ
export const listMonthHistory = query({
  args: { userId: v.string(), year: v.number(), month: v.number() },
  handler: async (ctx, { userId, year, month }) => {
    return await ctx.db
      .query("monthhistory")
      .withIndex("by_month", (q) =>
        q.eq("userId", userId).eq("year", year).eq("month", month)
      )
      .collect();
  },
});
