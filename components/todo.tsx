"use client";
import { useState } from "react";

export default function Todo({ todo, changeTodoText, toggleIsTodoDone, deleteTodoItem }: any) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => toggleIsTodoDone(todo.id, !todo.done)}
        className="h-4 w-4"
      />

      <input
        value={text}
        readOnly={!editing}
        onChange={(e) => setText(e.target.value)}
        className={`flex-1 bg-transparent outline-none ${
          todo.done ? "line-through text-gray-400" : ""
        }`}
      />

      {editing ? (
        <button
          onClick={() => {
            changeTodoText(todo.id, text);
            setEditing(false);
          }}
          className="text-green-600"
        >
          Save
        </button>
      ) : (
        <button onClick={() => setEditing(true)} className="text-blue-600">
          Edit
        </button>
      )}

      <button
        onClick={() => deleteTodoItem(todo.id)}
        className="text-red-600"
      >
        Delete
      </button>
    </div>
  );
}
