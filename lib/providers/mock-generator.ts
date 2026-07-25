import { seededRandom, randInt, pick } from "./random";
import { findByTown, findByZip } from "./nj-towns";
import type {
  ActiveListing,
  Location,
  PriceHistoryEvent,
  SoldListing,
} from "./types";

const STREET_NAMES = [
  "Ridge Rd",
  "Highland Ave",
  "Lake Shore Dr",
  "Overlook Ter",
  "Chestnut Ridge Rd",
  "Franklin Turnpike",
  "Kinderkamack Rd",
  "Godwin Ave",
  "East Saddle River Rd",
  "Fardale Ave",
  "Summit Ave",
  "Prospect St",
  "Colonial Rd",
  "Hillcrest Dr",
  "Old Mill Rd",
];

const PLACEHOLDER_PHOTO_COUNT = 4;

function photosFor(seedId: string): string[] {
  return Array.from(
    { length: PLACEHOLDER_PHOTO_COUNT },
    (_, i) => `https://picsum.photos/seed/${seedId}-${i}/800/600`,
  );
}

function resolveLocation(location: Location): { town: string; zip: string; state: string } {
  const state = location.state ?? "NJ";
  if (location.zip) {
    const known = findByZip(location.zip);
    return { town: known?.town ?? `Zip ${location.zip}`, zip: location.zip, state };
  }
  if (location.town) {
    const known = findByTown(location.town);
    return { town: known?.town ?? location.town, zip: known?.zip ?? "00000", state };
  }
  throw new Error("Location must include a town or zip");
}

function randomDateWithinMonths(rand: () => number, months: number): Date {
  const now = Date.now();
  const msBack = randInt(rand, 0, months * 30) * 24 * 60 * 60 * 1000;
  return new Date(now - msBack);
}

function buildAddress(rand: () => number): string {
  return `${randInt(rand, 3, 999)} ${pick(rand, STREET_NAMES)}`;
}

export function generateSoldListings(
  location: Location,
  minPrice: number,
  lookbackMonths: number,
): SoldListing[] {
  const resolved = resolveLocation(location);
  const rand = seededRandom(`sold:${resolved.zip}:${minPrice}:${lookbackMonths}`);
  const count = randInt(rand, 9, 18);

  const listings: SoldListing[] = [];
  for (let i = 0; i < count; i++) {
    const id = `sold-${resolved.zip}-${i}`;
    // Long tail above minPrice: most cluster near the low end, a few go much higher.
    const tail = Math.pow(rand(), 2.2);
    const soldPrice = Math.round((minPrice + tail * minPrice * 3.5) / 5000) * 5000;
    const sqft = randInt(rand, 2400, 6800);
    const soldDate = randomDateWithinMonths(rand, lookbackMonths);

    listings.push({
      id,
      address: buildAddress(rand),
      town: resolved.town,
      state: resolved.state,
      zip: resolved.zip,
      soldPrice,
      soldDate: soldDate.toISOString().slice(0, 10),
      beds: randInt(rand, 4, 7),
      baths: randInt(rand, 3, 6),
      sqft,
      pricePerSqft: Math.round(soldPrice / sqft),
      photos: photosFor(id),
    });
  }

  return listings.sort((a, b) => (a.soldDate < b.soldDate ? 1 : -1));
}

export function generateActiveListings(
  location: Location,
  minPrice?: number,
  maxPrice?: number,
): ActiveListing[] {
  const resolved = resolveLocation(location);
  const floor = minPrice ?? 1_000_000;
  const ceiling = maxPrice ?? floor * 4;
  const rand = seededRandom(`active:${resolved.zip}:${floor}:${ceiling}:${new Date().toISOString().slice(0, 10)}`);
  const count = randInt(rand, 4, 9);

  const listings: ActiveListing[] = [];
  for (let i = 0; i < count; i++) {
    const id = `active-${resolved.zip}-${i}`;
    const tail = Math.pow(rand(), 2);
    const originalListPrice = Math.round((floor + tail * (ceiling - floor)) / 5000) * 5000;
    const sqft = randInt(rand, 2400, 6800);
    const daysOnMarket = randInt(rand, 0, 120);
    const listedDate = new Date(Date.now() - daysOnMarket * 24 * 60 * 60 * 1000);

    const priceHistory: PriceHistoryEvent[] = [
      { date: listedDate.toISOString().slice(0, 10), price: originalListPrice, event: "listed" },
    ];

    // Roughly a third of listings get a price drop somewhere along the way.
    let listPrice = originalListPrice;
    if (rand() < 0.35 && daysOnMarket > 14) {
      const dropPct = 0.03 + rand() * 0.12;
      listPrice = Math.round((originalListPrice * (1 - dropPct)) / 5000) * 5000;
      const dropDate = new Date(
        listedDate.getTime() + randInt(rand, 10, daysOnMarket - 1) * 24 * 60 * 60 * 1000,
      );
      priceHistory.push({
        date: dropDate.toISOString().slice(0, 10),
        price: listPrice,
        event: "price_drop",
      });
    }

    listings.push({
      id,
      address: buildAddress(rand),
      town: resolved.town,
      state: resolved.state,
      zip: resolved.zip,
      listPrice,
      originalListPrice,
      status: "active",
      listedDate: listedDate.toISOString().slice(0, 10),
      daysOnMarket,
      beds: randInt(rand, 4, 7),
      baths: randInt(rand, 3, 6),
      sqft,
      pricePerSqft: Math.round(listPrice / sqft),
      photos: photosFor(id),
      priceHistory,
    });
  }

  return listings;
}
