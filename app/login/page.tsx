"use client";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const login = async () => {
  await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  window.location.href = "/";
};


  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-white shadow rounded w-80">
        <h1 className="text-xl mb-4">Login</h1>

        <input
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-indigo-600 text-white w-full p-2 rounded"
        >
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
