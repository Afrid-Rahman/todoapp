import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { chats } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const [chat] = await db
      .insert(chats)
      .values({ userId, title: "New Chat" })
      .returning();

    return NextResponse.json(chat);
  } catch (err) {
    console.error("Create chat error:", err);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));

    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.createdAt));

    return NextResponse.json(userChats);
  } catch (err) {
    console.error("Fetch chats error:", err);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
