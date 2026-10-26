import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GlassCard, PageTitle } from "@/components/PhoneShell";
import { getTravelTips } from "@/lib/travel.functions";
import { loadWeather } from "@/lib/weather";
import { useLocalList, useTrip } from "@/lib/trip";

export const Route = createFileRoute("/essentials")({
  head: () => ({
    meta: [
      { title: "Travel Essentials — Travel Buddy" },
      {
        name: "description",
        content: "Packing checklist, day-by-day itinerary, weather, emergency numbers and practical travel tips.",
      },
      { property: "og:title", content: "Travel Essentials — Travel Buddy" },
      { property: "og:description", content: "Packing, itinerary, weather and emergency numbers in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EssentialsPage,
});

type Item = { id: string; text: string; done: boolean };

const DEFAULT_PACKING: Item[] = [
  "Passport & visa",
  "Travel insurance",
  "Phone charger & adapter",
  "Medicines",
  "Local cash",
  "Comfortable shoes",
].map((text, i) => ({ id: `p${i}`, text, done: false }));

const TRAVEL_AWARENESS = [
  {
    icon: "🎒",
    title: "Pickpockets",
    advice: "Keep valuables zipped and in front of you in crowds, stations, and busy attractions.",
  },
  {
    icon: "💱",
    title: "Money exchange scams",
    advice: "Check the full rate and fees first; use licensed counters or bank ATMs and count cash before leaving.",
  },
  {
    icon: "🎟️",
    title: "Tourist traps",
    advice: "Confirm menus, prices, tickets, and taxi fares before accepting. Walk away from high-pressure offers.",
  },
  {
    icon: "⚠️",
    title: "Common scams",
    advice: "Be cautious with unsolicited help, distraction tactics, unofficial guides, and requests to handle your card or phone.",
  },
] as const;

function EssentialsPage() {
  const { city, ready } = useTrip();
  const packing = useLocalList<Item>("tb-packing", DEFAULT_PACKING);
  const itinerary = useLocalList<Item>("tb-itinerary", []);
  const [packInput, setPackInput] = useState("");
  const [planInput, setPlanInput] = useState("");

  const weather = useQuery({
    queryKey: ["weather", city.id],
    queryFn: () => loadWeather(city.lat, city.lon),
    enabled: ready,
    staleTime: 10 * 60 * 1000,
  });

  const tips = useQuery({
    queryKey: ["tips", city.id],
    queryFn: () => getTravelTips({ data: { city: city.name, country: city.country } }),
    enabled: ready,
    staleTime: 60 * 60 * 1000,
  });

  const done = packing.items.filter((i) => i.done).length;

  return (
    <div className="space-y-4">
      <PageTitle emoji="🧳" title="Essentials" subtitle={`Everything practical for ${city.name}`} />

      <GlassCard className="rise">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[15px] font-semibold">Weather</h2>
          <span className="text-[11px] text-inkmuted">{city.name}</span>
        </div>
        {weather.data ? (
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-sky/15 p-3">
            <span className="text-3xl">🌤</span>
            <div className="min-w-0">
              <p className="font-display text-2xl font-bold leading-none">{weather.data.temp}°C</p>
              <p className="truncate text-[12px] text-inkmuted">
                {weather.data.summary} · H {weather.data.high}° / L {weather.data.low}°
              </p>
              <p className="text-[11px] text-inkmuted">
                Humidity {weather.data.humidity}% · Wind {weather.data.wind} km/h
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-[12px] text-inkmuted">
            {weather.isError ? "Weather unavailable right now." : "Loading weather…"}
          </p>
        )}
      </GlassCard>

      <GlassCard className="rise">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[15px] font-semibold">Packing checklist</h2>
          <span className="text-[11px] text-inkmuted">
            {done}/{packing.items.length}
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {packing.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-black/5">
              <button
                onClick={() =>
                  packing.save(packing.items.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i)))
                }
                className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${
                  item.done ? "gradient-brand text-primary-foreground" : "bg-brand/10 text-brand"
                }`}
                aria-label={item.done ? "Mark as not packed" : "Mark as packed"}
              >
                ✓
              </button>
              <span className={`min-w-0 flex-1 truncate text-sm ${item.done ? "text-inkmuted line-through" : ""}`}>
                {item.text}
              </span>
              <button
                onClick={() => packing.save(packing.items.filter((i) => i.id !== item.id))}
                className="shrink-0 text-inkmuted"
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <AddRow
          value={packInput}
          onChange={setPackInput}
          placeholder="Add something to pack"
          onAdd={() => {
            if (!packInput.trim()) return;
            packing.save([...packing.items, { id: crypto.randomUUID(), text: packInput.trim(), done: false }]);
            setPackInput("");
          }}
        />
      </GlassCard>

      <GlassCard className="rise">
        <h2 className="font-display text-[15px] font-semibold">Itinerary</h2>
        {itinerary.items.length === 0 ? (
          <p className="mt-2 text-[12px] text-inkmuted">Add the plans for your trip, one line at a time.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {itinerary.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-black/5">
                <button
                  onClick={() =>
                    itinerary.save(itinerary.items.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i)))
                  }
                  className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${
                    item.done ? "gradient-brand text-primary-foreground" : "bg-brand/10 text-brand"
                  }`}
                  aria-label="Toggle plan"
                >
                  ✓
                </button>
                <span className={`min-w-0 flex-1 text-sm ${item.done ? "text-inkmuted line-through" : ""}`}>
                  {item.text}
                </span>
                <button
                  onClick={() => itinerary.save(itinerary.items.filter((i) => i.id !== item.id))}
                  className="shrink-0 text-inkmuted"
                  aria-label="Remove plan"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <AddRow
          value={planInput}
          onChange={setPlanInput}
          placeholder="e.g. Day 2 — old town walking tour"
          onAdd={() => {
            if (!planInput.trim()) return;
            itinerary.save([...itinerary.items, { id: crypto.randomUUID(), text: planInput.trim(), done: false }]);
            setPlanInput("");
          }}
        />
      </GlassCard>

      <GlassCard className="rise">
        <h2 className="font-display text-[15px] font-semibold">Emergency</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={`tel:${city.emergency}`}
            className="rounded-2xl bg-coral/15 p-3 text-center"
          >
            <p className="text-[11px] text-inkmuted">Emergency in {city.country}</p>
            <p className="font-display text-2xl font-bold">{city.emergency}</p>
          </a>
          <div className="rounded-2xl bg-white/70 p-3 text-center ring-1 ring-black/5">
            <p className="text-[11px] text-inkmuted">Local currency</p>
            <p className="font-display text-2xl font-bold">{city.currency}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="rise">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[15px] font-semibold">Things to know before travelling</h2>
            <p className="text-[11px] text-inkmuted">Simple precautions for {city.name}</p>
          </div>
          <span className="text-xl" aria-hidden="true">🛡️</span>
        </div>
        <div className="mt-3 space-y-2">
          {TRAVEL_AWARENESS.map((item) => (
            <article key={item.title} className="flex gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-black/5">
              <span className="text-lg" aria-hidden="true">{item.icon}</span>
              <div>
                <h3 className="text-[12px] font-semibold">{item.title}</h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-inkmuted">{item.advice}</p>
              </div>
            </article>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="rise">
        <h2 className="font-display text-[15px] font-semibold">Tips for {city.name}</h2>
        {tips.isPending ? (
          <p className="mt-2 text-[12px] text-inkmuted">Gathering local tips…</p>
        ) : tips.isError ? (
          <p className="mt-2 text-[12px] text-inkmuted">
            {(tips.error as Error | null)?.message || "Tips unavailable right now."}
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {(tips.data?.tips ?? []).map((tip, i) => (
              <li key={i} className="flex gap-2 rounded-2xl bg-white/70 px-3 py-2 text-[12px] ring-1 ring-black/5">
                <span className="shrink-0">💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}

function AddRow({
  value,
  onChange,
  onAdd,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
  placeholder: string;
}) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-2xl bg-white/70 px-3 py-2.5 text-sm ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-brand"
      />
      <button
        onClick={onAdd}
        className="grid size-10 shrink-0 place-items-center rounded-full gradient-brand text-primary-foreground"
        aria-label="Add"
      >
        +
      </button>
    </div>
  );
}
