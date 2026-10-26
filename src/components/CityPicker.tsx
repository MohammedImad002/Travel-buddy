import { useEffect, useRef, useState } from "react";
import { Check, Loader2, LocateFixed, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { CITIES, type City } from "@/lib/cities";
import { locateMe, searchLocations, selectLocation } from "@/lib/location.functions";

export function CityPicker({
  value,
  onChange,
  label,
}: {
  value: City;
  onChange: (city: City) => void;
  label: string;
}) {
  const [query, setQuery] = useState(`${value.name}, ${value.country}`);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; label: string }>>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const sessionToken = useRef("");
  const requestNumber = useRef(0);

  useEffect(() => setQuery(`${value.name}, ${value.country}`), [value.id, value.name, value.country]);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const trimmed = query.trim().slice(0, 100);
    if (!signedIn || trimmed.length < 2 || trimmed === `${value.name}, ${value.country}`) {
      setSuggestions([]);
      return;
    }
    const currentRequest = ++requestNumber.current;
    const timer = window.setTimeout(async () => {
      if (!sessionToken.current) sessionToken.current = window.crypto.randomUUID();
      setSearching(true);
      try {
        const result = await searchLocations({ data: { query: trimmed, sessionToken: sessionToken.current } });
        if (currentRequest === requestNumber.current) setSuggestions(result.suggestions);
      } catch (error) {
        if (currentRequest === requestNumber.current) toast.error(error instanceof Error ? error.message : "Location search failed.");
      } finally {
        if (currentRequest === requestNumber.current) setSearching(false);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [query, signedIn, value.name, value.country]);

  const signIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error(result.error.message);
  };

  const choose = async (placeId: string) => {
    if (!sessionToken.current) return;
    setSearching(true);
    try {
      const city = await selectLocation({ data: { placeId, sessionToken: sessionToken.current } });
      onChange(city);
      setSuggestions([]);
      sessionToken.current = "";
      toast.success(`Location set to ${city.name}, ${city.country}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Location search failed.");
    } finally {
      setSearching(false);
    }
  };

  const track = () => {
    if (!signedIn) {
      toast.error("Sign in first to use worldwide location tracking.");
      return;
    }
    if (!("geolocation" in navigator)) {
      toast.error("Location tracking is not supported on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const city = await locateMe({ data: { lat: coords.latitude, lon: coords.longitude } });
          onChange(city);
          setSuggestions([]);
          toast.success(`You're in ${city.name}, ${city.country}`);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "We couldn't identify your location.");
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        toast.error(error.code === error.PERMISSION_DENIED ? "Allow location access to find where you are." : "We couldn't get your current location.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
    );
  };

  return (
    <div className="relative">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">{label}</span>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 size-4 text-inkmuted" aria-hidden="true" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value.slice(0, 100))}
            maxLength={100}
            onFocus={() => {
              if (query === `${value.name}, ${value.country}`) setQuery("");
            }}
            placeholder="Type any city"
            aria-label={label}
            autoComplete="off"
            className="h-10 rounded-2xl border-0 bg-white/70 py-2.5 pl-9 pr-9 font-display text-sm font-semibold text-ink ring-1 ring-black/5 focus-visible:ring-2 focus-visible:ring-brand"
          />
          {searching ? <Loader2 className="absolute right-3 top-3 size-4 animate-spin text-brand" aria-hidden="true" /> : null}
        </div>
        <Button type="button" variant="secondary" size="icon" onClick={track} disabled={locating} className="size-10 rounded-2xl" title="Track my location" aria-label="Track my location">
          {locating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
        </Button>
      </div>

      {!signedIn ? (
        <div className="mt-1">
          {query.trim().length > 1 && query !== `${value.name}, ${value.country}` ? (
            <p className="text-[11px] font-medium text-coral">To find “{query.trim()}”, sign in first — worldwide search needs it.</p>
          ) : null}
          <Button type="button" variant="link" size="sm" onClick={signIn} className="h-auto justify-start p-0 text-left text-[11px] text-brand">
            Sign in with Google to search worldwide or track my location
          </Button>
        </div>
      ) : null}

      {signedIn && query.trim().length > 1 && suggestions.length === 0 && !searching && query !== `${value.name}, ${value.country}` ? (
        <p className="mt-1 text-[11px] text-inkmuted">No places found yet — try adding the country, e.g. “Bali, Indonesia”.</p>
      ) : null}

      {suggestions.length > 0 ? (
        <div className="absolute left-0 right-12 top-full z-40 mt-1 overflow-hidden rounded-2xl border border-white/60 bg-background/95 p-1 shadow-xl backdrop-blur-xl">
          {suggestions.map((suggestion) => (
            <Button key={suggestion.id} type="button" variant="ghost" onClick={() => void choose(suggestion.id)} className="h-auto w-full justify-start whitespace-normal rounded-xl px-3 py-2.5 text-left text-[12px] font-medium">
              <span className="min-w-0 flex-1">{suggestion.label}</span>
              {suggestion.label === `${value.name}, ${value.country}` ? <Check className="size-4 text-brand" /> : null}
            </Button>
          ))}
        </div>
      ) : null}

      {query.trim().length > 1 && suggestions.length === 0 && !searching && query !== `${value.name}, ${value.country}` ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CITIES.filter((city) => `${city.name} ${city.country}`.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map((city) => (
            <Button key={city.id} type="button" variant="secondary" size="sm" onClick={() => onChange(city)} className="h-auto rounded-full px-2.5 py-1 text-[11px]">
              {city.name}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
