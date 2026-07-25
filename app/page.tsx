import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Re-Flip Dashboard
      </h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
        Scout deals in the towns you&apos;re watching across Bergen, Passaic, and Sussex
        counties.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/town-report"
          className="rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Town Report</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Look up recently sold $1M+ homes in a town or zip code.
          </p>
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Watchlist Dashboard</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Track towns, see new listings, price drops, and flagged deals.
          </p>
        </Link>
      </div>
    </div>
  );
}
