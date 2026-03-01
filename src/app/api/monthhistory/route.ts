// app/api/monthhistory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { convex, api } from "../../../lib/convexClient";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const record = await convex.mutation(
    api.monthhistory.upsertMonthHistory,
    body,
  );
  return NextResponse.json(record);
}

// optional read
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  const records = await convex.query(api.monthhistory.listMonthHistory, {
    userId,
    month,
    year,
  });
  return NextResponse.json(records);
}
