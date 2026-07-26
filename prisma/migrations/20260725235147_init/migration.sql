-- CreateEnum
CREATE TYPE "UnderpriceMode" AS ENUM ('PCT_BELOW_MEDIAN_PPSF', 'FLAT_PRICE_THRESHOLD', 'PRICE_DROP_PCT');

-- CreateEnum
CREATE TYPE "ListingEventType" AS ENUM ('NEW_LISTING', 'PRICE_DROP', 'UNDERPRICED');

-- CreateTable
CREATE TABLE "WatchedTown" (
    "id" TEXT NOT NULL,
    "town" TEXT,
    "zip" TEXT,
    "state" TEXT NOT NULL DEFAULT 'NJ',
    "minPrice" INTEGER NOT NULL DEFAULT 1000000,
    "underpriceMode" "UnderpriceMode" NOT NULL DEFAULT 'PCT_BELOW_MEDIAN_PPSF',
    "underpriceValue" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchedTown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingRecord" (
    "id" TEXT NOT NULL,
    "watchedTownId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "listPrice" INTEGER NOT NULL,
    "originalListPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "daysOnMarket" INTEGER NOT NULL,
    "beds" INTEGER NOT NULL,
    "baths" INTEGER NOT NULL,
    "sqft" INTEGER NOT NULL,
    "pricePerSqft" INTEGER NOT NULL,
    "photos" TEXT[],
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingEvent" (
    "id" TEXT NOT NULL,
    "watchedTownId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "eventType" "ListingEventType" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "listPrice" INTEGER NOT NULL,
    "previousPrice" INTEGER,
    "beds" INTEGER NOT NULL,
    "baths" INTEGER NOT NULL,
    "sqft" INTEGER NOT NULL,
    "pricePerSqft" INTEGER NOT NULL,
    "photos" TEXT[],

    CONSTRAINT "ListingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchedTown_town_zip_key" ON "WatchedTown"("town", "zip");

-- CreateIndex
CREATE UNIQUE INDEX "ListingRecord_watchedTownId_externalId_key" ON "ListingRecord"("watchedTownId", "externalId");

-- CreateIndex
CREATE INDEX "ListingEvent_watchedTownId_occurredAt_idx" ON "ListingEvent"("watchedTownId", "occurredAt");

-- AddForeignKey
ALTER TABLE "ListingRecord" ADD CONSTRAINT "ListingRecord_watchedTownId_fkey" FOREIGN KEY ("watchedTownId") REFERENCES "WatchedTown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingEvent" ADD CONSTRAINT "ListingEvent_watchedTownId_fkey" FOREIGN KEY ("watchedTownId") REFERENCES "WatchedTown"("id") ON DELETE CASCADE ON UPDATE CASCADE;
