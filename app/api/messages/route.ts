import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { messages, chats } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { chatId, role, content } = await req.json();

    // save message (UNCHANGED)
    const [message] = await db
      .insert(messages)
      .values({ chatId, role, content })
      .returning();

    // 🔹 ADDED: auto-generate chat title on FIRST user message
    if (role === "user") {
      const existingMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId))
        .limit(2);

      // if this is the first message in the chat
      if (existingMessages.length === 1) {
        await db
          .update(chats)
          .set({
            title: content.slice(0, 40), // simple, safe title
          })
          .where(eq(chats.id, chatId));
      }
    }

    return NextResponse.json(message);
  } catch (err) {
    console.error("Save message error:", err);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
