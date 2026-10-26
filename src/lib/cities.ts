export type City = {
  id: string;
  name: string;
  country: string;
  timeZone: string;
  currency: string;
  language: string;
  lat: number;
  lon: number;
  emergency: string;
};

export const CITIES: City[] = [
  { id: "mumbai", name: "Mumbai", country: "India", timeZone: "Asia/Kolkata", currency: "INR", language: "Hindi", lat: 19.076, lon: 72.8777, emergency: "112" },
  { id: "delhi", name: "New Delhi", country: "India", timeZone: "Asia/Kolkata", currency: "INR", language: "Hindi", lat: 28.6139, lon: 77.209, emergency: "112" },
  { id: "dubai", name: "Dubai", country: "UAE", timeZone: "Asia/Dubai", currency: "AED", language: "Arabic", lat: 25.2048, lon: 55.2708, emergency: "999" },
  { id: "singapore", name: "Singapore", country: "Singapore", timeZone: "Asia/Singapore", currency: "SGD", language: "English", lat: 1.3521, lon: 103.8198, emergency: "999" },
  { id: "bangkok", name: "Bangkok", country: "Thailand", timeZone: "Asia/Bangkok", currency: "THB", language: "Thai", lat: 13.7563, lon: 100.5018, emergency: "191" },
  { id: "tokyo", name: "Tokyo", country: "Japan", timeZone: "Asia/Tokyo", currency: "JPY", language: "Japanese", lat: 35.6762, lon: 139.6503, emergency: "110" },
  { id: "istanbul", name: "Istanbul", country: "Türkiye", timeZone: "Europe/Istanbul", currency: "TRY", language: "Turkish", lat: 41.0082, lon: 28.9784, emergency: "112" },
  { id: "london", name: "London", country: "United Kingdom", timeZone: "Europe/London", currency: "GBP", language: "English", lat: 51.5072, lon: -0.1276, emergency: "999" },
  { id: "paris", name: "Paris", country: "France", timeZone: "Europe/Paris", currency: "EUR", language: "French", lat: 48.8566, lon: 2.3522, emergency: "112" },
  { id: "rome", name: "Rome", country: "Italy", timeZone: "Europe/Rome", currency: "EUR", language: "Italian", lat: 41.9028, lon: 12.4964, emergency: "112" },
  { id: "newyork", name: "New York", country: "USA", timeZone: "America/New_York", currency: "USD", language: "English", lat: 40.7128, lon: -74.006, emergency: "911" },
  { id: "sydney", name: "Sydney", country: "Australia", timeZone: "Australia/Sydney", currency: "AUD", language: "English", lat: -33.8688, lon: 151.2093, emergency: "000" },
  { id: "kualalumpur", name: "Kuala Lumpur", country: "Malaysia", timeZone: "Asia/Kuala_Lumpur", currency: "MYR", language: "Malay", lat: 3.139, lon: 101.6869, emergency: "999" },
  { id: "capetown", name: "Cape Town", country: "South Africa", timeZone: "Africa/Johannesburg", currency: "ZAR", language: "English", lat: -33.9249, lon: 18.4241, emergency: "112" },
];

export function findCity(id: string): City {
  return CITIES.find((c) => c.id === id) ?? CITIES[0] ?? {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    timeZone: "Asia/Kolkata",
    currency: "INR",
    language: "Hindi",
    lat: 19.076,
    lon: 72.8777,
    emergency: "112",
  };
}

export function timeIn(timeZone: string, date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
}

export function dayIn(timeZone: string, date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone,
  }).format(date);
}

export function offsetHours(timeZone: string, date = new Date()) {
  const tz = new Date(date.toLocaleString("en-US", { timeZone }));
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round(((tz.getTime() - utc.getTime()) / 3600000) * 10) / 10;
}
