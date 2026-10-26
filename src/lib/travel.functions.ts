import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ---------- Translator ----------

const TranslateInput = z.object({
  text: z.string().min(1).max(2000),
  from: z.string().min(2).max(40),
  to: z.string().min(2).max(40),
});

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranslateInput.parse(input))
  .handler(async ({ data }) => {
    const { askModelJson } = await import("./ai.server");
    return await askModelJson<{ translation: string; pronunciation: string; note: string }>({
      system:
        "You are a travel translator. Translate naturally the way a local would say it. Return JSON with keys: translation, pronunciation (simple latin-letter phonetics), note (one short usage tip).",
      prompt: `Translate from ${data.from} to ${data.to}:\n\n${data.text}`,
      fallback: { translation: "", pronunciation: "", note: "Translation unavailable, please try again." },
    });
  });

// ---------- Places (nearby / food / explore) ----------

export type Place = {
  name: string;
  category: string;
  area: string;
  description: string;
  priceLevel: string;
  rating: number;
  openHint: string;
};

const PlacesInput = z.object({
  city: z.string().min(1).max(80),
  country: z.string().min(1).max(80),
  kind: z.string().min(1).max(60),
  note: z.string().max(200).optional(),
});

export const findPlaces = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlacesInput.parse(input))
  .handler(async ({ data }) => {
    const { askModelJson } = await import("./ai.server");
    const result = await askModelJson<{ places: Place[] }>({
      system:
        "You are a local travel guide. Suggest real, well-known places that actually exist in the given city. Return JSON: { places: [{ name, category, area, description (max 15 words), priceLevel (e.g. $, $$, $$$), rating (number 3.5-5), openHint (e.g. 'Open till 11 PM') }] }. Give exactly 8 places.",
      prompt: `City: ${data.city}, ${data.country}. Looking for: ${data.kind}. ${data.note ?? ""}`,
      fallback: { places: [] },
    });
    return { places: (result.places ?? []).slice(0, 8) };
  });

// ---------- Souvenirs ----------

export type Souvenir = {
  item: string;
  buyAt: string;
  area: string;
  why: string;
  priceTier: "Budget-friendly" | "Mid-range" | "Premium";
};

const SouvenirsInput = z.object({
  city: z.string().min(1).max(80),
  country: z.string().min(1).max(80),
});

export const findSouvenirs = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SouvenirsInput.parse(input))
  .handler(async ({ data }) => {
    const { askModelJson } = await import("./ai.server");
    const result = await askModelJson<{ souvenirs: Souvenir[] }>({
      system:
        'You are a practical local shopping guide. Return JSON: { souvenirs: [{ item, buyAt, area, why (max 12 words), priceTier }] }. Suggest exactly 6 authentic things to buy. buyAt must name a real market, shop, or shopping district. priceTier must be exactly "Budget-friendly", "Mid-range", or "Premium". Use budget-friendly terminology exclusively.',
      prompt: `Destination: ${data.city}, ${data.country}`,
      fallback: { souvenirs: [] },
    });
    return { souvenirs: (result.souvenirs ?? []).slice(0, 6) };
  });

// ---------- Travel AI assistant ----------

const AskInput = z.object({
  question: z.string().min(1).max(1000),
  city: z.string().min(1).max(80),
  country: z.string().min(1).max(80),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(20)
    .default([]),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AskInput.parse(input))
  .handler(async ({ data }) => {
    const { askModel } = await import("./ai.server");
    const answer = await askModel({
      system: `You are Travel Buddy, a warm, practical travel assistant. The traveller is currently in ${data.city}, ${data.country}. Answer with short paragraphs and bullet points in markdown-free plain text. Be concrete: name real places, give approximate prices in the local currency, and mention travel time. Always describe lower-cost options as “budget-friendly”. Keep answers under 180 words unless asked for a full plan.`,
      messages: [...data.history, { role: "user" as const, content: data.question }],
    });
    return { answer: answer.trim() || "I couldn't come up with an answer this time. Try asking again." };
  });

// ---------- Travel tips + packing ----------

const TipsInput = z.object({ city: z.string().min(1).max(80), country: z.string().min(1).max(80) });

export const getTravelTips = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TipsInput.parse(input))
  .handler(async ({ data }) => {
    const { askModelJson } = await import("./ai.server");
    return await askModelJson<{ tips: string[] }>({
      system:
        "You give practical destination tips for travellers. Return JSON: { tips: [string] } with exactly 6 tips, each under 20 words, covering transport, money, safety, etiquette, food and connectivity.",
      prompt: `Destination: ${data.city}, ${data.country}`,
      fallback: { tips: [] },
    });
  });

// ---------- Currency ----------

const RatesInput = z.object({ base: z.string().length(3) });

export const getRates = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RatesInput.parse(input))
  .handler(async ({ data }) => {
    const res = await fetch(`https://open.er-api.com/v6/latest/${data.base.toUpperCase()}`);
    if (!res.ok) throw new Error(`Exchange rates unavailable (${res.status})`);
    const json = (await res.json()) as {
      result: string;
      rates?: Record<string, number>;
      time_last_update_utc?: string;
    };
    if (json.result !== "success" || !json.rates) throw new Error("Exchange rates unavailable right now.");
    return { rates: json.rates, updated: json.time_last_update_utc ?? "" };
  });

// ---------- Weather ----------

const WeatherInput = z.object({ lat: z.number(), lon: z.number() });

const WEATHER_TEXT: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Freezing fog",
  51: "Light drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  80: "Rain showers",
  95: "Thunderstorm",
};

export const getWeather = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => WeatherInput.parse(input))
  .handler(async ({ data }) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${data.lat}&longitude=${data.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather unavailable (${res.status})`);
    const json = (await res.json()) as {
      current: { temperature_2m: number; relative_humidity_2m: number; wind_speed_10m: number; weather_code: number };
      daily: { temperature_2m_max: number[]; temperature_2m_min: number[] };
    };
    return {
      temp: Math.round(json.current.temperature_2m),
      humidity: json.current.relative_humidity_2m,
      wind: Math.round(json.current.wind_speed_10m),
      summary: WEATHER_TEXT[json.current.weather_code] ?? "Mixed skies",
      high: Math.round(json.daily.temperature_2m_max[0] ?? json.current.temperature_2m),
      low: Math.round(json.daily.temperature_2m_min[0] ?? json.current.temperature_2m),
    };
  });
