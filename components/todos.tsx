"use client";
import { useState } from "react";
import Todo from "./todo";
import AddTodo from "./addTodo";
import { addTodo, deleteTodo, editTodo, toggleTodo } from "@/actions/todoAction";

export default function Todos({ todos, user }: any) {
  const [items, setItems] = useState(todos);

  const createTodo = async (text: string) => {
    const t = await addTodo(text, user.id);
    setItems((p: any) => [...p, t]);
  };

  const changeTodoText = async (id: number, text: string) => {
    setItems((p: any) =>
      p.map((t: any) => (t.id === id ? { ...t, text } : t))
    );
    await editTodo(id, text, user.id);
  };

  const toggleIsTodoDone = async (id: number, done: boolean) => {
    setItems((p: any) =>
      p.map((t: any) => (t.id === id ? { ...t, done } : t))
    );
    await toggleTodo(id, done, user.id);
  };

  const deleteTodoItem = async (id: number) => {
    setItems((p: any) => p.filter((t: any) => t.id !== id));
    await deleteTodo(id, user.id);
  };

  return (
    <div
      className="flex items-center justify-center bg-slate-50"
      style={{ height: "calc(100vh - 400px)" }}
    >
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

        <div className="flex flex-col gap-2">
          {items.map((todo: any) => (
            <Todo
              key={todo.id}
              todo={todo}
              changeTodoText={changeTodoText}
              toggleIsTodoDone={toggleIsTodoDone}
              deleteTodoItem={deleteTodoItem}
            />
          ))}
        </div>

        <AddTodo createTodo={createTodo} />
      </div>
    </div>
  );
}
