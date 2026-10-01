import { NextResponse } from "next/server";
import { convex, api } from "@/lib/convexClient";
import { getAuthUserId } from "@/lib/auth";

export async function POST() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await convex.mutation(api.user.createUser, { id: userId });
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error("POST /user error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
