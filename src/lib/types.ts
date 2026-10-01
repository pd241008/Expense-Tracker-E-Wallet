import { z } from "zod";

export type TransactionType = "income" | "expense";

export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date?: number;
  userId?: string;
  type?: TransactionType;
  category?: string;
  categoryIcon?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  type?: "default" | "custom" | "income" | "expense";
}

// ---------- API validation ----------

export const createTransactionSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive().max(1_000_000_000),
  description: z.string().max(300).optional().default(""),
  date: z.number().int().positive().optional(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1).max(60),
  categoryIcon: z.string().max(16).optional(),
});

export const updateTransactionSchema = z.object({
  _id: z.string().min(1),
  amount: z.number().positive().max(1_000_000_000).optional(),
  description: z.string().max(300).optional(),
  category: z.string().min(1).max(60).optional(),
  categoryIcon: z.string().max(16).optional(),
  type: z.enum(["income", "expense"]).optional(),
});

export const createCategorySchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).max(60),
  icon: z.string().max(16).optional(),
  type: z.enum(["income", "expense", "custom"]).optional(),
});
