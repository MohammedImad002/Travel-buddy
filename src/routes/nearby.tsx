import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GlassCard, PageTitle } from "@/components/PhoneShell";
import { PlaceList } from "@/components/PlaceList";
import { CityPicker } from "@/components/CityPicker";
import { findPlaces } from "@/lib/travel.functions";
import { useTrip } from "@/lib/trip";

export const Route = createFileRoute("/nearby")({
  head: () => ({
    meta: [
      { title: "Nearby Places — Travel Buddy" },
      {
        name: "description",
        content: "Find restaurants, hotels, markets, cafés, hospitals, pharmacies and attractions near you.",
      },
      { property: "og:title", content: "Nearby Places — Travel Buddy" },
      { property: "og:description", content: "Everything close by, from cafés to pharmacies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NearbyPage,
});

const CATEGORIES = [
  { id: "restaurants", label: "Restaurants", icon: "🍽️" },
  { id: "hotels", label: "Hotels", icon: "🏨" },
  { id: "local homestays guesthouses and apartment stays", label: "Homestays", icon: "🏡" },
  { id: "shopping markets and malls", label: "Shopping", icon: "🛍️" },
  { id: "cafés and coffee shops", label: "Cafés", icon: "☕" },
  { id: "hospitals", label: "Hospitals", icon: "🏥" },
  { id: "pharmacies", label: "Pharmacies", icon: "💊" },
  { id: "tourist attractions", label: "Attractions", icon: "🏛️" },
  { id: "ATMs and money exchange", label: "Money", icon: "🏧" },
  { id: "EV electric vehicle charging stations", label: "EV charge", icon: "🔌" },
  { id: "petrol and fuel stations", label: "Petrol", icon: "⛽" },
  { id: "car rental agencies", label: "Car rental", icon: "🚗" },
  { id: "bike and scooter rentals", label: "Bike rental", icon: "🛵" },
  { id: "mosques", label: "Mosques", icon: "🕌" },
  { id: "Hindu temples", label: "Temples", icon: "🛕" },
];

function NearbyPage() {
  const { current: city, setCurrent: setCity, ready } = useTrip();
  const [category, setCategory] = useState(CATEGORIES[0]!.id);

  const places = useQuery({
    queryKey: ["places", city.id, category],
    queryFn: () => findPlaces({ data: { city: city.name, country: city.country, kind: category } }),
    enabled: ready,
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div className="space-y-4">
      <PageTitle emoji="📍" title="Nearby" subtitle={`Good spots around ${city.name}`} />

      <GlassCard className="rise">
        <CityPicker label="Searching near" value={city} onChange={setCity} />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl p-2 text-[10px] font-semibold transition ${
                category === c.id ? "gradient-brand text-primary-foreground" : "bg-white/70 text-ink ring-1 ring-black/5"
              }`}
            >
              <span className="text-base">{c.icon}</span>
              <span className="text-center leading-tight">{c.label}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      <PlaceList
        places={places.data?.places ?? []}
        loading={places.isPending}
        error={places.isError}
        errorMessage={(places.error as Error | null)?.message}
        emptyHint="No suggestions found — try another category."
      />

    </div>
  );
}
