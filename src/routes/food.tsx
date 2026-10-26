import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GlassCard, PageTitle } from "@/components/PhoneShell";
import { PlaceList } from "@/components/PlaceList";
import { CityPicker } from "@/components/CityPicker";
import { findPlaces } from "@/lib/travel.functions";
import { useTrip } from "@/lib/trip";

export const Route = createFileRoute("/food")({
  head: () => ({
    meta: [
      { title: "Food Finder — Travel Buddy" },
      { name: "description", content: "Find Indian, halal, vegetarian, vegan and local cuisine wherever you travel." },
      { property: "og:title", content: "Food Finder — Travel Buddy" },
      { property: "og:description", content: "Halal, vegetarian, Indian and local food, wherever you are." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FoodPage,
});

const CUISINES = ["Halal", "Indian", "Vegetarian", "Vegan", "Local street food", "Seafood", "Chinese", "Italian", "Desserts"];

function FoodPage() {
  const { current: city, setCurrent: setCity, ready } = useTrip();
  const [cuisine, setCuisine] = useState("Halal");
  const [query, setQuery] = useState("");

  const kind = `${cuisine} restaurants${query.trim() ? ` matching "${query.trim()}"` : ""}`;

  const places = useQuery({
    queryKey: ["food", city.id, kind],
    queryFn: () => findPlaces({ data: { city: city.name, country: city.country, kind } }),
    enabled: ready,
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div className="space-y-4">
      <PageTitle emoji="🍴" title="Food Finder" subtitle={`Eat well in ${city.name}`} />

      <GlassCard className="rise">
        <CityPicker label="Searching near" value={city} onChange={setCity} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Anything specific? e.g. biryani, budget, late night"
          className="mt-3 w-full rounded-2xl bg-white/70 px-3 py-2.5 text-sm ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-brand"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                cuisine === c ? "gradient-brand text-primary-foreground" : "bg-white/70 text-ink ring-1 ring-black/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </GlassCard>

      <PlaceList
        places={places.data?.places ?? []}
        loading={places.isPending || places.isFetching}
        error={places.isError}
        errorMessage={(places.error as Error | null)?.message}
        emptyHint="No matches — try a different cuisine."
      />

    </div>
  );
}
