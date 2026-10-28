import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { CITIES, findCity, type City } from "./cities";
import { AppStorage } from "./storage";

const TRIP_STORAGE_KEY = "travel-buddy-trip-v1";

export type TripState = {
  home: City;
  current: City;
  destination: City;
};

const DEFAULT_TRIP: TripState = {
  home: findCity("delhi"),
  current: findCity("delhi"),
  destination: findCity("dubai"),
};

type TripContextType = {
  city: City;
  current: City;
  destination: City;
  home: City;
  cities: City[];
  ready: boolean;
  setCity: (destination: City) => void;
  setCurrent: (current: City) => void;
  setDestination: (destination: City) => void;
  setHome: (home: City) => void;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState<TripState>(DEFAULT_TRIP);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AppStorage.getItem(TRIP_STORAGE_KEY);
        if (raw && mounted) {
          const parsed = JSON.parse(raw);
          const legacyCity = parsed.city ?? findCity(parsed.cityId ?? DEFAULT_TRIP.destination.id);
          setTrip({
            home: parsed.home ?? findCity(parsed.homeId ?? DEFAULT_TRIP.home.id),
            current: parsed.current ?? legacyCity,
            destination: parsed.destination ?? legacyCity,
          });
        }
      } catch {
        // use default
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const update = useCallback((next: Partial<TripState>) => {
    setTrip((prev) => {
      const merged = { ...prev, ...next };
      AppStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(merged)).catch(() => {});
      return merged;
    });
  }, []);

  const value: TripContextType = {
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

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip(): TripContextType {
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return ctx;
}

export function useLocalList<T>(key: string, initial: T[]) {
  const [items, setItems] = useState<T[]>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AppStorage.getItem(key);
        if (raw && mounted) {
          setItems(JSON.parse(raw) as T[]);
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [key]);

  const save = useCallback(
    (next: T[]) => {
      setItems(next);
      AppStorage.setItem(key, JSON.stringify(next)).catch(() => {});
    },
    [key]
  );

  return { items, save, ready };
}
