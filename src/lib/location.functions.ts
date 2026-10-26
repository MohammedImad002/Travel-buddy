import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

type AddressPart = { longText?: string; shortText?: string; types?: string[] };

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  addressComponents?: AddressPart[];
};

const COUNTRY_DETAILS: Record<string, { currency: string; language: string; emergency: string }> = {
  IN: { currency: "INR", language: "Hindi", emergency: "112" },
  AE: { currency: "AED", language: "Arabic", emergency: "999" },
  US: { currency: "USD", language: "English", emergency: "911" },
  GB: { currency: "GBP", language: "English", emergency: "999" },
  AU: { currency: "AUD", language: "English", emergency: "000" },
  CA: { currency: "CAD", language: "English", emergency: "911" },
  SG: { currency: "SGD", language: "English", emergency: "999" },
  MY: { currency: "MYR", language: "Malay", emergency: "999" },
  JP: { currency: "JPY", language: "Japanese", emergency: "110" },
  TH: { currency: "THB", language: "Thai", emergency: "191" },
  TR: { currency: "TRY", language: "Turkish", emergency: "112" },
  FR: { currency: "EUR", language: "French", emergency: "112" },
  IT: { currency: "EUR", language: "Italian", emergency: "112" },
  DE: { currency: "EUR", language: "German", emergency: "112" },
  ES: { currency: "EUR", language: "Spanish", emergency: "112" },
  ZA: { currency: "ZAR", language: "English", emergency: "112" },
};

function connectorHeaders(json = false) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!lovableKey || !mapsKey) throw new Error("Location search is not configured yet.");
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": mapsKey,
    ...(json ? { "Content-Type": "application/json" } : {}),
  };
}

async function readResponse<T>(response: Response): Promise<T> {
  if (response.ok) return (await response.json()) as T;
  const body = await response.text();
  if (response.status === 403) throw new Error("Location search needs attention in Google Maps settings.");
  if (response.status === 429) throw new Error("Location search is busy. Please wait a moment and try again.");
  console.error(`Google Maps request failed [${response.status}]: ${body}`);
  throw new Error("Location search is unavailable right now.");
}

function part(parts: AddressPart[] | undefined, type: string, short = false) {
  const match = parts?.find((item) => item.types?.includes(type));
  return short ? match?.shortText : match?.longText;
}

async function timeZoneFor(lat: number, lon: number) {
  const response = await fetch(
    `${GATEWAY}/maps/api/timezone/json?location=${encodeURIComponent(`${lat},${lon}`)}&timestamp=${Math.floor(Date.now() / 1000)}`,
    { headers: connectorHeaders() },
  );
  const data = await readResponse<{ status?: string; timeZoneId?: string }>(response);
  return data.timeZoneId ?? "UTC";
}

async function normalizePlace(place: GooglePlace) {
  const lat = place.location?.latitude;
  const lon = place.location?.longitude;
  if (typeof lat !== "number" || typeof lon !== "number") throw new Error("That location has no map coordinates.");
  const countryCode = part(place.addressComponents, "country", true) ?? "";
  const country = part(place.addressComponents, "country") ?? "Unknown country";
  const city =
    part(place.addressComponents, "locality") ??
    part(place.addressComponents, "postal_town") ??
    part(place.addressComponents, "administrative_area_level_2") ??
    place.displayName?.text ??
    "Current location";
  const details = COUNTRY_DETAILS[countryCode] ?? { currency: "USD", language: "English", emergency: "112" };
  return {
    id: place.id ?? `geo-${lat.toFixed(5)}-${lon.toFixed(5)}`,
    name: city,
    country,
    timeZone: await timeZoneFor(lat, lon),
    currency: details.currency,
    language: details.language,
    lat,
    lon,
    emergency: details.emergency,
  };
}

const SearchInput = z.object({ query: z.string().trim().min(2).max(100), sessionToken: z.string().uuid() });

export const searchLocations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SearchInput.parse(input))
  .handler(async ({ data }) => {
    const response = await fetch(`${GATEWAY}/places/v1/places:autocomplete`, {
      method: "POST",
      headers: {
        ...connectorHeaders(true),
        "X-Goog-FieldMask": "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text",
      },
      body: JSON.stringify({ input: data.query, sessionToken: data.sessionToken }),
    });
    const result = await readResponse<{
      suggestions?: Array<{ placePrediction?: { placeId?: string; text?: { text?: string } } }>;
    }>(response);
    return {
      suggestions: (result.suggestions ?? []).flatMap((item) => {
        const id = item.placePrediction?.placeId;
        const label = item.placePrediction?.text?.text;
        return id && label ? [{ id, label }] : [];
      }).slice(0, 6),
    };
  });

const PlaceInput = z.object({ placeId: z.string().min(1).max(300), sessionToken: z.string().uuid() });

export const selectLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PlaceInput.parse(input))
  .handler(async ({ data }) => {
    const response = await fetch(
      `${GATEWAY}/places/v1/places/${encodeURIComponent(data.placeId)}?sessionToken=${encodeURIComponent(data.sessionToken)}`,
      {
        headers: {
          ...connectorHeaders(),
          "X-Goog-FieldMask": "id,displayName,formattedAddress,location,addressComponents",
        },
      },
    );
    return await normalizePlace(await readResponse<GooglePlace>(response));
  });

const CoordinatesInput = z.object({ lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180) });

export const locateMe = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CoordinatesInput.parse(input))
  .handler(async ({ data }) => {
    const response = await fetch(
      `${GATEWAY}/maps/api/geocode/json?latlng=${encodeURIComponent(`${data.lat},${data.lon}`)}&result_type=locality|administrative_area_level_2`,
      { headers: connectorHeaders() },
    );
    const result = await readResponse<{
      status?: string;
      results?: Array<{
        place_id?: string;
        formatted_address?: string;
        address_components?: Array<{ long_name?: string; short_name?: string; types?: string[] }>;
        geometry?: { location?: { lat?: number; lng?: number } };
      }>;
    }>(response);
    const first = result.results?.[0];
    if (!first) throw new Error("We couldn't identify your current city.");
    const place: GooglePlace = {
      location: { latitude: first.geometry?.location?.lat ?? data.lat, longitude: first.geometry?.location?.lng ?? data.lon },
    };
    if (first.place_id !== undefined) place.id = first.place_id;
    if (first.formatted_address !== undefined) place.formattedAddress = first.formatted_address;
    if (first.address_components !== undefined) {
      place.addressComponents = first.address_components.map((item) => {
        const component: AddressPart = {};
        if (item.long_name !== undefined) component.longText = item.long_name;
        if (item.short_name !== undefined) component.shortText = item.short_name;
        if (item.types !== undefined) component.types = item.types;
        return component;
      });
    }
    return await normalizePlace(place);
  });