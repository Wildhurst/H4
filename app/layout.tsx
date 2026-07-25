import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Re-Flip Dashboard",
  description: "Deal scouting dashboard for NJ flips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black">
        <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
            <Link href="/" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Re-Flip Dashboard
            </Link>
            <Link href="/town-report" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
              Town Report
            </Link>
            <Link href="/dashboard" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
              Watchlist Dashboard
            </Link>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
