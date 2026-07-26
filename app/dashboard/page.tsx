import { WatchlistManager } from "@/components/watchlist-manager";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Watchlist Dashboard
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Save the towns you&apos;re watching. Next up: daily checks that surface new listings,
        price drops, and flagged underpriced deals here.
      </p>

      <div className="mt-6">
        <WatchlistManager />
      </div>
    </div>
  );
}
