import { getUser } from "@/lib/auth";
import Todos from "@/components/todos";

export default async function Home() {
  const user = await getUser();   // ✅ IMPORTANT

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
  <div className="min-h-[80vh] flex items-center justify-center">
    <div
      className="
        w-full max-w-2xl
        rounded-3xl
        bg-white/30
        backdrop-blur-xl
        border border-white/30
        shadow-2xl
        p-8
      "
    >
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">
        My Todos
      </h1>

      <Todos userId={user.id} />
    </div>
  </div>
);
}
