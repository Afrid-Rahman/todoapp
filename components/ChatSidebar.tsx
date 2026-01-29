"use client";

import { Menu, ListTodo, Trash2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Chat = {
  id: number;
  title: string | null;
  createdAt: string;
};

export default function ChatSidebar({
  userId,
  collapsed,
  onToggle,
}: {
  userId: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const activeChatId = searchParams.get("chatId");

  async function loadChats() {
    const res = await fetch(`/api/chats?userId=${userId}`);
    const data = await res.json();
    setChats(data);
  }

  async function createNewChat() {
    await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    loadChats();
    window.location.href = "/";
  }

  async function renameChat(chatId: number, currentTitle: string | null) {
    const newTitle = prompt("Rename chat", currentTitle || "");
    if (!newTitle) return;

    await fetch(`/api/chats/${chatId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    loadChats();
  }

  async function deleteChat(chatId: number) {
    const ok = confirm("Delete this chat?");
    if (!ok) return;

    await fetch(`/api/chats/${chatId}`, { method: "DELETE" });

    setChats((prev) => prev.filter((c) => c.id !== chatId));

    if (String(chatId) === activeChatId) {
      sessionStorage.setItem("skipAutoCreate", "1");
      window.location.href = "/";
    }
  }

  useEffect(() => {
    loadChats();
  }, [userId]);

  const filteredChats = chats.filter((chat) =>
    (chat.title || "New Chat").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`transition-all duration-300
      ${collapsed ? "w-16" : "w-68"}
      bg-white shadow h-full flex flex-col`}
    >
      {/* 🔝 TOP BAR */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2 font-semibold text-indigo-700">
            <ListTodo size={18} />
            <span>Todo</span>
          </div>
        )}

        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-indigo-100"
          title="Toggle menu"
        >
          <Menu size={20} className="text-indigo-600" />
        </button>
      </div>

      {/* 🔽 CONTENT (HIDDEN WHEN COLLAPSED) */}
      {!collapsed && (
        <div className="p-3 flex flex-col flex-1">
          <button
            onClick={createNewChat}
            className="mb-3 px-3 py-2 bg-indigo-600 text-white rounded-lg"
          >
            + New Chat
          </button>

          <input
            className="mb-3 px-3 py-2 border rounded-lg text-sm"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="space-y-2 overflow-y-auto">
            {filteredChats.map((chat) => {
              const isActive = String(chat.id) === activeChatId;

              return (
                <div
                  key={chat.id}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm
                    ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 font-semibold"
                        : "hover:bg-indigo-50"
                    }
                  `}
                >
                  <a
                    href={`/?chatId=${chat.id}`}
                    className="flex-1 truncate"
                  >
                    {chat.title || "New Chat"}
                  </a>

                  <div className="hidden group-hover:flex gap-1 ml-2">
                    <button
                      onClick={() =>
                        renameChat(chat.id, chat.title)
                      }
                      className="p-1 rounded hover:bg-gray-200"
                      title="Rename"
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>

                    <button
                      onClick={() => deleteChat(chat.id)}
                      className="p-1 rounded hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredChats.length === 0 && (
              <p className="text-sm text-gray-400 text-center mt-4">
                No chats found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
