// Shared types for any real estate data source (mock, RentCast, ATTOM, etc).
// Every provider must implement RealEstateDataProvider using these shapes,
// so the rest of the app never needs to know which API is behind the data.

export interface Location {
  town?: string;
  zip?: string;
  state?: string; // defaults to "NJ" if omitted
}

export interface SoldListing {
  id: string;
  address: string;
  town: string;
  state: string;
  zip: string;
  soldPrice: number;
  soldDate: string; // ISO date, e.g. "2026-03-14"
  beds: number;
  baths: number;
  sqft: number;
  pricePerSqft: number;
  photos: string[];
  lat?: number;
  lng?: number;
}

export type ListingStatus = "active" | "pending" | "under_contract";

export interface PriceHistoryEvent {
  date: string; // ISO date
  price: number;
  event: "listed" | "price_drop" | "price_increase" | "relisted";
}

export interface ActiveListing {
  id: string;
  address: string;
  town: string;
  state: string;
  zip: string;
  listPrice: number;
  originalListPrice: number;
  status: ListingStatus;
  listedDate: string; // ISO date
  daysOnMarket: number;
  beds: number;
  baths: number;
  sqft: number;
  pricePerSqft: number;
  photos: string[];
  priceHistory: PriceHistoryEvent[];
  lat?: number;
  lng?: number;
}

export interface SoldListingsQuery {
  location: Location;
  minPrice?: number; // default 1_000_000
  lookbackMonths?: number; // default 6
}

export interface ActiveListingsQuery {
  location: Location;
  minPrice?: number;
  maxPrice?: number;
}

// The contract every data source (mock or real) must fulfill.
export interface RealEstateDataProvider {
  getSoldListings(query: SoldListingsQuery): Promise<SoldListing[]>;
  getActiveListings(query: ActiveListingsQuery): Promise<ActiveListing[]>;
}
