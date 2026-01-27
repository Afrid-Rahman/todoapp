"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e: any) => {
    e.preventDefault(); // prevents reload

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-purple-100 to-indigo-200">
      <form
        onSubmit={login}
        className="w-full max-w-md bg-white/50 backdrop-blur-xl shadow-xl rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Welcome Back
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none bg-white/70"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none bg-white/70"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition shadow-lg"
          >
            Login
          </button>
        </div>

        <p className="text-center text-gray-700 mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-600 font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
