import { NextRequest, NextResponse } from "next/server";
import { convex, api } from "@/lib/convexClient";
import { getAuthUserId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("year"));

    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ error: "Invalid year" }, { status: 400 });
    }

    const records = await convex.query(api.yearhistory.listYearHistory, {
      userId,
      year,
    });
    return NextResponse.json(records);
  } catch (err) {
    console.error("GET /yearhistory error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
