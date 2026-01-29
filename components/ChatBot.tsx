"use client";

import { useEffect, useState, useRef } from "react"; // 🔹 useRef ADDED
import { useSearchParams } from "next/navigation";

type Message = {
  role: "user" | "bot";
  content: string;
};

type TodoSuggestion = {
  title: string;
  description: string;
};

export default function ChatBot({
  userId,
  onTodoAdded,
}: {
  userId: number;
  onTodoAdded?: () => void;
}) {
  /* =========================
     READ chatId FROM URL
  ========================= */
  const searchParams = useSearchParams();
  const urlChatId = searchParams.get("chatId");

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<TodoSuggestion[]>([]);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ chatId state (initialized from URL)
  const [chatId, setChatId] = useState<number | null>(
    urlChatId ? Number(urlChatId) : null
  );

  /* =========================
     🔒 PREVENT AUTO CREATE AFTER DELETE
  ========================= */
  const skipAutoCreateRef = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem("skipAutoCreate")) {
      skipAutoCreateRef.current = true;
      sessionStorage.removeItem("skipAutoCreate");
    }
  }, []);

  /* =========================
     CREATE CHAT (ONLY IF NONE)
  ========================= */
  useEffect(() => {
    if (chatId) return;
    if (skipAutoCreateRef.current) return; // 🔥 CRITICAL FIX

    async function createChat() {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const chat = await res.json();
      setChatId(chat.id);

      // keep URL in sync
      window.history.replaceState(null, "", `/?chatId=${chat.id}`);
    }

    createChat();
  }, [userId, chatId]);

  /* =========================
     LOAD CHAT HISTORY
  ========================= */
  useEffect(() => {
    if (!chatId) return;

    async function loadMessages() {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();

      setMessages(
        data.map((m: any) => ({
          role: m.role,
          content: m.content,
        }))
      );
    }

    loadMessages();
  }, [chatId]);

  /* =========================
     SEND MESSAGE
  ========================= */
  async function sendMessage() {
    if (!input.trim() || loading || !chatId) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
    ]);

    setInput("");
    setLoading(true);

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId,
        role: "user",
        content: userText,
      }),
    });

    try {
      const fullContext = [
  ...messages,
  { role: "user", content: userText },
]
  .map((m) => `${m.role}: ${m.content}`)
  .join("\n");

const res = await fetch("/api/chatbot", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: userText,
    context: fullContext,
  }),
});


      const data = await res.json();

      if (data.clarificationNeeded) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.question },
        ]);

        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            role: "bot",
            content: data.question,
          }),
        });

        setSuggestions([]);
      } else if (data.answer) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.answer },
        ]);

        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            role: "bot",
            content: data.answer,
          }),
        });

        setSuggestions([]);
      } else {
        const botText = "Here are some suggestions 👇";

        setMessages((prev) => [
          ...prev,
          { role: "bot", content: botText },
        ]);

        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            role: "bot",
            content: botText,
          }),
        });

        setSuggestions(Array.isArray(data.todos) ? data.todos : []);
        setContext(JSON.stringify(data.todos));
      }
    } catch {
      const errorText =
        "I'm temporarily unavailable 😅 Please try again in a bit.";

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: errorText },
      ]);

      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          role: "bot",
          content: errorText,
        }),
      });
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     ACCEPT / DECLINE
  ========================= */
  async function acceptTodo(todo: TodoSuggestion) {
  await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: todo.title,
      userId,
    }),
  });

  // 🧠 SAVE MEMORY FOR CHATBOT
  await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chatId,
      role: "user",
      content: `I accepted this todo: ${todo.title}`,
    }),
  });

  // 🧠 ADD TO LOCAL CHAT CONTEXT
  setMessages((prev) => [
    ...prev,
    { role: "user", content: `I accepted this todo: ${todo.title}` },
  ]);

  window.dispatchEvent(new Event("todo-added"));
  onTodoAdded?.();
  setSuggestions((prev) => prev.filter((t) => t !== todo));
}


  function declineTodo(todo: TodoSuggestion) {
    setSuggestions((prev) => prev.filter((t) => t !== todo));
    setContext(JSON.stringify(todo));
    sendFollowUp();
  }

  async function sendFollowUp() {
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Give me another suggestion",
          context,
        }),
      });

      const data = await res.json();

      if (!data.clarificationNeeded) {
        setSuggestions(Array.isArray(data.todos) ? data.todos : []);
      }
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="mt-8 p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
      <h2 className="text-xl font-semibold mb-3 text-indigo-700">
        AI Todo Assistant
      </h2>

      <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
              msg.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "mr-auto bg-white text-gray-800"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-lg border"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4 space-y-3">
          {suggestions.map((todo, i) => (
            <div key={i} className="p-3 rounded-xl bg-white shadow">
              <h3 className="font-semibold">{todo.title}</h3>
              <p className="text-sm text-gray-600">
                {todo.description}
              </p>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => acceptTodo(todo)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => declineTodo(todo)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
