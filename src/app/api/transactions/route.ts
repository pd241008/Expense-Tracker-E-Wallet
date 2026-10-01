import { NextRequest, NextResponse } from "next/server";
import { convex, api } from "@/lib/convexClient";
import { getAuthUserId } from "@/lib/auth";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@/lib/types";
import type { Doc } from "../../../../convex/_generated/dataModel";

export const dynamic = "force-dynamic";

// ---------------- GET ----------------
export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const records: Doc<"transaction">[] = await convex.query(
      api.transactions.listTransactions,
      { userId },
    );

    return NextResponse.json(
      records.map((r) => ({ ...r, _id: r._id.toString() })),
    );
  } catch (err) {
    console.error("GET /transactions error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// ---------------- POST ----------------
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = createTransactionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    // Never trust a client-supplied userId.
    const { ...data } = parsed.data;

    const created = await convex.mutation(api.transactions.createTransaction, {
      amount: data.amount,
      description: data.description || "Untitled",
      date: data.date ?? Date.now(),
      userId, // session user
      type: data.type,
      category: data.category,
      categoryIcon: data.categoryIcon ?? "tag",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /transactions error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// ---------------- PUT ----------------
export async function PUT(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = updateTransactionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { _id, ...updates } = parsed.data;

    // Ensure the record belongs to the caller before patching.
    const existing = await convex.query(api.transactions.listTransactions, {
      userId,
    });
    if (!existing.some((t) => t._id.toString() === _id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await convex.mutation(api.transactions.updateTransaction, {
      transactionId: _id as never,
      ...updates,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /transactions error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// ---------------- DELETE ----------------
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const transactionId = body?.transactionId;
    if (typeof transactionId !== "string" || transactionId.length === 0) {
      return NextResponse.json(
        { error: "Missing transactionId" },
        { status: 400 },
      );
    }

    // Ownership check before deleting.
    const existing = await convex.query(api.transactions.listTransactions, {
      userId,
    });
    if (!existing.some((t) => t._id.toString() === transactionId)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const deleted = await convex.mutation(api.transactions.deleteTransaction, {
      transactionId: transactionId as never,
    });

    return NextResponse.json(deleted);
  } catch (err) {
    console.error("DELETE /transactions error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
