"use client";

import { usePathname } from "next/navigation";

export default function Navbar({ user }: any) {
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const hideLogout = pathname === "/login" || pathname === "/register";

  return (
    <nav className="w-full h-16 flex items-center justify-between px-10 bg-white/40 backdrop-blur-xl shadow-md border-b">
      {/* LEFT */}
      <h1 className="text-2xl font-bold text-indigo-600 tracking-wide">
        TodoApp
      </h1>

      {/* RIGHT */}
      {!hideLogout && user && (
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            {user.firstName?.[0]?.toUpperCase()}
          </div>

          {/* Full name */}
          <span className="hidden sm:block text-gray-700 font-medium">
            {user.firstName} {user.lastName}
          </span>

          {/* Logout */}
          <button
            onClick={logout}
            className="px-5 py-2 rounded-xl bg-red-500/90 text-white font-semibold hover:bg-red-600 transition-all shadow"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
