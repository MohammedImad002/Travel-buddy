import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GlassCard, PageTitle } from "@/components/PhoneShell";
import { CityPicker } from "@/components/CityPicker";
import { CITIES, dayIn, offsetHours, timeIn } from "@/lib/cities";
import { useTrip } from "@/lib/trip";

export const Route = createFileRoute("/clock")({
  head: () => ({
    meta: [
      { title: "World Clock — Travel Buddy" },
      { name: "description", content: "Compare your home time with your destination and other cities around the world." },
      { property: "og:title", content: "World Clock — Travel Buddy" },
      { property: "og:description", content: "Compare time zones at a glance while you travel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClockPage,
});

function ClockPage() {
  const { city, home, setCity, setHome } = useTrip();
  // Rendered only after hydration: server and browser format dates differently,
  // which otherwise throws away the whole page with a hydration mismatch.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = now
    ? Math.round((offsetHours(city.timeZone, now) - offsetHours(home.timeZone, now)) * 10) / 10
    : 0;
  const others = CITIES.filter((c) => c.id !== city.id && c.id !== home.id).slice(0, 8);
  const at = (tz: string) => (now ? timeIn(tz, now) : "--:--");
  const on = (tz: string) => (now ? dayIn(tz, now) : "");


  return (
    <div className="space-y-4">
      <PageTitle emoji="🕐" title="World Clock" subtitle="Your time vs. your destination" />

      <GlassCard className="rise">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-black/5">
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-inkmuted">Home</p>
            <p className="truncate text-sm font-semibold">{home.name}</p>
            <p className="font-display text-3xl font-bold tabular-nums">{at(home.timeZone)}</p>
            <p className="text-[11px] text-inkmuted">{on(home.timeZone)}</p>
          </div>
          <div className="rounded-2xl gradient-brand p-3 text-primary-foreground">
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.14em] opacity-80">Destination</p>
            <p className="truncate text-sm font-semibold">{city.name}</p>
            <p className="font-display text-3xl font-bold tabular-nums">{at(city.timeZone)}</p>
            <p className="text-[11px] opacity-80">{on(city.timeZone)}</p>
          </div>
        </div>
        <p className="mt-3 rounded-2xl bg-gold/20 px-3 py-2 text-center text-[12px] font-semibold">
          {!now
            ? "Checking time zones…"
            : diff === 0
              ? "Same time as home"
              : `${city.name} is ${Math.abs(diff)}h ${diff > 0 ? "ahead of" : "behind"} ${home.name}`}
        </p>

        <div className="mt-3 grid gap-3">
          <CityPicker label="Where I'm from" value={home} onChange={setHome} />
          <CityPicker label="Destination" value={city} onChange={setCity} />
        </div>
      </GlassCard>

      <GlassCard className="rise">
        <h2 className="font-display text-[15px] font-semibold">Around the world</h2>
        <div className="mt-3 space-y-2">
          {others.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-black/5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{c.name}</p>
                <p className="truncate text-[11px] text-inkmuted">{c.country}</p>
              </div>
              <p className="shrink-0 font-display text-lg font-bold tabular-nums">{at(c.timeZone)}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
