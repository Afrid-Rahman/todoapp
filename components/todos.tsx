"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Save, X } from "lucide-react";

type Todo = {
  id: number;
  text: string;
  done: boolean;
  userId: number;
};

export default function Todos({ userId }: { userId: number }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  // 🔹 edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  async function fetchTodos() {
    const res = await fetch(`/api/todos?userId=${userId}`);
    const data = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    fetchTodos();
  }, [userId]);

  useEffect(() => {
    function handleRefresh() {
      fetchTodos();
    }
    window.addEventListener("todo-added", handleRefresh);
    return () => window.removeEventListener("todo-added", handleRefresh);
  }, [userId]);

  async function addTodo() {
    if (!input.trim()) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input, userId }),
    });

    const newTodo = await res.json();
    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
    window.dispatchEvent(new Event("todo-updated"));
  }

  async function deleteTodo(id: number) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    window.dispatchEvent(new Event("todo-updated"));
  }

  async function toggleDone(todo: Todo) {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id ? { ...t, done: !t.done } : t
      )
    );

    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    window.dispatchEvent(new Event("todo-updated"));
  }

  // 💾 SAVE EDIT
  async function saveEdit(todo: Todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText }),
    });

    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id ? { ...t, text: editText } : t
      )
    );

    setEditingId(null);
    setEditText("");
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 border rounded-lg"
          placeholder="Add a todo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-3 bg-white rounded-xl shadow"
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo)}
              />

              {editingId === todo.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 border px-2 py-1 rounded"
                />
              ) : (
                <span
                  className={
                    todo.done ? "line-through text-gray-400" : ""
                  }
                >
                  {todo.text}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {editingId === todo.id ? (
                <>
                  <button
                    onClick={() => saveEdit(todo)}
                    className="p-1 hover:bg-green-100 rounded"
                  >
                    <Save size={18} className="text-green-600" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditText(todo.text);
                    }}
                    className="p-1 hover:bg-indigo-100 rounded"
                  >
                    <Pencil size={18} className="text-indigo-600" />
                  </button>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
