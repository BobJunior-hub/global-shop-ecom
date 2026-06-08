"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/store/auth-store";
import { fetchCart, addCartItem } from "@/src/features/cart/cartApi";
import { useCartCountStore } from "@/src/store/cart-count-store";
import { useCartEntryStore, type CartEntry } from "@/src/store/cart-entry-store";
import { useGuestCartStore, type GuestCartItem } from "@/src/store/guest-cart-store";
import type { ApiCartVariant } from "@/src/types/cart";

export const CartHydrator = () => {
  const token = useAuthStore((s) => s.token);
  const setCount = useCartCountStore((s) => s.setCount);

  // Keep CartEntryStore and count synced with guest store when not logged in
  useEffect(() => {
    if (token) return;

    const sync = (items: GuestCartItem[]) => {
      const entries: Record<string, CartEntry> = {};
      for (const item of items) {
        const variantId = item.variant_id;
        if (variantId) {
          entries[variantId] = {
            totalQty: item.qty,
            subItems: [
              {
                cartItemId: item.id,
                variantId,
                qty: item.qty,
                variantStock: Number.MAX_SAFE_INTEGER,
              },
            ],
            variantPool: [],
          };
        }
      }
      useCartEntryStore.setState({ entries });
      setCount(items.reduce((sum, i) => sum + i.qty, 0));
    };

    const doSync = () => sync(useGuestCartStore.getState().items);

    if (useGuestCartStore.persist?.hasHydrated()) {
      doSync();
    } else {
      useGuestCartStore.persist?.onFinishHydration(doSync);
    }

    const unsubscribe = useGuestCartStore.subscribe((state) => sync(state.items));
    return unsubscribe;
  }, [token, setCount]);

  // When a token arrives, merge guest cart into server cart then reload
  useEffect(() => {
    if (!token) return;

    const guestItems = useGuestCartStore.getState().items;

    const loadAndSync = () =>
      fetchCart(token).then((groups) => {
        const total = groups.reduce(
          (sum, g) => sum + g.items.reduce((s, i) => s + i.qty, 0),
          0
        );
        setCount(total);

        const entries: Record<string, CartEntry> = {};
        for (const group of groups) {
          for (const item of group.items) {
            const v = item.variant as ApiCartVariant;
            const variantId = item.variant_id;
            if (!variantId) continue;
            if (!entries[variantId]) {
              entries[variantId] = { totalQty: 0, subItems: [], variantPool: [] };
            }
            entries[variantId].subItems.push({
              cartItemId: item.id,
              variantId,
              qty: item.qty,
              variantStock: v?.stock ?? Number.MAX_SAFE_INTEGER,
            });
            entries[variantId].totalQty += item.qty;
          }
        }
        useCartEntryStore.setState({ entries });
      });

    if (guestItems.length > 0) {
      Promise.all(
        guestItems.map((item) =>
          addCartItem(token, item.variant_id, item.qty).catch(() => {})
        )
      )
        .then(() => {
          useGuestCartStore.getState().clear();
          return loadAndSync();
        })
        .catch(() => {});
    } else {
      loadAndSync().catch(() => {});
    }
  }, [token, setCount]);

  return null;
};
