import { create } from "zustand";
import { persist } from "zustand/middleware";

type PromoState = {
  promoDiscounts: Record<string, number>;
  setPromoDiscount: (itemId: string, amount: number) => void;
  clearAll: () => void;
};

export const usePromoStore = create<PromoState>()(
  persist(
    (set) => ({
      promoDiscounts: {},
      setPromoDiscount: (itemId, amount) =>
        set((s) => ({ promoDiscounts: { ...s.promoDiscounts, [itemId]: amount } })),
      clearAll: () => set({ promoDiscounts: {} }),
    }),
    { name: "promo-discounts" },
  ),
);

export const useTotalPromoDiscount = () =>
  usePromoStore((s) =>
    Object.values(s.promoDiscounts).reduce((a, b) => a + b, 0),
  );
