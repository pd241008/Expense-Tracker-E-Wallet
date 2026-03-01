// app/api/usersettings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { convex, api } from "../../../lib/convexClient";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const settings = await convex.mutation(
    api.usersetting.upsertUserSettings,
    body,
  );
  return NextResponse.json(settings);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const settings = await convex.query(api.usersetting.getUserSettings, {
    userId,
  });
  return NextResponse.json(settings);
}
