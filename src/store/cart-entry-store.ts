import { create } from "zustand";
import { fetchCart } from "@/src/features/cart/cartApi";
import type { ApiCartVariant } from "@/src/types/cart";

export type CartSubItem = {
  cartItemId: string;
  variantId: string;
  qty: number;
  variantStock: number; // Number.MAX_SAFE_INTEGER for guest (no limit)
};

export type CartEntry = {
  totalQty: number;
  subItems: CartSubItem[];
  variantPool: Array<{ id: string; stock: number }>;
};

type CartEntryStore = {
  entries: Record<string, CartEntry>;
  hydratedToken: string | null;
  hydrate: (token: string) => Promise<void>;
  setEntry: (productId: string, entry: CartEntry) => void;
  removeEntry: (productId: string) => void;
  addSubItem: (productId: string, item: CartSubItem, newPool: Array<{ id: string; stock: number }>) => void;
  removeSubItem: (productId: string, cartItemId: string) => void;
  updateSubItemQty: (productId: string, cartItemId: string, qty: number) => void;
  updateGuestQty: (productId: string, qty: number) => void;
};

function buildEntriesFromGroups(groups: Awaited<ReturnType<typeof fetchCart>>): Record<string, CartEntry> {
  const entries: Record<string, CartEntry> = {};
  for (const group of groups) {
    for (const item of group.items) {
      const v = item.variant as ApiCartVariant;
      const variantId = item.variant_id;
      if (!variantId) continue;
      entries[variantId] = {
        totalQty: item.qty,
        subItems: [{ cartItemId: item.id, variantId, qty: item.qty, variantStock: v?.stock ?? Number.MAX_SAFE_INTEGER }],
        variantPool: [],
      };
    }
  }
  return entries;
}

export const useCartEntryStore = create<CartEntryStore>((set, get) => ({
  entries: {},
  hydratedToken: null,

  hydrate: async (token) => {
    if (get().hydratedToken === token) return;
    try {
      const groups = await fetchCart(token);
      set({ entries: buildEntriesFromGroups(groups), hydratedToken: token });
    } catch {
      set({ hydratedToken: token });
    }
  },

  setEntry: (productId, entry) =>
    set((s) => ({ entries: { ...s.entries, [productId]: entry } })),

  removeEntry: (productId) =>
    set((s) => {
      const next = { ...s.entries };
      delete next[productId];
      return { entries: next };
    }),

  addSubItem: (productId, item, newPool) =>
    set((s) => {
      const entry = s.entries[productId];
      if (!entry) return s;
      return {
        entries: {
          ...s.entries,
          [productId]: {
            totalQty: entry.totalQty + item.qty,
            subItems: [...entry.subItems, item],
            variantPool: newPool,
          },
        },
      };
    }),

  removeSubItem: (productId, cartItemId) =>
    set((s) => {
      const entry = s.entries[productId];
      if (!entry) return s;
      const removed = entry.subItems.find((i) => i.cartItemId === cartItemId);
      const newSubItems = entry.subItems.filter((i) => i.cartItemId !== cartItemId);
      if (newSubItems.length === 0) {
        const next = { ...s.entries };
        delete next[productId];
        return { entries: next };
      }
      return {
        entries: {
          ...s.entries,
          [productId]: {
            totalQty: entry.totalQty - (removed?.qty ?? 0),
            subItems: newSubItems,
            variantPool: entry.variantPool,
          },
        },
      };
    }),

  updateSubItemQty: (productId, cartItemId, qty) =>
    set((s) => {
      const entry = s.entries[productId];
      if (!entry) return s;
      const old = entry.subItems.find((i) => i.cartItemId === cartItemId);
      return {
        entries: {
          ...s.entries,
          [productId]: {
            totalQty: entry.totalQty + qty - (old?.qty ?? 0),
            subItems: entry.subItems.map((i) =>
              i.cartItemId === cartItemId ? { ...i, qty } : i
            ),
            variantPool: entry.variantPool,
          },
        },
      };
    }),

  updateGuestQty: (productId, qty) =>
    set((s) => {
      const entry = s.entries[productId];
      if (!entry) return s;
      return {
        entries: {
          ...s.entries,
          [productId]: {
            totalQty: qty,
            subItems: entry.subItems.map((item, idx) =>
              idx === 0 ? { ...item, qty } : item
            ),
            variantPool: entry.variantPool,
          },
        },
      };
    }),
}));
