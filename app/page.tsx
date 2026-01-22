import { currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/actions/userActions";
import { getTodos } from "@/actions/todoAction";
import Todos from "@/components/todos";

export default async function Home() {
  const clerkUser = await currentUser();
  if (!clerkUser) return <div>Please sign in.</div>;

  const dbUser = await getOrCreateUser(clerkUser);
  const userTodos = await getTodos(dbUser.id);

  return <Todos todos={userTodos} user={dbUser} />;
}
