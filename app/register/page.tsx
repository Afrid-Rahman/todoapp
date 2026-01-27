"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    email: "",
    password: "",
  });

  const register = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      window.location.href = "/login";
    } else {
      alert("Registration failed");
    }
  };

  const update = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-purple-100 to-indigo-200">
      <form
        onSubmit={register}
        className="w-full max-w-lg bg-white/50 backdrop-blur-xl shadow-xl rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Create Account
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="First name"
            required
            onChange={(e) => update("firstName", e.target.value)}
            className="input"
          />
          <input
            placeholder="Last name"
            required
            onChange={(e) => update("lastName", e.target.value)}
            className="input"
          />
        </div>

        <input
          placeholder="Mobile number"
          required
          onChange={(e) => update("phone", e.target.value)}
          className="input mt-4"
        />

        <input
          type="date"
          required
          onChange={(e) => update("dob", e.target.value)}
          className="input mt-4"
        />

        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => update("email", e.target.value)}
          className="input mt-4"
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => update("password", e.target.value)}
          className="input mt-4"
        />

        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-xl bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition shadow-lg"
        >
          Create Account
        </button>

        <p className="text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
