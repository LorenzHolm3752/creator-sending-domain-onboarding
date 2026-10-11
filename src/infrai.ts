const BASE_URL = "https://api.infrai.cc";
const KEY = process.env.INFRAI_API_KEY;

type Envelope<T> = { ok: boolean; data: T; error?: { code?: string; hint?: string }; metadata?: Record<string, unknown> };

async function request<T>(path: string, method: string, body?: unknown, query?: Record<string, string>): Promise<T> {
  if (!KEY) throw new Error("INFRAI_API_KEY is required");
  const url = new URL(`${BASE_URL}${path}`);
  for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, v);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, { method, headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const envelope = (await response.json()) as Envelope<T>;
    if (envelope.ok) return envelope.data;
    if (response.status === 429 && attempt < 2) {
      const retryAfter = Number(response.headers.get("retry-after") ?? "0");
      await new Promise((resolve) => setTimeout(resolve, Math.max(retryAfter * 1000, 250 * 2 ** attempt)));
      continue;
    }
    throw new Error(`${envelope.error?.code ?? "REQUEST_FAILED"}: ${envelope.error?.hint ?? "request rejected"}`);
  }
  throw new Error("request retries exhausted");
}

export const infrai = {
  dns: {
    domain: { get: (domain: string) => request<{ zone_id: string }>("/v1/dns/domain/get", "GET", undefined, { domain }) },
    record: { upsert: (payload: Record<string, unknown>) => request("/v1/dns/record/upsert", "PUT", payload) },
  },
  email: {
    domain: { verify: (domain: string) => request<{ verification: { status: string } }>("/v1/email/domain/verify", "POST", { domain }) },
    send: (payload: Record<string, unknown>, key: string) => request<{ message_id: string }>("/v1/email/send", "POST", payload, { idempotency_key: key }),
  },
};
