import { NextRequest, NextResponse } from "next/server";
import { convex, api } from "@/lib/convexClient";

// Shape your Transaction type to match your Convex schema
export interface Transaction {
  _id: string;
  _creationTime: number;
  userId: string;
  type: string;
  amount: number;
  description: string;
  category: string;
  categoryIcon: string;
  date: number;
  createdAt: number;
  updatedAt: number;
}

// ------------------ GET ------------------
// /api/transactions?userId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const records = await convex.query(api.transactions.listTransactions, {
      userId,
    });

    const transactions: Transaction[] = records.map((r) => ({
      ...r,
      _id: r._id.toString(),
    }));

    return NextResponse.json(transactions);
  } catch (err) {
    console.error("GET /transactions error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ------------------ POST ------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const created = await convex.mutation(
      api.transactions.createTransaction,
      body
    );

    return NextResponse.json(created);
  } catch (err) {
    console.error("POST /transactions error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ------------------ PUT ------------------
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const updated = await convex.mutation(api.transactions.updateTransaction, {
      ...body,
      updatedAt: Date.now(),
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /transactions error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ------------------ DELETE ------------------
export async function DELETE(req: NextRequest) {
  try {
    const { transactionId } = await req.json();

    const deleted = await convex.mutation(api.transactions.deleteTransaction, {
      transactionId,
    });

    return NextResponse.json(deleted);
  } catch (err) {
    console.error("DELETE /transactions error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
