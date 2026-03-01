import { NextRequest, NextResponse } from "next/server";
import { convex, api } from "../../../lib/convexClient";
import { Doc } from "../../../../convex/_generated/dataModel";

export const dynamic = "force-dynamic";

export interface Transaction {
  _id: string;
  _creationTime: number;
  userId: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  categoryIcon: string;
  date: number;
  createdAt: number;
  updatedAt: number;
}

// ---------------- GET ----------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const records: Doc<"transaction">[] = await convex.query(
      api.transactions.listTransactions,
      { userId },
    );

    const transactions: Transaction[] = records.map((r) => ({
      ...r,
      _id: r._id.toString(),
    }));

    return NextResponse.json(transactions);
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
    const body = await req.json();

    const { amount, description, date, userId, type, category, categoryIcon } =
      body;

    const created = await convex.mutation(api.transactions.createTransaction, {
      amount,
      description,
      date,
      userId,
      type,
      category,
      categoryIcon: categoryIcon ?? "💸",
    });

    return NextResponse.json(created);
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
    const body = await req.json();
    const { _id, amount, description, category, categoryIcon, type } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Missing transactionId" },
        { status: 400 },
      );
    }

    const updated = await convex.mutation(api.transactions.updateTransaction, {
      transactionId: _id,
      amount,
      description,
      category,
      categoryIcon,
      type,
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
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: "Missing transactionId" },
        { status: 400 },
      );
    }

    const deleted = await convex.mutation(api.transactions.deleteTransaction, {
      transactionId,
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
