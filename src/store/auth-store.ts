import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/src/types/user";
import { useCartEntryStore } from "./cart-entry-store";
import { useCartStore } from "./cart-store";
import Cookie from "js-cookie";

const BASE_URL = "/api/v1";

type AuthStore = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, storeId?: string) => Promise<boolean>;
  register: (username: string, password: string, passwordConfirm: string, storeId?: string) => Promise<boolean>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (username, password, storeId) => {
        if (!username || !password) return false;
        try {
          const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, ...(storeId && { store_id: storeId }) }),
          });
          if (res.status !== 200) return false;
          const json = await res.json();
          if (!json.success) return false;
          const { access_token: token, refresh_token: refreshToken, ...userData } = json.data;
          if (!token) return false;
          set({ token, refreshToken: refreshToken ?? null, isAuthenticated: true, user: { username, ...userData } as User });
          Cookie.set("al-baraka-session", token);
          return true;
        } catch {
          return false;
        }
      },

      register: async (username, password, passwordConfirm, storeId) => {
        if (!username || !password) return false;
        try {
          const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, password_confirm: passwordConfirm, ...(storeId && { store_id: storeId }) }),
          });
          if (res.status !== 201) return false;
          const json = await res.json();
          if (!json.success) return false;
          set({ user: json.data });
          return true;
        } catch {
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
        Cookie.remove("al-baraka-session");
        useCartEntryStore.setState({ entries: {}, hydratedToken: null });
        useCartStore.setState({ items: [] });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) return false;
        try {
          const res = await fetch("/api/v1/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          if (!res.ok) return false;
          const json = await res.json();
          const newToken = json.data?.access_token ?? json.access_token;
          if (!newToken) return false;
          set({ token: newToken });
          Cookie.set("al-baraka-session", newToken);
          return true;
        } catch {
          return false;
        }
      },
    }),
    { name: "al-baraka-auth" }
  )
);
