import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { authOptions } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Questboard",
  description: "Gamified task and habit tracker with RPG mechanics.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <SessionProvider session={session}>
          <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-xl font-bold text-slate-900">
                Questboard
              </Link>
              <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
                <Link href="/dashboard" className="transition hover:text-slate-900">
                  Dashboard
                </Link>
                {session?.user ? (
                  <span className="text-slate-500">{session.user.email}</span>
                ) : (
                  <Link href="/auth/signin" className="transition hover:text-slate-900">
                    Sign in
                  </Link>
                )}
              </nav>
            </div>
          </div>
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
