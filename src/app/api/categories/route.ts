import { NextRequest, NextResponse } from "next/server";
import { convex, api } from "@/lib/convexClient";
import { getAuthUserId } from "@/lib/auth";
import { createCategorySchema } from "@/lib/types";

// GET /api/categories
export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await convex.query(api.category.listCategories, {
      userId,
    });
    return NextResponse.json(categories);
  } catch (err) {
    console.error("GET /categories error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST /api/categories
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = createCategorySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const category = await convex.mutation(api.category.createCategory, {
      name: parsed.data.name,
      icon: parsed.data.icon ?? "tag",
      type: parsed.data.type ?? "custom",
      userId, // session user, not client-supplied
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("POST /categories error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE /api/categories
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const categoryId = body?.categoryId;
    if (typeof categoryId !== "string" || categoryId.length === 0) {
      return NextResponse.json(
        { error: "Missing categoryId" },
        { status: 400 },
      );
    }

    // Ownership check before deleting.
    const existing = await convex.query(api.category.listCategories, {
      userId,
    });
    if (!existing.some((c) => c._id.toString() === categoryId)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const res = await convex.mutation(api.category.deleteCategory, {
      categoryId: categoryId as never,
    });
    return NextResponse.json(res);
  } catch (err) {
    console.error("DELETE /categories error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
