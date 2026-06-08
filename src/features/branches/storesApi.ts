import type { ApiStore, ApiStoresResponse, ApiStoreBanner } from "@/src/types/store";

const BASE_URL = "/api/v1";

export async function fetchStores(): Promise<ApiStore[]> {
  const res = await fetch(`${BASE_URL}/stores`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch stores");
  const json: ApiStoresResponse = await res.json();
  if (!json.success) throw new Error("API error");
  return json.data;
}

export async function fetchStoreById(id: string): Promise<ApiStore | null> {
  try {
    const res = await fetch(`${BASE_URL}/stores/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success) return null;
    return json.data as ApiStore;
  } catch {
    return null;
  }
}

export async function fetchStoreBanners(id: string): Promise<ApiStoreBanner[]> {
  try {
    const res = await fetch(`${BASE_URL}/stores/${id}/banners`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success) return [];
    return json.data as ApiStoreBanner[];
  } catch {
    return [];
  }
}

export async function fetchAllStoreBanners(): Promise<ApiStoreBanner[]> {
  try {
    const stores = await fetchStores();
    const results = await Promise.all(stores.map((s) => fetchStoreBanners(s.id)));
    return results.flat();
  } catch {
    return [];
  }
}
