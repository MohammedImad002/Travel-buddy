import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Siren } from "lucide-react";
import { GlassCard } from "@/components/PhoneShell";
import { CityPicker } from "@/components/CityPicker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTrip } from "@/lib/trip";
import { dayIn, timeIn } from "@/lib/cities";
import { loadWeather } from "@/lib/weather";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Travel Buddy — everything you need while traveling" },
      {
        name: "description",
        content:
          "Your travel home base: local time, weather, translator, currency converter, nearby places, food finder and an AI travel assistant.",
      },
      { property: "og:title", content: "Travel Buddy — everything you need while traveling" },
      { property: "og:description", content: "Translate, convert, explore and plan your trip from one simple app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const TOOLS = [
  { to: "/translator", label: "Translator", icon: "🌐", tint: "bg-lilac/15" },
  { to: "/currency", label: "Currency", icon: "💱", tint: "bg-brand/15" },
  { to: "/clock", label: "World Clock", icon: "🕐", tint: "bg-gold/20" },
  { to: "/nearby", label: "Nearby", icon: "📍", tint: "bg-coral/15" },
  { to: "/food", label: "Food", icon: "🍴", tint: "bg-mint/15" },
  { to: "/explore", label: "Explore", icon: "🗺️", tint: "bg-sky/15" },
  { to: "/assistant", label: "Ask AI", icon: "🤖", tint: "bg-rose/15" },
  { to: "/essentials", label: "Essentials", icon: "🧳", tint: "bg-brand/15" },
] as const;

const TRAVEL_CREATORS = [
  { name: "Muslim Travel Girl", focus: "Muslim travel", query: "Muslim Travel Girl" },
  { name: "Have Halal, Will Travel", focus: "Muslim-friendly guides", query: "Have Halal Will Travel" },
  { name: "Kara and Nate", focus: "Travel stories", query: "Kara and Nate" },
  { name: "Drew Binsky", focus: "Local culture", query: "Drew Binsky" },
] as const;

function Home() {
  const { city, current, home, setCity, setCurrent, setHome, ready } = useTrip();
  const [now, setNow] = useState<Date | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const weather = useQuery({
    queryKey: ["weather", current.id],
    queryFn: () => loadWeather(current.lat, current.lon),
    enabled: ready,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div className="space-y-4">
      <GlassCard className="rise">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">You're in</p>
            <h1 className="truncate font-display text-[26px] font-bold leading-none">
              {current.name}, {current.country}
            </h1>
            <p className="mt-1 text-[11px] text-inkmuted">{now ? dayIn(current.timeZone, now) : "Checking local date…"}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-[26px] font-bold leading-none tabular-nums">{now ? timeIn(current.timeZone, now) : "--:--"}</p>
            <p className="text-[10px] font-medium text-inkmuted">Local time</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-2 ring-1 ring-black/5">
          <span className="text-lg">🌤</span>
          <p className="min-w-0 truncate text-sm font-semibold">
            {weather.data ? `${weather.data.temp}° ${weather.data.summary}` : weather.isError ? "Weather unavailable" : "Loading weather…"}
          </p>
          <span className="ml-auto shrink-0 text-xs text-inkmuted">
            {weather.data ? `H ${weather.data.high}° · L ${weather.data.low}°` : ""}
          </span>
        </div>

        <button
          onClick={() => setEditing((v) => !v)}
          className="mt-3 w-full rounded-2xl bg-brand/10 px-3 py-2 text-[12px] font-semibold text-brand"
        >
          {editing ? "Done" : "Change where I am / where I'm from"}
        </button>

        {editing ? (
          <div className="mt-3 grid gap-3">
            <CityPicker label="Where I am now" value={current} onChange={setCurrent} />
            <CityPicker label="Where I'm from" value={home} onChange={setHome} />
            <CityPicker label="My destination" value={city} onChange={setCity} />
          </div>
        ) : null}
      </GlassCard>

      <Link
        to="/assistant"
        className="block rounded-3xl gradient-brand p-4 text-primary-foreground shadow-lg shadow-brand/25 rise"
      >
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full bg-white/20 text-base ring-1 ring-white/30">✦</span>
          <p className="text-sm font-semibold">Ask Travel AI</p>
        </div>
        <p className="mt-2 text-[13px] leading-snug opacity-90">“Find a halal restaurant near me”</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Plan my day", "What's near me", "Is it safe at night?"].map((chip) => (
            <span key={chip} className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium ring-1 ring-white/25">
              {chip}
            </span>
          ))}
        </div>
      </Link>

      <section className="rise">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="font-display text-[15px] font-semibold">Your tools</h2>
          <span className="text-[11px] font-medium text-inkmuted">8</span>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="flex flex-col items-center gap-1.5 rounded-2xl glass p-2.5 transition duration-200 hover:bg-white/85 active:scale-95"
            >
              <span className={`grid size-10 place-items-center rounded-xl text-lg ${tool.tint}`}>{tool.icon}</span>
              <span className="text-center text-[10px] font-semibold leading-tight">{tool.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className="flex w-full items-center justify-center gap-2 rounded-3xl bg-destructive px-4 py-3.5 font-display text-[16px] font-bold text-primary-foreground shadow-lg shadow-destructive/25 rise active:scale-[0.98] transition"
            aria-label={`SOS — emergency help in ${city.name}`}
          >
            <Siren className="size-5" aria-hidden="true" />
            SOS
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-3xl border-white/60 bg-background/95 p-5">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>Emergency help in {city.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Call the local emergency service only if you need urgent police, fire, or medical help.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-center">
            <p className="text-[11px] font-semibold uppercase text-destructive">Emergency number</p>
            <p className="font-display text-3xl font-bold text-destructive">{city.emergency}</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <a href={`tel:${city.emergency}`}>Call {city.emergency}</a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
