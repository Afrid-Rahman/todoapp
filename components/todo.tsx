"use client";
import { useState } from "react";

export default function Todo({
  todo,
  changeTodoText,
  toggleIsTodoDone,
  deleteTodoItem,
}: any) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  return (
    <div className="
      flex items-center justify-between
      px-5 py-4 rounded-2xl
      bg-white/40 backdrop-blur-md
      shadow-md border border-white/30"
    >
      <div className="flex items-center gap-4 flex-1">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => toggleIsTodoDone(todo.id, !todo.done)}
          className="w-5 h-5 accent-indigo-600"
        />

        <input
          value={text}
          readOnly={!editing}
          onChange={(e) => setText(e.target.value)}
          className={`flex-1 bg-transparent outline-none text-lg ${
            todo.done ? "line-through text-gray-400" : ""
          }`}
        />
      </div>

      <div className="flex items-center gap-3">
        {editing ? (
          <button
            onClick={() => {
              changeTodoText(todo.id, text);
              setEditing(false);
            }}
            className="text-green-600 font-semibold"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-indigo-600 font-semibold"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => deleteTodoItem(todo.id)}
          className="text-red-500 text-xl hover:scale-110 transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
