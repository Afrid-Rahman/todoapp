import { getUser } from "@/lib/auth";
import Todos from "@/components/todos";
import ChatBot from "@/components/ChatBot";
import LayoutShell from "@/components/LayoutShell";
import ProductivityStats from "@/components/ProductivityStats";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <a href="/login" className="text-blue-600">
          Please login
        </a>
      </div>
    );
  }

  return (
    <LayoutShell userId={user.id}>
      <div
        className="
          rounded-3xl
          bg-white/30
          backdrop-blur-xl
          border border-white/30
          shadow-2xl
          p-8
          overflow-y-auto
        "
      >
        <h1 className="text-4xl font-bold text-indigo-700 mb-6">
          My Todos
        </h1>

        <ProductivityStats userId={user.id} />
        <Todos userId={user.id} />
        <ChatBot userId={user.id} />
      </div>
      

    </LayoutShell>
  );
}
