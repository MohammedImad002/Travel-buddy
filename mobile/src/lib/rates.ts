export type CurrencyRates = {
  rates: Record<string, number>;
  base: string;
  updated: string;
};

// Fallback offline baseline exchange rates (relative to USD)
const FALLBACK_RATES_USD: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 86.4,
  AED: 3.67,
  SGD: 1.34,
  THB: 35.8,
  JPY: 154.2,
  TRY: 35.4,
  AUD: 1.55,
  MYR: 4.45,
  ZAR: 18.2,
  CAD: 1.41,
  CHF: 0.89,
};

export const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
];

export async function fetchExchangeRates(base: string): Promise<CurrencyRates> {
  const normBase = base.toUpperCase();
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${normBase}`);
    if (!res.ok) throw new Error(`Rates HTTP error ${res.status}`);
    const json = await res.json();
    if (json.result === "success" && json.rates) {
      return {
        rates: json.rates,
        base: normBase,
        updated: json.time_last_update_utc ?? "Today",
      };
    }
  } catch {
    // Offline calculation using USD anchor
  }

  // Derive cross rates from fallback USD rates
  const baseRateToUSD = FALLBACK_RATES_USD[normBase] ?? 1.0;
  const derivedRates: Record<string, number> = {};
  for (const [code, rateAgainstUSD] of Object.entries(FALLBACK_RATES_USD)) {
    derivedRates[code] = Number((rateAgainstUSD / baseRateToUSD).toFixed(4));
  }

  return {
    rates: derivedRates,
    base: normBase,
    updated: "Cached baseline",
  };
}
