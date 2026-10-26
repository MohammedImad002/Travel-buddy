import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { PageTitle } from "@/components/PhoneShell";
import { MicButton, SpeakButton } from "@/components/VoiceButtons";
import { askAssistant } from "@/lib/travel.functions";
import { useTrip } from "@/lib/trip";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Travel AI Assistant — Travel Buddy" },
      {
        name: "description",
        content: "Ask anything about your trip: what to do nearby, where to eat halal, or how to plan your day.",
      },
      { property: "og:title", content: "Travel AI Assistant — Travel Buddy" },
      { property: "og:description", content: "Your pocket travel expert, available any time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

type Turn = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What can I do near me today?",
  "Find a halal restaurant nearby",
  "Plan my day",
  "How do I get around on a budget?",
];

function AssistantPage() {
  const { current: city } = useTrip();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const ask = useMutation({
    mutationFn: (question: string) =>
      askAssistant({
        data: {
          question,
          city: city.name,
          country: city.country,
          history: turns.slice(-8),
        },
      }),
    onSuccess: (res) => setTurns((prev) => [...prev, { role: "assistant", content: res.answer }]),
    onError: (error: Error) =>
      setTurns((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error?.message || "Sorry — I couldn't reach my travel brain just now. Please try again.",
        },
      ]),

    onSettled: () => inputRef.current?.focus(),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, ask.isPending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = (value: string) => {
    const question = value.trim();
    if (!question || ask.isPending) return;
    setTurns((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    ask.mutate(question);
  };

  return (
    <div className="flex min-h-[70vh] flex-col">
      <PageTitle emoji="🤖" title="Travel AI" subtitle={`Your guide in ${city.name}`} />

      <div className="flex-1 space-y-3">
        {turns.length === 0 ? (
          <div className="rounded-3xl glass p-4 rise">
            <p className="text-sm font-semibold">Hi! Ask me anything about your trip.</p>
            <p className="mt-1 text-[12px] text-inkmuted">
              I know where you are and can suggest food, plans and practical tips.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full bg-white/70 px-3 py-1.5 text-[12px] font-medium ring-1 ring-black/5 active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {turns.map((turn, i) =>
          turn.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-lg gradient-brand px-4 py-2.5 text-sm text-primary-foreground">
                {turn.content}
              </p>
            </div>
          ) : (
            <div key={i} className="max-w-[92%]">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{turn.content}</p>
              <SpeakButton text={turn.content} className="mt-1" />
            </div>
          ),
        )}

        {ask.isPending ? <p className="animate-pulse text-sm text-inkmuted">Thinking…</p> : null}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-2 mt-4 rounded-3xl glass-strong p-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={2}
          placeholder="Ask about food, plans, transport…"
          className="w-full resize-none bg-transparent px-3 py-2 text-sm outline-none"
        />
        <div className="flex justify-end gap-2">
          <MicButton onText={(t) => send(t)} disabled={ask.isPending} />
          <button
            onClick={() => send(input)}
            disabled={ask.isPending || !input.trim()}
            className="grid size-9 place-items-center rounded-full gradient-brand text-primary-foreground disabled:opacity-50"
            aria-label="Send"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
