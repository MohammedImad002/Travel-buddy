import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export type ChatTurn = { role: "user" | "assistant"; content: string };

function client() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet.");
  return createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: {
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

const CREDITS_MESSAGE =
  "Travel Buddy's AI credits have run out. Top up AI credits in Lovable to switch the AI features back on.";

type GatewayBody = {
  type?: string;
  message?: string;
  props?: { requires?: string; retryable?: boolean };
};

/**
 * The SDK wraps stream failures in `AI_NoOutputGeneratedError`, which carries no
 * status code. The real failure (with its HTTP status and response body) only
 * shows up as the `error` part of the stream, so status lookup happens there.
 */
function gatewayStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const e = error as { statusCode?: number; status?: number };
  return e.statusCode ?? e.status;
}

function gatewayBody(error: unknown): GatewayBody | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const raw = (error as { responseBody?: unknown }).responseBody;
  if (typeof raw !== "string") return undefined;
  try {
    return JSON.parse(raw) as GatewayBody;
  } catch {
    return undefined;
  }
}

function friendlyAiError(error: unknown): Error {
  const status = gatewayStatus(error);
  const body = gatewayBody(error);
  const requires = body?.props?.requires;

  if (status === 402 || body?.type === "payment_required" || requires === "top_up") {
    return new Error(CREDITS_MESSAGE);
  }
  if (status === 403 || requires === "admin_action") {
    return new Error("AI access is blocked for this workspace right now.");
  }
  if (status === 429) {
    return new Error("The AI is busy right now. Please try again in a moment.");
  }
  if (status === 401) {
    return new Error("AI is not configured yet.");
  }
  return new Error("The AI couldn't respond just now. Please try again.");
}

/** Runs a reasoning-model call on the gateway Responses API and returns the final text. */
export async function askModel(opts: {
  system: string;
  messages: ChatTurn[];
  effort?: "low" | "medium";
}): Promise<string> {
  const lovable = client();
  const result = streamText({
    model: lovable.responses("openai/gpt-6-astra"),
    system: opts.system,
    messages: opts.messages,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: opts.effort ?? "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  let text = "";
  let streamError: unknown;
  for await (const part of result.fullStream) {
    if (part.type === "text-delta") text += part.text;
    else if (part.type === "error") streamError = part.error;
  }

  const answer = text.trim();
  if (!answer) {
    console.error(streamError ?? new Error("The AI returned no text."));
    throw friendlyAiError(streamError ?? new Error("The AI returned no text."));
  }
  return answer;
}

/** Asks for JSON and parses it defensively. */
export async function askModelJson<T>(opts: {
  system: string;
  prompt: string;
  fallback: T;
}): Promise<T> {
  const text = await askModel({
    system: `${opts.system}\n\nReply with raw JSON only. No markdown fences, no commentary.`,
    messages: [{ role: "user", content: opts.prompt }],
  });
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.search(/[[{]/);
  if (start === -1) return opts.fallback;
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    return opts.fallback;
  }
}
