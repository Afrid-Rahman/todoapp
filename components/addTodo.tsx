"use client";

import { useState } from "react";
import { addTodo, getTodos } from "@/actions/todoAction";

export default function AddTodo({ userId, onAdd }: any) {
  const [text, setText] = useState("");

  const submit = async () => {
    await addTodo(text, userId);
    const fresh = await getTodos(userId);
    onAdd(fresh);
    setText("");
  };

  return (
    <div className="flex gap-4 mb-6">
  <input
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="New todo"
  className="flex-1 px-5 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/30 shadow-inner text-lg placeholder-gray-500 focus:outline-none"
/>

<button
  onClick={submit}
  className="px-7 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition"
>
  Add
</button>

</div>

  );
}
