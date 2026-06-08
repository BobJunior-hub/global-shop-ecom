import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/src/types/product";

type FavouritesStore = {
  items: Product[];
  toggle: (product: Product) => void;
};

export const useFavouritesStore = create<FavouritesStore>()(
  persist(
    (set) => ({
      items: [],
      toggle: (product) => {
        set((state) => {
          const exists = state.items.some((p) => p.id === product.id);
          return {
            items: exists
              ? state.items.filter((p) => p.id !== product.id)
              : [...state.items, product],
          };
        });
      },
    }),
    { name: "al-baraka-favourites" }
  )
);
