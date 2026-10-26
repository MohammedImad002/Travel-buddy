import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GlassCard, PageTitle } from "@/components/PhoneShell";
import { getRates } from "@/lib/travel.functions";
import { useTrip } from "@/lib/trip";

export const Route = createFileRoute("/currency")({
  head: () => ({
    meta: [
      { title: "Currency Converter — Travel Buddy" },
      { name: "description", content: "Convert USD, INR, EUR and more with live exchange rates while you travel." },
      { property: "og:title", content: "Currency Converter — Travel Buddy" },
      { property: "og:description", content: "Live exchange rates for travellers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CurrencyPage,
});

const CURRENCIES = ["USD", "INR", "EUR", "GBP", "AED", "SGD", "THB", "JPY", "TRY", "AUD", "MYR", "ZAR", "CAD", "CHF"];

function CurrencyPage() {
  const { city, home } = useTrip();
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState(home.currency);
  const [to, setTo] = useState(city.currency);

  const rates = useQuery({
    queryKey: ["rates", from],
    queryFn: () => getRates({ data: { base: from } }),
    staleTime: 30 * 60 * 1000,
  });

  const rate = rates.data?.rates?.[to];
  const parsed = Number.parseFloat(amount.replace(/,/g, "")) || 0;
  const converted = rate ? parsed * rate : null;

  const popular = ["USD", "EUR", "GBP", "AED", "JPY"].filter((c) => c !== from);

  return (
    <div className="space-y-4">
      <PageTitle emoji="💱" title="Currency" subtitle="Live exchange rates, updated daily" />

      <GlassCard className="rise">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Amount</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-2xl bg-white/70 px-3 py-3 font-display text-2xl font-bold tabular-nums ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-brand"
          />
        </label>

        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <Select label="From" value={from} onChange={setFrom} />
          <button
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            className="mb-1 grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-brand"
            aria-label="Swap currencies"
          >
            ⇄
          </button>
          <Select label="To" value={to} onChange={setTo} />
        </div>

        <div className="mt-4 rounded-2xl bg-mint/15 p-4 text-center">
          <p className="text-[11px] font-medium text-inkmuted">{parsed.toLocaleString()} {from} equals</p>
          <p className="font-display text-3xl font-bold tabular-nums">
            {converted === null
              ? rates.isError
                ? "—"
                : "…"
              : converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-[12px] font-semibold text-inkmuted">{to}</p>
        </div>

        <p className="mt-2 text-center text-[11px] text-inkmuted">
          {rates.isError
            ? "Rates are unavailable right now. Please try again."
            : rate
              ? `1 ${from} = ${rate.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${to}`
              : "Fetching live rates…"}
        </p>
      </GlassCard>

      <GlassCard className="rise">
        <h2 className="font-display text-[15px] font-semibold">1 {from} in other currencies</h2>
        <div className="mt-3 space-y-2">
          {popular.map((code) => {
            const r = rates.data?.rates?.[code];
            return (
              <div key={code} className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-black/5">
                <span className="text-sm font-semibold">{code}</span>
                <span className="tabular-nums text-sm">
                  {r ? r.toLocaleString(undefined, { maximumFractionDigits: 3 }) : "—"}
                </span>
              </div>
            );
          })}
        </div>
        {rates.data?.updated ? (
          <p className="mt-3 text-center text-[11px] text-inkmuted">Updated {rates.data.updated}</p>
        ) : null}
      </GlassCard>
    </div>
  );
}

function Select({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-white/70 px-3 py-2.5 font-display text-sm font-semibold ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-brand"
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
