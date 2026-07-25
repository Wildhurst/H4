import type { SoldListing } from "./providers/types";

export interface TownStats {
  count: number;
  medianPrice: number;
  averagePrice: number;
  lowPrice: number;
  highPrice: number;
  priceSpread: number;
  cheapest: SoldListing[];
  mostExpensive: SoldListing[];
}

const TOP_N = 5;

export function computeTownStats(listings: SoldListing[]): TownStats | null {
  if (listings.length === 0) return null;

  const byPrice = [...listings].sort((a, b) => a.soldPrice - b.soldPrice);
  const prices = byPrice.map((l) => l.soldPrice);

  const mid = Math.floor(prices.length / 2);
  const medianPrice =
    prices.length % 2 === 0 ? Math.round((prices[mid - 1] + prices[mid]) / 2) : prices[mid];
  const averagePrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);

  const lowPrice = prices[0];
  const highPrice = prices[prices.length - 1];

  return {
    count: listings.length,
    medianPrice,
    averagePrice,
    lowPrice,
    highPrice,
    priceSpread: highPrice - lowPrice,
    cheapest: byPrice.slice(0, TOP_N),
    mostExpensive: byPrice.slice(-TOP_N).reverse(),
  };
}
