import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { and, eq, gte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));

  const now = new Date();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const all = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, userId));

  const completed = all.filter(t => t.done);

  const today = completed.filter(
    t => new Date(t.updatedAt) >= startOfDay
  );

  const week = completed.filter(
    t => new Date(t.updatedAt) >= startOfWeek
  );

  return NextResponse.json({
    total: all.length,
    completed: completed.length,
    today: today.length,
    week: week.length,
    rate:
      all.length === 0
        ? 0
        : Math.round((completed.length / all.length) * 100),
  });
}
