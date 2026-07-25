import { MockProvider } from "./mock-provider";
import type { RealEstateDataProvider } from "./types";

export * from "./types";

// Single place that decides which data source backs the app.
// Right now it's always the mock provider. Once a real API is chosen,
// add e.g. `case "rentcast": return new RentCastProvider(...)` here —
// nothing outside this file needs to change.
export function getDataProvider(): RealEstateDataProvider {
  return new MockProvider();
}
