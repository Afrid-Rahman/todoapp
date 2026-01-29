import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";

// DELETE todo
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = Number(id);

    await db.delete(todos).where(eq(todos.id, todoId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE todo error:", err);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}

// UPDATE todo (done OR text)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json(); // 🔥 accept any field
    const { id } = await params;
    const todoId = Number(id);

    await db
  .update(todos)
  .set({ ...body, updatedAt: new Date() })
  .where(eq(todos.id, todoId));


    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH todo error:", err);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}
