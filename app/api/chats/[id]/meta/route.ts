import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { chats } from "@/db/schema";
import { eq } from "drizzle-orm";

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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db
    .delete(chats)
    .where(eq(chats.id, Number(id)));

  return NextResponse.json({ success: true });
}
