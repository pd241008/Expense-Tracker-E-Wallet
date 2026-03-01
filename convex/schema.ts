import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User (Clerk ID stored)
  user: defineTable({
    id: v.string(),
  }).index("by_userId", ["id"]),

  // User Settings
  usersettings: defineTable({
    userId: v.string(),
    currency: v.string(),
  }).index("by_userId", ["userId"]),

  // Category
  category: defineTable({
    createdAt: v.number(),
    name: v.string(),
    icon: v.string(),
    type: v.union(
      v.literal("income"),
      v.literal("expense"),
      v.literal("custom"), // ← MUST exist here
    ),
    userId: v.string(),
  }).index("by_userId", ["userId"]),

  // Transaction (CLEAN VERSION — no external id)
  transaction: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    amount: v.number(),
    description: v.string(),
    date: v.number(),
    userId: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    categoryIcon: v.string(),
  }).index("by_userId", ["userId"]),

  // Month History
  monthhistory: defineTable({
    userId: v.string(),
    day: v.number(),
    month: v.number(),
    year: v.number(),
    income: v.number(),
    expense: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_month", ["userId", "year", "month", "day"]),

  // Year History
  yearhistory: defineTable({
    userId: v.string(),
    month: v.number(),
    year: v.number(),
    income: v.number(),
    expense: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_year", ["userId", "year", "month"]),
});
