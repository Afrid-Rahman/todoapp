import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: any) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-zinc-50">
          <Navbar />
          <main className="max-w-4xl mx-auto p-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
