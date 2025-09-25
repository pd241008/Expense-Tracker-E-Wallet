import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User table (Persisted on Clerk)
  user: defineTable({
    id: v.string(), // Clerk userId
  }).index("by_userId", ["id"]),

  // User Settings
  usersettings: defineTable({
    userId: v.string(),
    currency: v.string(),
  }).index("by_userId", ["userId"]),

  // Category
  category: defineTable({
    createdAt: v.number(), // timestamp
    name: v.string(),
    icon: v.string(),
    type: v.string(),
    userId: v.string(),
  }).index("by_userId", ["userId"]),

  // Transaction
  transaction: defineTable({
    id: v.string(), // external ID
    createdAt: v.number(),
    updatedAt: v.number(),
    amount: v.number(),
    description: v.string(),
    date: v.number(),
    userId: v.string(),
    type: v.string(),
    category: v.string(),
    categoryIcon: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_transactionId", ["id"]),

  // ---- Aggregates ----

  // Month History (Aggregate)
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

  // Year History (Aggregate)
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
