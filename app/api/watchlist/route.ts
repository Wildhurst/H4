import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UnderpriceMode } from "@/lib/generated/prisma/enums";
import { findByTown, findByZip } from "@/lib/providers/nj-towns";

export async function GET() {
  const towns = await prisma.watchedTown.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ towns });
}

interface CreateWatchedTownBody {
  town?: string;
  zip?: string;
  state?: string;
  minPrice?: number;
  underpriceMode?: UnderpriceMode;
  underpriceValue?: number;
}

export async function POST(request: NextRequest) {
  const body: CreateWatchedTownBody = await request.json();
  let town = body.town?.trim() || undefined;
  let zip = body.zip?.trim() || undefined;

  if (!town && !zip) {
    return NextResponse.json({ error: "Provide a town or zip code." }, { status: 400 });
  }

  // Fill in the matching zip/town from our known-towns list so two
  // different-cased or zip-vs-name entries for the same place collide
  // on the unique constraint below, instead of silently duplicating.
  if (zip && !town) {
    town = findByZip(zip)?.town;
  } else if (town && !zip) {
    const known = findByTown(town);
    if (known) {
      town = known.town;
      zip = known.zip;
    }
  }
  town = town ?? "";
  zip = zip ?? "";

  const underpriceMode = body.underpriceMode ?? UnderpriceMode.PCT_BELOW_MEDIAN_PPSF;
  if (!Object.values(UnderpriceMode).includes(underpriceMode)) {
    return NextResponse.json({ error: "Invalid underpriceMode." }, { status: 400 });
  }

  try {
    const created = await prisma.watchedTown.create({
      data: {
        town,
        zip,
        state: body.state ?? "NJ",
        minPrice: body.minPrice ?? 1_000_000,
        underpriceMode,
        underpriceValue: body.underpriceValue ?? 10,
      },
    });
    return NextResponse.json({ town: created }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "P2002") {
      return NextResponse.json(
        { error: "That town/zip is already on your watchlist." },
        { status: 409 },
      );
    }
    throw err;
  }
}
