import { generateActiveListings, generateSoldListings } from "./mock-generator";
import type {
  ActiveListingsQuery,
  RealEstateDataProvider,
  SoldListingsQuery,
} from "./types";

const DEFAULT_MIN_PRICE = 1_000_000;
const DEFAULT_LOOKBACK_MONTHS = 6;

// Placeholder data source. Returns realistic-looking but fake listings so
// every feature can be built and tested before a real API is chosen.
// Swap this out later for a provider that calls RentCast/ATTOM/etc, as
// long as it implements RealEstateDataProvider the rest of the app is
// unaffected.
export class MockProvider implements RealEstateDataProvider {
  async getSoldListings(query: SoldListingsQuery) {
    const minPrice = query.minPrice ?? DEFAULT_MIN_PRICE;
    const lookbackMonths = query.lookbackMonths ?? DEFAULT_LOOKBACK_MONTHS;
    return generateSoldListings(query.location, minPrice, lookbackMonths);
  }

  async getActiveListings(query: ActiveListingsQuery) {
    return generateActiveListings(query.location, query.minPrice, query.maxPrice);
  }
}
