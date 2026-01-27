import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .then(r => r[0]);

    return user || null;
  } catch {
    return null;
  }
}
