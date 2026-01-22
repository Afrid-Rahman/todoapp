"use server";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUser(clerkUser: any) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id));

  if (existing.length) return existing[0];

  const [newUser] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
    })
    .returning();

  return newUser;
}
