import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then(r => r[0]);

  if (!user) {
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
  });

  return res;
}
