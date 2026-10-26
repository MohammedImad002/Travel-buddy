import { createFileRoute } from "@tanstack/react-router";
import { voiceError } from "./transcribe";

export const Route = createFileRoute("/api/speech")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "Read aloud is not configured yet." }, { status: 500 });
        const { text } = (await request.json().catch(() => ({}))) as { text?: string };
        const input = (text ?? "").trim().slice(0, 4000);
        if (!input) return Response.json({ error: "Nothing to read." }, { status: 400 });
        const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3.1-flash-tts-preview",
            contents: [{ role: "user", parts: [{ text: input }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
            },
            stream_format: "audio",
          }),
        });
        if (!res.ok) {
          const body = await res.text();
          console.error(`Speech failed [${res.status}]: ${body}`);
          return Response.json({ error: voiceError(res.status, body) }, { status: res.status });
        }
        return new Response(res.body, {
          headers: { "Content-Type": res.headers.get("content-type") ?? "audio/wav" },
        });
      },
    },
  },
});
