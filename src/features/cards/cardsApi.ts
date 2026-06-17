import type { ApiCard, ApiCardResponse, ApiCardsResponse } from "@/src/types/card";
import { authFetch } from "@/src/services/auth-fetch";

const BASE_URL = "/api/v1";

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function extractError(res: Response, fallback: string): Promise<never> {
  try {
    const body = await res.json();
    throw new Error(body?.message ?? body?.error ?? fallback);
  } catch (e) {
    if (e instanceof Error && e.message !== fallback) throw e;
    throw new Error(fallback);
  }
}

export async function fetchCards(params?: {
  page?: number;
  limit?: number;
  sort?: string;
}): Promise<{ data: ApiCard[]; meta: ApiCardsResponse["meta_data"] }> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.sort) query.set("sort", params.sort);
  const url = `${BASE_URL}/cards${query.size ? `?${query}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) await extractError(res, "Failed to fetch cards");
  const json: ApiCardsResponse = await res.json();
  return { data: json.data, meta: json.meta_data };
}

export async function fetchCardById(id: string): Promise<ApiCard | null> {
  try {
    const res = await fetch(`${BASE_URL}/cards/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json: ApiCardResponse = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function fetchCardsByStore(storeId: string): Promise<ApiCard[]> {
  try {
    const res = await fetch(`${BASE_URL}/stores/${storeId}/cards`, { cache: "no-store" });
    if (!res.ok) return [];
    const json: ApiCardsResponse = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function createCard(
  token: string,
  payload: { number: string; store_id: string }
): Promise<ApiCard> {
  const res = await authFetch(`${BASE_URL}/cards`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) await extractError(res, "Failed to create card");
  const json: ApiCardResponse = await res.json();
  return json.data;
}

export async function updateCard(
  token: string,
  id: string,
  payload: Partial<{ number: string; store_id: string }>
): Promise<ApiCard> {
  const res = await authFetch(`${BASE_URL}/cards/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) await extractError(res, "Failed to update card");
  const json: ApiCardResponse = await res.json();
  return json.data;
}
