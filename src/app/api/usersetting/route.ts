import { NextRequest, NextResponse } from "next/server";
import { convex, api } from "@/lib/convexClient";
import { getAuthUserId } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const currency =
      typeof body?.currency === "string" && body.currency.length <= 8
        ? body.currency
        : "USD";

    const settings = await convex.mutation(api.usersetting.upsertUserSettings, {
      userId,
      currency,
    });
    return NextResponse.json(settings);
  } catch (err) {
    console.error("POST /usersetting error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await convex.query(api.usersetting.getUserSettings, {
      userId,
    });
    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET /usersetting error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
