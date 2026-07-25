const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export interface ListingCardBadge {
  label: string;
  tone: "new" | "drop" | "underpriced";
}

interface ListingCardProps {
  photo: string;
  address: string;
  town: string;
  zip: string;
  price: number;
  priceLabel?: string;
  beds: number;
  baths: number;
  sqft: number;
  pricePerSqft: number;
  dateLabel?: string;
  badges?: ListingCardBadge[];
}

const badgeStyles: Record<ListingCardBadge["tone"], string> = {
  new: "bg-blue-100 text-blue-800",
  drop: "bg-amber-100 text-amber-800",
  underpriced: "bg-green-100 text-green-800",
};

export function ListingCard({
  photo,
  address,
  town,
  zip,
  price,
  priceLabel,
  beds,
  baths,
  sqft,
  pricePerSqft,
  dateLabel,
  badges,
}: ListingCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={address} className="h-full w-full object-cover" />
        {badges && badges.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={`rounded px-2 py-0.5 text-xs font-medium ${badgeStyles[badge.tone]}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {currencyFormatter.format(price)}
          </span>
          {priceLabel && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{priceLabel}</span>
          )}
        </div>
        <p className="mt-0.5 truncate text-sm text-zinc-700 dark:text-zinc-300">{address}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {town}, {zip}
        </p>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {beds} bd &middot; {baths} ba &middot; {sqft.toLocaleString()} sqft &middot; $
          {pricePerSqft}/sqft
        </p>
        {dateLabel && (
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{dateLabel}</p>
        )}
      </div>
    </div>
  );
}
