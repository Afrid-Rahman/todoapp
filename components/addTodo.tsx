"use client";
import { useState } from "react";

export default function AddTodo({ createTodo }: any) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    createTodo(input.trim());
    setInput("");
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        className="flex-1 border rounded-md px-3 py-2"
        placeholder="Add new task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <button
        onClick={handleAdd}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-md"
      >
        Add
      </button>
    </div>
  );
}
