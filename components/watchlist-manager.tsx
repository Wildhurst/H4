"use client";

import { useEffect, useState } from "react";

interface WatchedTown {
  id: string;
  town: string; // empty string means "not set"
  zip: string; // empty string means "not set"
  state: string;
  minPrice: number;
  underpriceMode: "PCT_BELOW_MEDIAN_PPSF" | "FLAT_PRICE_THRESHOLD" | "PRICE_DROP_PCT";
  underpriceValue: number;
  createdAt: string;
}

const MODE_LABELS: Record<WatchedTown["underpriceMode"], string> = {
  PCT_BELOW_MEDIAN_PPSF: "% below median $/sqft",
  FLAT_PRICE_THRESHOLD: "Flat price threshold ($)",
  PRICE_DROP_PCT: "Recent price drop (%)",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function ruleDescription(mode: WatchedTown["underpriceMode"], value: number): string {
  switch (mode) {
    case "PCT_BELOW_MEDIAN_PPSF":
      return `Flag when list $/sqft is ${value}% below the town's median`;
    case "FLAT_PRICE_THRESHOLD":
      return `Flag when list price is below ${currencyFormatter.format(value)}`;
    case "PRICE_DROP_PCT":
      return `Flag when price has dropped ${value}% or more`;
  }
}

export function WatchlistManager() {
  const [towns, setTowns] = useState<WatchedTown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [town, setTown] = useState("");
  const [zip, setZip] = useState("");
  const [minPrice, setMinPrice] = useState(1_000_000);
  const [underpriceMode, setUnderpriceMode] =
    useState<WatchedTown["underpriceMode"]>("PCT_BELOW_MEDIAN_PPSF");
  const [underpriceValue, setUnderpriceValue] = useState(10);
  const [saving, setSaving] = useState(false);

  async function loadTowns() {
    setLoading(true);
    try {
      const res = await fetch("/api/watchlist");
      const data = await res.json();
      setTowns(data.towns ?? []);
    } catch {
      setError("Could not load your watchlist.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/watchlist");
        const data = await res.json();
        if (!ignore) setTowns(data.towns ?? []);
      } catch {
        if (!ignore) setError("Could not load your watchlist.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  async function addTown(e: React.FormEvent) {
    e.preventDefault();
    if (!town.trim() && !zip.trim()) {
      setError("Enter a town or zip code.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          town: town.trim() || undefined,
          zip: zip.trim() || undefined,
          minPrice,
          underpriceMode,
          underpriceValue,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not add that town.");
      } else {
        setTown("");
        setZip("");
        await loadTowns();
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  }

  async function removeTown(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Could not remove that town.");
        return;
      }
      setTowns((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Could not reach the server.");
    }
  }

  return (
    <div>
      <form
        onSubmit={addTown}
        className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-white p-4 sm:grid-cols-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Town
          </label>
          <input
            type="text"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            placeholder="e.g. Wyckoff"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Zip code
          </label>
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="e.g. 07481"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Min comp price
          </label>
          <input
            type="number"
            step={50000}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Underpriced rule
          </label>
          <select
            value={underpriceMode}
            onChange={(e) => setUnderpriceMode(e.target.value as WatchedTown["underpriceMode"])}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            {Object.entries(MODE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Rule value
          </label>
          <input
            type="number"
            value={underpriceValue}
            onChange={(e) => setUnderpriceValue(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {saving ? "Adding..." : "Add to watchlist"}
          </button>
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading watchlist...</p>
        ) : towns.length === 0 ? (
          <p className="text-sm text-zinc-500">No towns on your watchlist yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {towns.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {t.town || "—"} {t.zip ? `(${t.zip})` : ""}, {t.state}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Min comp {currencyFormatter.format(t.minPrice)} &middot;{" "}
                    {ruleDescription(t.underpriceMode, t.underpriceValue)}
                  </p>
                </div>
                <button
                  onClick={() => removeTown(t.id)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
