import type { Place } from "@/lib/travel.functions";

export function PlaceList({
  places,
  loading,
  error,
  errorMessage,
  emptyHint,
}: {
  places: Place[];
  loading: boolean;
  error: boolean;
  errorMessage?: string | undefined;
  emptyHint: string;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/60" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-2xl bg-destructive/10 px-3 py-3 text-[12px] font-medium text-destructive">
        {errorMessage || "Couldn't load suggestions right now. Please try again."}
      </p>
    );
  }


  if (places.length === 0) {
    return <p className="rounded-2xl bg-white/60 px-3 py-3 text-[12px] text-inkmuted">{emptyHint}</p>;
  }

  return (
    <div className="space-y-2">
      {places.map((place, i) => (
        <article
          key={`${place.name}-${i}`}
          className="flex items-start gap-3 rounded-2xl glass p-3 rise"
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-lg">
            {iconFor(place.category)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{place.name}</p>
            <p className="truncate text-[11px] text-inkmuted">
              {place.category} · {place.area}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-ink/80">{place.description}</p>
            <p className="mt-1 text-[11px] text-inkmuted">{place.openHint}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold">{place.rating?.toFixed(1) ?? "—"} ★</p>
            <p className="text-[11px] text-inkmuted">{place.priceLevel}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function iconFor(category: string) {
  const c = (category || "").toLowerCase();
  if (c.includes("hotel") || c.includes("stay")) return "🏨";
  if (c.includes("homestay") || c.includes("guesthouse") || c.includes("apartment")) return "🏡";
  if (c.includes("hospital") || c.includes("clinic")) return "🏥";
  if (c.includes("pharm")) return "💊";
  if (c.includes("charging") || c.includes("electric vehicle")) return "🔌";
  if (c.includes("petrol") || c.includes("fuel")) return "⛽";
  if (c.includes("car rental")) return "🚗";
  if (c.includes("bike") || c.includes("scooter")) return "🛵";
  if (c.includes("cafe") || c.includes("café") || c.includes("coffee")) return "☕";
  if (c.includes("market") || c.includes("shop") || c.includes("mall")) return "🛍️";
  if (c.includes("museum") || c.includes("attraction") || c.includes("landmark")) return "🏛️";
  if (c.includes("park") || c.includes("beach") || c.includes("nature")) return "🌴";
  if (c.includes("halal")) return "🕌";
  if (c.includes("mosque")) return "🕌";
  if (c.includes("temple")) return "🛕";
  if (c.includes("veg")) return "🥗";
  return "🍽️";
}
