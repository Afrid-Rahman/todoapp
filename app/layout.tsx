import "./globals.css";
import Navbar from "@/components/Navbar";
import { getUser } from "@/lib/auth";

export default async function RootLayout({ children }: any) {
  const user = await getUser();

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br 
        from-sky-200 via-purple-100 to-indigo-200">
        <Navbar user={user} />
        <main className="h-full w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
