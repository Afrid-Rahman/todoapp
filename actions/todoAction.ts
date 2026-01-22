"use server";

import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTodos(userId: number) {
  return db.select().from(todos).where(eq(todos.userId, userId));
}

export async function addTodo(text: string, userId: number) {
  const [todo] = await db
    .insert(todos)
    .values({ text, userId })
    .returning();

  revalidatePath("/");
  return todo;
}

export async function editTodo(id: number, text: string, userId: number) {
  await db
    .update(todos)
    .set({ text })
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));

  revalidatePath("/");
}

export async function toggleTodo(id: number, done: boolean, userId: number) {
  await db
    .update(todos)
    .set({ done })
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));

  revalidatePath("/");
}

export async function deleteTodo(id: number, userId: number) {
  await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));

  revalidatePath("/");
}
