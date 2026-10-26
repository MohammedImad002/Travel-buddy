import { Loader2, Mic, Square, Volume2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

function encodeWav(chunks: Float32Array[], sampleRate: number): Blob {
  const length = chunks.reduce((s, c) => s + c.length, 0);
  const buf = new ArrayBuffer(44 + length * 2);
  const v = new DataView(buf);
  const tag = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  tag(0, "RIFF");
  v.setUint32(4, 36 + length * 2, true);
  tag(8, "WAVE");
  tag(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  tag(36, "data");
  v.setUint32(40, length * 2, true);
  let o = 44;
  for (const c of chunks)
    for (const x of c) {
      const s = Math.max(-1, Math.min(1, x));
      v.setInt16(o, s * (s < 0 ? 32768 : 32767), true);
      o += 2;
    }
  return new Blob([buf], { type: "audio/wav" });
}

async function errorText(res: Response) {
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  return data?.error ?? "Voice didn't work just now. Please try again.";
}

/** Tap to start speaking, tap again to stop; the spoken words are passed to onText. */
export function MicButton({ onText, disabled }: { onText: (text: string) => void; disabled?: boolean }) {
  const [state, setState] = useState<"idle" | "recording" | "working">("idle");
  const stopRef = useRef<(() => Promise<Blob>) | null>(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const node = ctx.createScriptProcessor(4096, 1, 1);
      const chunks: Float32Array[] = [];
      node.onaudioprocess = (e) => chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      source.connect(node);
      node.connect(ctx.destination);
      stopRef.current = async () => {
        stream.getTracks().forEach((t) => t.stop());
        node.disconnect();
        source.disconnect();
        const blob = encodeWav(chunks, ctx.sampleRate);
        await ctx.close();
        return blob;
      };
      setState("recording");
    } catch {
      toast.error("Please allow microphone access to speak.");
    }
  };

  const stop = async () => {
    const stopFn = stopRef.current;
    stopRef.current = null;
    if (!stopFn) return;
    setState("working");
    try {
      const blob = await stopFn();
      if (blob.size < 4096) throw new Error("I didn't hear anything. Please try again.");
      const form = new FormData();
      form.append("file", new File([blob], "recording.wav", { type: "audio/wav" }));
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!res.ok) throw new Error(await errorText(res));
      const { text } = (await res.json()) as { text: string };
      if (!text) throw new Error("I didn't catch that. Please try again.");
      onText(text);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setState("idle");
    }
  };

  return (
    <button
      type="button"
      onClick={state === "recording" ? stop : start}
      disabled={disabled || state === "working"}
      className={`grid size-9 place-items-center rounded-full disabled:opacity-50 ${
        state === "recording" ? "animate-pulse bg-destructive text-destructive-foreground" : "bg-brand/10 text-brand"
      }`}
      aria-label={state === "recording" ? "Stop speaking" : "Speak"}
      title={state === "recording" ? "Tap to stop" : "Speak"}
    >
      {state === "working" ? (
        <Loader2 className="size-4 animate-spin" />
      ) : state === "recording" ? (
        <Square className="size-4" />
      ) : (
        <Mic className="size-4" />
      )}
    </button>
  );
}

/** Reads the given text aloud. Tap again to stop. */
export function SpeakButton({ text, className = "" }: { text: string; className?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = async () => {
    if (state === "playing") {
      audioRef.current?.pause();
      setState("idle");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(await errorText(res));
      const url = URL.createObjectURL(await res.blob());
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setState("idle");
        URL.revokeObjectURL(url);
      };
      await audio.play();
      setState("playing");
    } catch (e) {
      toast.error((e as Error).message);
      setState("idle");
    }
  };

  return (
    <button
      type="button"
      onClick={play}
      disabled={state === "loading"}
      className={`inline-grid size-8 place-items-center rounded-full bg-brand/10 text-brand disabled:opacity-60 ${className}`}
      aria-label={state === "playing" ? "Stop reading" : "Listen"}
      title="Listen"
    >
      {state === "loading" ? (
        <Loader2 className="size-4 animate-spin" />
      ) : state === "playing" ? (
        <Square className="size-3.5" />
      ) : (
        <Volume2 className="size-4" />
      )}
    </button>
  );
}
