import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { GlassCard, PageTitle } from "@/components/PhoneShell";
import { MicButton, SpeakButton } from "@/components/VoiceButtons";
import { translateText } from "@/lib/travel.functions";
import { useTrip } from "@/lib/trip";

export const Route = createFileRoute("/translator")({
  head: () => ({
    meta: [
      { title: "Translator — Travel Buddy" },
      { name: "description", content: "Translate text and common travel phrases between languages, with simple pronunciation." },
      { property: "og:title", content: "Translator — Travel Buddy" },
      { property: "og:description", content: "Say it like a local: travel phrases with pronunciation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TranslatorPage,
});

const LANGUAGES = [
  "English",
  "Hindi",
  "Arabic",
  "French",
  "Spanish",
  "German",
  "Italian",
  "Japanese",
  "Thai",
  "Turkish",
  "Malay",
  "Mandarin Chinese",
];

const PHRASES = [
  "Hello, how are you?",
  "How much does this cost?",
  "Where is the nearest toilet?",
  "Is this food vegetarian?",
  "Please take me to this address.",
  "Can you help me, please?",
  "I need a doctor.",
  "Thank you very much!",
];

function TranslatorPage() {
  const { city } = useTrip();
  const [from, setFrom] = useState("English");
  const [to, setTo] = useState(city.language);
  const [text, setText] = useState("");

  const translate = useMutation({
    mutationFn: (value: string) => translateText({ data: { text: value, from, to } }),
  });

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setText(trimmed);
    translate.mutate(trimmed);
  };

  return (
    <div className="space-y-4">
      <PageTitle emoji="🌐" title="Translator" subtitle="Text and travel phrases, said like a local" />

      <GlassCard className="rise">
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <LangSelect label="From" value={from} onChange={setFrom} />
          <button
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            className="mb-1 grid size-9 place-items-center rounded-full bg-brand/10 text-brand"
            aria-label="Swap languages"
          >
            ⇄
          </button>
          <LangSelect label="To" value={to} onChange={setTo} />
        </div>

        <div className="relative mt-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Type or tap the mic to speak…"
            className="w-full resize-none rounded-2xl bg-white/70 px-3 py-3 pr-12 text-sm ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-brand"
          />
          <div className="absolute bottom-3 right-2">
            <MicButton onText={(t) => submit(t)} disabled={translate.isPending} />
          </div>
        </div>
        <button
          onClick={() => submit(text)}
          disabled={translate.isPending || !text.trim()}
          className="mt-3 w-full rounded-2xl gradient-brand px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {translate.isPending ? "Translating…" : "Translate"}
        </button>

        {translate.isError ? (
          <p className="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-[12px] font-medium text-destructive">
            {(translate.error as Error | null)?.message || "Translation failed. Please try again."}
          </p>
        ) : null}


        {translate.data?.translation ? (
          <div className="mt-3 rounded-2xl bg-mint/15 p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-lg font-bold leading-snug">{translate.data.translation}</p>
              <SpeakButton text={translate.data.translation} className="shrink-0" />
            </div>
            {translate.data.pronunciation ? (
              <p className="mt-1 text-[12px] italic text-inkmuted">{translate.data.pronunciation}</p>
            ) : null}
            {translate.data.note ? <p className="mt-2 text-[12px] text-inkmuted">{translate.data.note}</p> : null}
          </div>
        ) : null}
      </GlassCard>

      <GlassCard className="rise">
        <h2 className="font-display text-[15px] font-semibold">Common travel phrases</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {PHRASES.map((phrase) => (
            <button
              key={phrase}
              onClick={() => submit(phrase)}
              className="rounded-full bg-white/70 px-3 py-1.5 text-left text-[12px] font-medium ring-1 ring-black/5 active:scale-95"
            >
              {phrase}
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function LangSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-white/70 px-3 py-2.5 font-display text-sm font-semibold ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-brand"
      >
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
