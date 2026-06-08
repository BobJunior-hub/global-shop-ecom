import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "@/src/types/order";
import type { CartItem } from "@/src/types/cart";

type OrdersStore = {
  orders: Order[];
  addOrder: (items: CartItem[], total: number) => void;
};

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (items, total) => {
        const order: Order = {
          id: `ORD-${Date.now()}`,
          items,
          total,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [order, ...state.orders] }));
      },
    }),
    { name: "al-baraka-orders" }
  )
);
