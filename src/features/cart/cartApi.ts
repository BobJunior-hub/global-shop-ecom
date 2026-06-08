import type { ApiCartGroup, ApiCartItem, ApiCartResponse } from "@/src/types/cart";
import { authFetch } from "@/src/services/auth-fetch";

const BASE_URL = "/api/v1";

function headers(token: string) {
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

export async function fetchCart(token: string): Promise<ApiCartGroup[]> {
  const res = await authFetch(`${BASE_URL}/cart`, { headers: headers(token), cache: "no-store" });
  if (!res.ok) await extractError(res, "Failed to fetch cart");
  const json: ApiCartResponse = await res.json();
  if (!json.success) throw new Error("API error");
  return json.data ?? [];
}

export async function addCartItem(token: string, variantId: string, qty: number): Promise<ApiCartItem> {
  const res = await authFetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ variant_id: variantId, qty }),
  });
  if (!res.ok) await extractError(res, "Failed to add item to cart");
  const json = await res.json();
  return json.data as ApiCartItem;
}

export async function updateCartItem(token: string, id: string, qty: number): Promise<void> {
  const res = await authFetch(`${BASE_URL}/cart/${id}`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({ qty }),
  });
  if (!res.ok) await extractError(res, "Failed to update cart item");
}

export async function removeCartItem(token: string, id: string): Promise<void> {
  const res = await authFetch(`${BASE_URL}/cart/${id}`, {
    method: "DELETE",
    headers: headers(token),
  });
  if (!res.ok) await extractError(res, "Failed to remove cart item");
}

export async function clearCartApi(token: string): Promise<void> {
  const res = await authFetch(`${BASE_URL}/cart`, {
    method: "DELETE",
    headers: headers(token),
  });
  if (!res.ok) throw new Error("Failed to clear cart");
}
