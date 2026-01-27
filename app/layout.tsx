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
        <main className="max-w-4xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
