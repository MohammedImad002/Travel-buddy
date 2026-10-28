export type WeatherInfo = {
  temp: number;
  humidity: number;
  wind: number;
  summary: string;
  emoji: string;
  high: number;
  low: number;
  daily: Array<{
    day: string;
    high: number;
    low: number;
    emoji: string;
    summary: string;
  }>;
};

const WEATHER_TEXT: Record<number, { summary: string; emoji: string }> = {
  0: { summary: "Clear sky", emoji: "☀️" },
  1: { summary: "Mainly clear", emoji: "🌤️" },
  2: { summary: "Partly cloudy", emoji: "⛅" },
  3: { summary: "Overcast", emoji: "☁️" },
  45: { summary: "Foggy", emoji: "🌫️" },
  48: { summary: "Freezing fog", emoji: "🌫️" },
  51: { summary: "Light drizzle", emoji: "🌦️" },
  53: { summary: "Drizzle", emoji: "🌦️" },
  55: { summary: "Heavy drizzle", emoji: "🌧️" },
  61: { summary: "Light rain", emoji: "🌧️" },
  63: { summary: "Rain", emoji: "🌧️" },
  65: { summary: "Heavy rain", emoji: "⛈️" },
  71: { summary: "Light snow", emoji: "🌨️" },
  73: { summary: "Snow", emoji: "❄️" },
  75: { summary: "Heavy snow", emoji: "❄️" },
  80: { summary: "Rain showers", emoji: "🌦️" },
  81: { summary: "Rain showers", emoji: "🌧️" },
  82: { summary: "Heavy showers", emoji: "⛈️" },
  95: { summary: "Thunderstorm", emoji: "⛈️" },
  96: { summary: "Thunderstorm", emoji: "⛈️" },
  99: { summary: "Thunderstorm", emoji: "⛈️" },
};

export async function fetchWeather(lat: number, lon: number): Promise<WeatherInfo> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=4&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather error ${res.status}`);
    const json = await res.json();

    const currentCode = json.current.weather_code ?? 0;
    const currentMeta = WEATHER_TEXT[currentCode] ?? { summary: "Pleasant", emoji: "🌤️" };

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date().getDay();

    const dailyForecasts = (json.daily?.temperature_2m_max || []).slice(1, 4).map((max: number, i: number) => {
      const min = json.daily.temperature_2m_min[i + 1] ?? max;
      const code = json.daily.weather_code[i + 1] ?? 0;
      const meta = WEATHER_TEXT[code] ?? { summary: "Clear", emoji: "🌤️" };
      const dayName = days[(today + i + 1) % 7]!;
      return {
        day: dayName,
        high: Math.round(max),
        low: Math.round(min),
        emoji: meta.emoji,
        summary: meta.summary,
      };
    });

    return {
      temp: Math.round(json.current.temperature_2m),
      humidity: json.current.relative_humidity_2m ?? 50,
      wind: Math.round(json.current.wind_speed_10m ?? 10),
      summary: currentMeta.summary,
      emoji: currentMeta.emoji,
      high: Math.round(json.daily?.temperature_2m_max?.[0] ?? json.current.temperature_2m),
      low: Math.round(json.daily?.temperature_2m_min?.[0] ?? json.current.temperature_2m),
      daily: dailyForecasts,
    };
  } catch (error) {
    // Offline fallback
    return {
      temp: 26,
      humidity: 55,
      wind: 12,
      summary: "Pleasant & Mild",
      emoji: "🌤️",
      high: 29,
      low: 21,
      daily: [
        { day: "Tomorrow", high: 28, low: 22, emoji: "☀️", summary: "Clear sky" },
        { day: "Day after", high: 27, low: 20, emoji: "⛅", summary: "Partly cloudy" },
        { day: "Weekend", high: 29, low: 21, emoji: "🌤️", summary: "Sunny intervals" },
      ],
    };
  }
}
