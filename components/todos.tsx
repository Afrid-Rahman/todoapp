"use client";

import { useEffect, useState } from "react";
import { getTodos, deleteTodo, toggleTodo } from "@/actions/todoAction";
import AddTodo from "./addTodo";
import { Trash2 } from "lucide-react";

export default function Todos({ userId }: { userId: number }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    getTodos(userId).then(setItems);
  }, [userId]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 p-6 rounded-3xl bg-white/30 backdrop-blur-xl shadow-xl border border-white/40">

      <AddTodo userId={userId} onAdd={setItems} />

      <div className="mt-6 flex flex-col gap-4">
        {items.map(todo => (
          <div
            key={todo.id}
            className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/40 backdrop-blur-md shadow-md border border-white/30"
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={async () => {
                  await toggleTodo(todo.id, todo.done, userId);
                  setItems(
                    items.map(t =>
                      t.id === todo.id ? { ...t, done: !t.done } : t
                    )
                  );
                }}
                className="w-5 h-5 accent-indigo-600"
              />

              <span className={`text-lg ${todo.done ? "line-through text-gray-400" : ""}`}>
                {todo.text}
              </span>
            </div>

            <button
              onClick={async () => {
                await deleteTodo(todo.id, userId);
                setItems(items.filter(t => t.id !== todo.id));
              }}
              className="text-red-500 hover:text-red-700 transition"
            >
              <Trash2 size={22} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
