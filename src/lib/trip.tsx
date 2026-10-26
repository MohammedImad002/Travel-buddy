import { useCallback, useEffect, useState } from "react";
import { CITIES, findCity, type City } from "./cities";

const KEY = "travel-buddy-trip-v1";
const TRIP_EVENT = "travel-buddy-trip-change";

type Trip = { home: City; current: City; destination: City };

const DEFAULT_TRIP: Trip = { home: findCity("delhi"), current: findCity("delhi"), destination: findCity("dubai") };

function read(): Trip {
  if (typeof window === "undefined") return DEFAULT_TRIP;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_TRIP;
    const parsed = JSON.parse(raw) as Partial<Trip> & { homeId?: string; cityId?: string; city?: City };
    const legacyCity = parsed.city ?? findCity(parsed.cityId ?? DEFAULT_TRIP.destination.id);
    return {
      home: parsed.home ?? findCity(parsed.homeId ?? DEFAULT_TRIP.home.id),
      current: parsed.current ?? legacyCity,
      destination: parsed.destination ?? legacyCity,
    };
  } catch {
    return DEFAULT_TRIP;
  }
}

export function useTrip() {
  const [trip, setTrip] = useState<Trip>(DEFAULT_TRIP);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTrip(read());
    setReady(true);
    const syncTrip = (event: Event) => {
      const next = (event as CustomEvent<Trip>).detail;
      if (next) setTrip(next);
    };
    window.addEventListener(TRIP_EVENT, syncTrip);
    return () => window.removeEventListener(TRIP_EVENT, syncTrip);
  }, []);

  const update = useCallback((next: Partial<Trip>) => {
    const merged = { ...read(), ...next };
    setTrip(merged);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent<Trip>(TRIP_EVENT, { detail: merged }));
    } catch {
      /* storage unavailable */
    }
  }, []);

  return {
    city: trip.destination,
    current: trip.current,
    destination: trip.destination,
    home: trip.home,
    cities: CITIES,
    ready,
    setCity: (destination: City) => update({ destination }),
    setCurrent: (current: City) => update({ current }),
    setDestination: (destination: City) => update({ destination }),
    setHome: (home: City) => update({ home }),
  };
}

export function useLocalList<T>(key: string, initial: T[]) {
  const [items, setItems] = useState<T[]>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setItems(JSON.parse(raw) as T[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);

  const save = useCallback(
    (next: T[]) => {
      setItems(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [key],
  );

  return { items, save, ready };
}
