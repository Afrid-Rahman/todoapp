import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { title, userId } = await req.json();

    if (!title || !userId) {
      return NextResponse.json(
        { error: "Missing title or userId" },
        { status: 400 }
      );
    }

    const [newTodo] = await db
      .insert(todos)
      .values({
        text: title,        // 🔑 FIX: map title → text
        userId: Number(userId),
        done: false,
      })
      .returning();

    return NextResponse.json(newTodo);
  } catch (err) {
    console.error("POST /api/todos error:", err);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json([]);
    }

    const data = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, Number(userId)));

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/todos error:", err);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}
