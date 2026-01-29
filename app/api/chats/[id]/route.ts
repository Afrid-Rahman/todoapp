import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { chats, messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

/* =========================
   GET CHAT MESSAGES
========================= */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chatId = Number(id);

    const chatMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json(chatMessages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/* =========================
   RENAME CHAT
========================= */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title } = await req.json();

  await db
    .update(chats)
    .set({ title })
    .where(eq(chats.id, Number(id)));

  return NextResponse.json({ success: true });
}

/* =========================
   DELETE CHAT
========================= */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chatId = Number(id);

  // 1) delete messages first
  await db.delete(messages).where(eq(messages.chatId, chatId));

  // 2) delete chat
  await db.delete(chats).where(eq(chats.id, chatId));

  return NextResponse.json({ success: true });
}

