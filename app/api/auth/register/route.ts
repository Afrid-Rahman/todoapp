import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const hash = await bcrypt.hash(password, 10);

  await db.insert(users).values({ email, password: hash });

  return NextResponse.json({ success: true });
}
