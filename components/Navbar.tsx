"use client";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
      <Link href="/" className="text-xl font-bold text-indigo-600">
        TodoPro
      </Link>

      {isSignedIn && (
        <div className="flex items-center gap-4">
          <SignOutButton>
            <button className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">
              Sign Out
            </button>
          </SignOutButton>
          <UserButton />
        </div>
      )}
    </nav>
  );
}
