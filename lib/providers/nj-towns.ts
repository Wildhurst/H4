// Small reference list of towns in the counties this app targets.
// Used to resolve a zip <-> town name and to seed realistic mock data.
// This is NOT a data source in itself — just local lookup metadata.

export interface TownInfo {
  town: string;
  zip: string;
  county: "Bergen" | "Passaic" | "Sussex";
}

export const NJ_TOWNS: TownInfo[] = [
  { town: "Saddle River", zip: "07458", county: "Bergen" },
  { town: "Franklin Lakes", zip: "07417", county: "Bergen" },
  { town: "Ridgewood", zip: "07450", county: "Bergen" },
  { town: "Alpine", zip: "07620", county: "Bergen" },
  { town: "Tenafly", zip: "07670", county: "Bergen" },
  { town: "Wyckoff", zip: "07481", county: "Bergen" },
  { town: "Ho-Ho-Kus", zip: "07423", county: "Bergen" },
  { town: "Wayne", zip: "07470", county: "Passaic" },
  { town: "West Milford", zip: "07480", county: "Passaic" },
  { town: "Ringwood", zip: "07456", county: "Passaic" },
  { town: "Sparta", zip: "07871", county: "Sussex" },
  { town: "Vernon", zip: "07462", county: "Sussex" },
];

export function findByZip(zip: string): TownInfo | undefined {
  return NJ_TOWNS.find((t) => t.zip === zip);
}

export function findByTown(town: string): TownInfo | undefined {
  const normalized = town.trim().toLowerCase();
  return NJ_TOWNS.find((t) => t.town.toLowerCase() === normalized);
}
