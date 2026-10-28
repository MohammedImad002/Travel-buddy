export type City = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  timeZone: string;
  currency: string;
  language: string;
  lat: number;
  lon: number;
  emergency: string;
  flag: string;
  description: string;
};

export const CITIES: City[] = [
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    countryCode: "IN",
    timeZone: "Asia/Kolkata",
    currency: "INR",
    language: "Hindi",
    lat: 19.076,
    lon: 72.8777,
    emergency: "112",
    flag: "🇮🇳",
    description: "The vibrant financial capital of India, known for Bollywood, Marine Drive, and street food.",
  },
  {
    id: "delhi",
    name: "New Delhi",
    country: "India",
    countryCode: "IN",
    timeZone: "Asia/Kolkata",
    currency: "INR",
    language: "Hindi",
    lat: 28.6139,
    lon: 77.209,
    emergency: "112",
    flag: "🇮🇳",
    description: "Historic Mughal monuments, bustling bazaars, street chaat, and the seat of government.",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    countryCode: "AE",
    timeZone: "Asia/Dubai",
    currency: "AED",
    language: "Arabic",
    lat: 25.2048,
    lon: 55.2708,
    emergency: "999",
    flag: "🇦🇪",
    description: "Futuristic skyscrapers, world-class malls, desert safaris, and luxury hospitality.",
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    timeZone: "Asia/Singapore",
    currency: "SGD",
    language: "English",
    lat: 1.3521,
    lon: 103.8198,
    emergency: "999",
    flag: "🇸🇬",
    description: "Garden city with iconic Marina Bay, supertrees, vibrant hawker centres, and pristine safety.",
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    countryCode: "TH",
    timeZone: "Asia/Bangkok",
    currency: "THB",
    language: "Thai",
    lat: 13.7563,
    lon: 100.5018,
    emergency: "191",
    flag: "🇹🇭",
    description: "Golden temples, floating markets, tuk-tuks, and world-renowned night street food.",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    timeZone: "Asia/Tokyo",
    currency: "JPY",
    language: "Japanese",
    lat: 35.6762,
    lon: 139.6503,
    emergency: "110",
    flag: "🇯🇵",
    description: "High-tech metropolis, neon-lit Shibuya, serene Shinto shrines, and Michelin gastronomy.",
  },
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Türkiye",
    countryCode: "TR",
    timeZone: "Europe/Istanbul",
    currency: "TRY",
    language: "Turkish",
    lat: 41.0082,
    lon: 28.9784,
    emergency: "112",
    flag: "🇹🇷",
    description: "Where East meets West across the Bosphorus, packed with Byzantine and Ottoman wonders.",
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",
    timeZone: "Europe/London",
    currency: "GBP",
    language: "English",
    lat: 51.5072,
    lon: -0.1276,
    emergency: "999",
    flag: "🇬🇧",
    description: "Royal landmarks, free world-class museums, West End theatre, and scenic Thames walks.",
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    countryCode: "FR",
    timeZone: "Europe/Paris",
    currency: "EUR",
    language: "French",
    lat: 48.8566,
    lon: 2.3522,
    emergency: "112",
    flag: "🇫🇷",
    description: "City of Light, iconic Eiffel Tower, Louvre art treasures, and charming sidewalk bistros.",
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    countryCode: "IT",
    timeZone: "Europe/Rome",
    currency: "EUR",
    language: "Italian",
    lat: 41.9028,
    lon: 12.4964,
    emergency: "112",
    flag: "🇮🇹",
    description: "Eternal City of the Colosseum, Vatican museums, cobblestone alleys, and authentic gelato.",
  },
  {
    id: "newyork",
    name: "New York",
    country: "USA",
    countryCode: "US",
    timeZone: "America/New_York",
    currency: "USD",
    language: "English",
    lat: 40.7128,
    lon: -74.006,
    emergency: "911",
    flag: "🇺🇸",
    description: "The city that never sleeps: Times Square, Broadway, Central Park, and global cuisine.",
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    countryCode: "AU",
    timeZone: "Australia/Sydney",
    currency: "AUD",
    language: "English",
    lat: -33.8688,
    lon: 151.2093,
    emergency: "000",
    flag: "🇦🇺",
    description: "Sydney Harbour Opera House, Bondi coastal walk, sunny beaches, and relaxed coffee culture.",
  },
  {
    id: "kualalumpur",
    name: "Kuala Lumpur",
    country: "Malaysia",
    countryCode: "MY",
    timeZone: "Asia/Kuala_Lumpur",
    currency: "MYR",
    language: "Malay",
    lat: 3.139,
    lon: 101.6869,
    emergency: "999",
    flag: "🇲🇾",
    description: "Petronas Twin Towers, Batu Caves, vibrant night markets, and rich multicultural dining.",
  },
  {
    id: "capetown",
    name: "Cape Town",
    country: "South Africa",
    countryCode: "ZA",
    timeZone: "Africa/Johannesburg",
    currency: "ZAR",
    language: "English",
    lat: -33.9249,
    lon: 18.4241,
    emergency: "112",
    flag: "🇿🇦",
    description: "Table Mountain, stunning coastal drives, Cape Peninsula wildlife, and wine valleys.",
  },
];

export function findCity(id: string): City {
  return CITIES.find((c) => c.id === id) ?? CITIES[0]!;
}

export function timeIn(timeZone: string, date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }).format(date);
  } catch {
    return date.toTimeString().slice(0, 5);
  }
}

export function dayIn(timeZone: string, date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone,
    }).format(date);
  } catch {
    return date.toDateString();
  }
}

export function offsetHours(timeZone: string, date = new Date()): number {
  try {
    const str = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    }).format(date);
    const match = str.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!match) return 0;
    const sign = match[1] === "-" ? -1 : 1;
    const hours = Number(match[2]);
    const minutes = Number(match[3] ?? "0") / 60;
    return sign * (hours + minutes);
  } catch {
    return 0;
  }
}

/**
 * Finds the closest city in our catalog given GPS coordinates
 */
export function findNearestCity(lat: number, lon: number): City {
  let closest = CITIES[0]!;
  let minDistance = Infinity;

  for (const city of CITIES) {
    const dLat = city.lat - lat;
    const dLon = city.lon - lon;
    const dist = dLat * dLat + dLon * dLon;
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  return closest;
}
