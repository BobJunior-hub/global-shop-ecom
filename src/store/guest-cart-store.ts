import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApiCartVariant } from "@/src/types/cart";

export type GuestCartItem = {
  id: string;
  user_id: "";
  variant_id: string;
  qty: number;
  variant: ApiCartVariant;
};

type GuestCartStore = {
  items: GuestCartItem[];
  addItem: (item: GuestCartItem) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useGuestCartStore = create<GuestCartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.variant_id === item.variant_id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.variant_id === item.variant_id ? { ...i, qty: i.qty + item.qty } : i
              ),
            };
          }
          return { items: [...s.items, item] };
        }),

      updateQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    { name: "al-baraka-guest-cart" }
  )
);
