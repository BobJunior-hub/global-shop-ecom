import { useAuthStore } from "@/src/store/auth-store";

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status !== 401) return res;

  const refreshed = await useAuthStore.getState().refreshAccessToken();
  if (!refreshed) {
    useAuthStore.getState().logout();
    return res;
  }

  const newToken = useAuthStore.getState().token!;
  const existingHeaders = (init.headers ?? {}) as Record<string, string>;
  return fetch(input, {
    ...init,
    headers: { ...existingHeaders, Authorization: `Bearer ${newToken}` },
  });
}
