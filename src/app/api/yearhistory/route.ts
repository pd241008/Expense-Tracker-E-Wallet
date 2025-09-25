// app/api/yearhistory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { convex, api } from "@/lib/convexClient";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const record = await convex.mutation(api.yearhistory.upsertYearHistory, body);
  return NextResponse.json(record);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const year = Number(searchParams.get("year"));
  const records = await convex.query(api.yearhistory.listYearHistory, {
    userId,
    year,
  });
  return NextResponse.json(records);
}
