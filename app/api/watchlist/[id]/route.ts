import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(_request: Request, ctx: RouteContext<"/api/watchlist/[id]">) {
  const { id } = await ctx.params;

  try {
    await prisma.watchedTown.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "P2025") {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    throw err;
  }
}
