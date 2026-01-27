import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    firstName,
    lastName,
    phone,
    dob,
    email,
    password,
  } = body;

  const hashed = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    firstName,
    lastName,
    phone,
    dob,
    email,
    password: hashed,
  });

  return NextResponse.json({ success: true });
}
