"use client";

import { useState } from "react";
import { ListingCard } from "@/components/listing-card";
import type { TownStats } from "@/lib/town-stats";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface ReportResponse {
  query: { town?: string; zip?: string; minPrice: number; lookbackMonths: number };
  stats: TownStats | null;
  error?: string;
}

export default function TownReportPage() {
  const [town, setTown] = useState("");
  const [zip, setZip] = useState("");
  const [minPrice, setMinPrice] = useState(1_000_000);
  const [lookbackMonths, setLookbackMonths] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ReportResponse | null>(null);

  async function runReport(e: React.FormEvent) {
    e.preventDefault();
    if (!town.trim() && !zip.trim()) {
      setError("Enter a town or zip code.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (town.trim()) params.set("town", town.trim());
      if (zip.trim()) params.set("zip", zip.trim());
      params.set("minPrice", String(minPrice));
      params.set("lookbackMonths", String(lookbackMonths));

      const res = await fetch(`/api/town-report?${params.toString()}`);
      const data: ReportResponse = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setReport(null);
      } else {
        setReport(data);
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  const stats = report?.stats ?? null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Town Report</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Recently sold homes over your price threshold, for a town or zip code.
      </p>

      <form onSubmit={runReport} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Town
          </label>
          <input
            type="text"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            placeholder="e.g. Ridgewood"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
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
            placeholder="e.g. 07450"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Min sold price
          </label>
          <input
            type="number"
            step={50000}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Lookback (months)
          </label>
          <input
            type="number"
            min={1}
            max={24}
            value={lookbackMonths}
            onChange={(e) => setLookbackMonths(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="sm:col-span-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {loading ? "Running..." : "Run report"}
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {report && !stats && !error && (
        <p className="mt-6 text-sm text-zinc-500">
          No sold homes found above {currencyFormatter.format(report.query.minPrice)} in the last{" "}
          {report.query.lookbackMonths} months.
        </p>
      )}

      {stats && (
        <div className="mt-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <StatBox label="Sold homes" value={String(stats.count)} />
            <StatBox label="Median price" value={currencyFormatter.format(stats.medianPrice)} />
            <StatBox label="Average price" value={currencyFormatter.format(stats.averagePrice)} />
            <StatBox
              label="Price range"
              value={`${currencyFormatter.format(stats.lowPrice)} - ${currencyFormatter.format(stats.highPrice)}`}
            />
            <StatBox label="Spread" value={currencyFormatter.format(stats.priceSpread)} />
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Cheapest sold homes
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {stats.cheapest.map((listing) => (
                <ListingCard
                  key={listing.id}
                  photo={listing.photos[0]}
                  address={listing.address}
                  town={listing.town}
                  zip={listing.zip}
                  price={listing.soldPrice}
                  priceLabel={`sold ${listing.soldDate}`}
                  beds={listing.beds}
                  baths={listing.baths}
                  sqft={listing.sqft}
                  pricePerSqft={listing.pricePerSqft}
                />
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Most expensive sold homes
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {stats.mostExpensive.map((listing) => (
                <ListingCard
                  key={listing.id}
                  photo={listing.photos[0]}
                  address={listing.address}
                  town={listing.town}
                  zip={listing.zip}
                  price={listing.soldPrice}
                  priceLabel={`sold ${listing.soldDate}`}
                  beds={listing.beds}
                  baths={listing.baths}
                  sqft={listing.sqft}
                  pricePerSqft={listing.pricePerSqft}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}
