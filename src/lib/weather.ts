import { getWeather } from "@/lib/travel.functions";

const WEATHER_TEXT: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Foggy", 48: "Freezing fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 80: "Rain showers", 81: "Rain showers", 82: "Heavy showers",
  95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm",
};

// Fetch from the traveller's browser first: the shared server address gets rate-limited (429) by the free weather service.
export async function loadWeather(lat: number, lon: number) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
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
  } catch {
    return await getWeather({ data: { lat, lon } });
  }
}
