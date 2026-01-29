"use client";

import { useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";

export default function LayoutShell({
  userId,
  children,
}: {
  userId: number;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-[calc(100vh-64px)] w-full flex overflow-hidden">

      {/* SIDEBAR */}
      <ChatSidebar
        userId={userId}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full overflow-y-auto p-6 bg-transparent">

        {children}
      </main>
    </div>
  );
}
