// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { convex, api } from "../../../../lib/convexClient";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const user = await convex.mutation(api.user.createUser, { id });
  return NextResponse.json(user);
}
