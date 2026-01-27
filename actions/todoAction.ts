"use server";

import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getTodos(userId: number) {
  return await db.select().from(todos).where(eq(todos.userId, userId));
}

export async function addTodo(text: string, userId: number) {
  await db.insert(todos).values({ text, userId });
}

export async function toggleTodo(id: number, done: boolean, userId: number) {
  await db
    .update(todos)
    .set({ done: !done })
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));
}

export async function deleteTodo(id: number, userId: number) {
  await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));
}
