import { createFileRoute } from "@tanstack/react-router";

const MAX_BYTES = 12 * 1024 * 1024;

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "Voice input is not configured yet." }, { status: 500 });
        const declared = Number(request.headers.get("content-length") ?? 0);
        if (declared > MAX_BYTES) return Response.json({ error: "Recording is too long." }, { status: 413 });
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File) || !file.size || file.size > MAX_BYTES || !file.type.startsWith("audio/")) {
          return Response.json({ error: "Please record again." }, { status: 400 });
        }
        const upstream = new FormData();
        upstream.append("model", "google/gemini-3.5-transcribe");
        upstream.append("file", file, file.name || "recording.wav");
        upstream.append("response_format", "json");
        const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}` },
          body: upstream,
        });
        const body = await res.text();
        if (!res.ok) {
          console.error(`Transcription failed [${res.status}]: ${body}`);
          return Response.json({ error: voiceError(res.status, body) }, { status: res.status });
        }
        try {
          const data = JSON.parse(body) as { text?: string };
          return Response.json({ text: (data.text ?? "").trim() });
        } catch {
          return Response.json({ text: body.trim() });
        }
      },
    },
  },
});

export function voiceError(status: number, body: string): string {
  try {
    const msg = (JSON.parse(body) as { message?: string; error?: { message?: string } });
    const m = msg.message ?? msg.error?.message;
    if (status === 402) return m ?? "Travel Buddy's AI credits have run out. Top up AI credits in Lovable.";
    if (status === 403) return m ?? "AI access is blocked for this workspace right now.";
  } catch {
    /* ignore */
  }
  if (status === 402) return "Travel Buddy's AI credits have run out. Top up AI credits in Lovable.";
  if (status === 429) return "The AI is busy right now. Please try again in a moment.";
  return "Voice didn't work just now. Please try again.";
}
