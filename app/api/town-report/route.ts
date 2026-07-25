import { NextRequest, NextResponse } from "next/server";
import { getDataProvider } from "@/lib/providers";
import { computeTownStats } from "@/lib/town-stats";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const town = params.get("town") ?? undefined;
  const zip = params.get("zip") ?? undefined;
  const minPriceParam = params.get("minPrice");
  const lookbackMonthsParam = params.get("lookbackMonths");

  if (!town && !zip) {
    return NextResponse.json(
      { error: "Provide a town or zip code." },
      { status: 400 },
    );
  }

  const minPrice = minPriceParam ? Number(minPriceParam) : 1_000_000;
  const lookbackMonths = lookbackMonthsParam ? Number(lookbackMonthsParam) : 6;

  if (!Number.isFinite(minPrice) || minPrice <= 0) {
    return NextResponse.json({ error: "minPrice must be a positive number." }, { status: 400 });
  }
  if (!Number.isFinite(lookbackMonths) || lookbackMonths <= 0 || lookbackMonths > 24) {
    return NextResponse.json(
      { error: "lookbackMonths must be between 1 and 24." },
      { status: 400 },
    );
  }

  const provider = getDataProvider();
  const listings = await provider.getSoldListings({
    location: { town, zip },
    minPrice,
    lookbackMonths,
  });

  const stats = computeTownStats(listings);

  return NextResponse.json({
    query: { town, zip, minPrice, lookbackMonths },
    stats,
  });
}
