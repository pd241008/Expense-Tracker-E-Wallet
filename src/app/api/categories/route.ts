// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { convex, api } from "../../../lib/convexClient";

// GET /api/categories?userId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const categories = await convex.query(api.category.listCategories, {
    userId,
  });
  return NextResponse.json(categories);
}

// POST /api/categories
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, icon, type, userId } = body;
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const category = await convex.mutation(api.category.createCategory, {
    name,
    icon,
    type,
    userId,
  });
  return NextResponse.json(category);
}

// DELETE /api/categories
export async function DELETE(req: NextRequest) {
  const { categoryId } = await req.json();
  if (!categoryId)
    return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });

  const res = await convex.mutation(api.category.deleteCategory, {
    categoryId,
  });
  return NextResponse.json(res);
}
