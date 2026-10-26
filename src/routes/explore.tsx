import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GlassCard, PageTitle } from "@/components/PhoneShell";
import { PlaceList } from "@/components/PlaceList";
import { CityPicker } from "@/components/CityPicker";
import { findPlaces, findSouvenirs } from "@/lib/travel.functions";
import { useTrip } from "@/lib/trip";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Travel Buddy" },
      { name: "description", content: "Attractions, activities and hidden gems worth your time at your destination." },
      { property: "og:title", content: "Explore — Travel Buddy" },
      { property: "og:description", content: "Attractions, activities and hidden gems at your destination." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplorePage,
});

const MOODS = [
  { id: "top tourist attractions and landmarks", label: "Must-see", icon: "🏛️" },
  { id: "outdoor activities and adventure", label: "Outdoors", icon: "🥾" },
  { id: "hidden gems locals love", label: "Hidden gems", icon: "💎" },
  { id: "family-friendly activities with kids", label: "With kids", icon: "🧒" },
  { id: "nightlife and evening activities", label: "Evening", icon: "🌙" },
  { id: "free things to do on a budget", label: "Free", icon: "🎟️" },
];

const TRAVEL_CREATORS = [
  { name: "Muslim Travel Girl", focus: "Muslim travel", query: "Muslim Travel Girl" },
  { name: "Have Halal, Will Travel", focus: "Muslim-friendly guides", query: "Have Halal Will Travel" },
  { name: "Kara and Nate", focus: "Travel stories", query: "Kara and Nate" },
  { name: "Drew Binsky", focus: "Local culture", query: "Drew Binsky" },
] as const;

function ExplorePage() {
  const { city, setCity, ready } = useTrip();
  const [mood, setMood] = useState(MOODS[0]!.id);

  const places = useQuery({
    queryKey: ["explore", city.id, mood],
    queryFn: () => findPlaces({ data: { city: city.name, country: city.country, kind: mood } }),
    enabled: ready,
    staleTime: 30 * 60 * 1000,
  });

  const souvenirs = useQuery({
    queryKey: ["souvenirs", city.id],
    queryFn: () => findSouvenirs({ data: { city: city.name, country: city.country } }),
    enabled: ready,
    staleTime: 60 * 60 * 1000,
  });

  return (
    <div className="space-y-4">
      <PageTitle emoji="🗺️" title="Explore" subtitle={`Things to do in ${city.name}`} />

      <GlassCard className="rise">
        <CityPicker label="Destination" value={city} onChange={setCity} />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl p-2.5 text-[11px] font-semibold transition ${
                mood === m.id ? "gradient-brand text-primary-foreground" : "bg-white/70 text-ink ring-1 ring-black/5"
              }`}
            >
              <span className="text-base">{m.icon}</span>
              <span className="text-center leading-tight">{m.label}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      <PlaceList
        places={places.data?.places ?? []}
        loading={places.isPending || places.isFetching}
        error={places.isError}
        errorMessage={(places.error as Error | null)?.message}
        emptyHint="Nothing to show yet — pick another mood."
      />

      <GlassCard className="rise">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[15px] font-semibold">Souvenirs & things to buy</h2>
            <p className="text-[11px] text-inkmuted">Local finds and where to shop in {city.name}</p>
          </div>
          <span className="text-xl" aria-hidden="true">🎁</span>
        </div>
        {souvenirs.isPending ? (
          <div className="mt-3 space-y-2">
            {[0, 1, 2].map((item) => <div key={item} className="h-16 animate-pulse rounded-2xl bg-white/60" />)}
          </div>
        ) : souvenirs.isError ? (
          <p className="mt-3 rounded-2xl bg-destructive/10 px-3 py-3 text-[12px] font-medium text-destructive">
            {(souvenirs.error as Error | null)?.message || "Shopping suggestions are unavailable right now."}
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {(souvenirs.data?.souvenirs ?? []).map((souvenir) => (
              <article key={`${souvenir.item}-${souvenir.buyAt}`} className="rounded-2xl bg-white/70 p-3 ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{souvenir.item}</h3>
                    <p className="text-[11px] text-inkmuted">{souvenir.buyAt} · {souvenir.area}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand/10 px-2 py-1 text-[10px] font-semibold text-brand">
                    {souvenir.priceTier}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-ink/80">{souvenir.why}</p>
              </article>
            ))}
            {(souvenirs.data?.souvenirs ?? []).length === 0 ? (
              <p className="text-[12px] text-inkmuted">No shopping suggestions yet.</p>
            ) : null}
          </div>
        )}
      </GlassCard>

      <GlassCard className="rise">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[15px] font-semibold">Travel videos</h2>
            <p className="text-[11px] text-inkmuted">Creator guides for {city.name}</p>
          </div>
          <span className="text-xl" aria-hidden="true">▶️</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {TRAVEL_CREATORS.map((creator) => (
            <a
              key={creator.name}
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${creator.query} ${city.name} travel guide`)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-white/70 p-3 ring-1 ring-black/5 transition active:scale-95"
            >
              <p className="text-[12px] font-semibold leading-snug">{creator.name}</p>
              <p className="mt-1 text-[10px] text-inkmuted">{creator.focus} · Watch ↗</p>
            </a>
          ))}
        </div>
      </GlassCard>

    </div>
  );
}
