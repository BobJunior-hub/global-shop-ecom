"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthStore } from "@/src/store/auth-store";
import { fetchCart, updateCartItem, removeCartItem, clearCartApi } from "../cartApi";
import type { ApiCartGroup, ApiCartVariant } from "@/src/types/cart";
import { useCartCountStore } from "@/src/store/cart-count-store";
import { useCartEntryStore, type CartEntry } from "@/src/store/cart-entry-store";
import { useGuestCartStore } from "@/src/store/guest-cart-store";

export const useApiCart = () => {
  const token = useAuthStore((s) => s.token);
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist?.hasHydrated() ?? false);
  const [apiGroups, setApiGroups] = useState<ApiCartGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState<string | null>(null);

  const setCount = useCartCountStore((s) => s.setCount);
  const guestItems = useGuestCartStore((s) => s.items);
  const guestUpdateQty = useGuestCartStore((s) => s.updateQty);
  const guestRemove = useGuestCartStore((s) => s.removeItem);
  const guestClear = useGuestCartStore((s) => s.clear);

  useEffect(() => {
    if (hydrated) return;
    return useAuthStore.persist?.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  // Derive guest groups from localStorage — no async needed
  const guestGroups = useMemo((): ApiCartGroup[] => {
    const storeMap = new Map<string, ApiCartGroup>();
    for (const item of guestItems) {
      const v = item.variant as ApiCartVariant;
      const store = v?.price_category?.store;
      const storeId = store?.id ?? "__guest__";
      const storeName = store?.name ?? "Mahsulotlar";
      const storeDesc = store?.description ?? "";
      if (!storeMap.has(storeId)) {
        storeMap.set(storeId, {
          store: { id: storeId, name: storeName, description: storeDesc },
          items: [],
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storeMap.get(storeId)!.items.push(item as any);
    }
    return Array.from(storeMap.values());
  }, [guestItems]);

  // Keep CartEntryStore in sync with guest items so product cards show qty
  useEffect(() => {
    if (token) return;
    const entries: Record<string, CartEntry> = {};
    for (const item of guestItems) {
      const variantId = item.variant_id;
      if (variantId) {
        entries[variantId] = {
          totalQty: item.qty,
          subItems: [{ cartItemId: item.id, variantId, qty: item.qty, variantStock: Number.MAX_SAFE_INTEGER }],
          variantPool: [],
        };
      }
    }
    useCartEntryStore.setState({ entries });
    setCount(guestItems.reduce((sum, i) => sum + i.qty, 0));
  }, [token, guestItems, setCount]);

  const load = useCallback(async () => {
    if (!hydrated) return;
    if (!token) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCart(token);
      setApiGroups(data);
      const total = data.reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.qty, 0), 0);
      setCount(total);
      const entries: Record<string, CartEntry> = {};
      for (const group of data) {
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
      useCartEntryStore.setState({ entries });
    } catch {
      setError("Could not load cart.");
    } finally {
      setLoading(false);
    }
  }, [token, setCount, hydrated]);

  useEffect(() => { load(); }, [load]);

  const groups = token ? apiGroups : guestGroups;

  const updateQty = async (id: string, qty: number) => {
    if (!token) {
      if (qty <= 0) { guestRemove(id); return; }
      guestUpdateQty(id, qty);
      return;
    }
    if (qty <= 0) { await removeItem(id); return; }
    setMutating(id);
    try {
      await updateCartItem(token, id, qty);
      await load();
    } catch {
      setError("Failed to update item.");
    } finally {
      setMutating(null);
    }
  };

  const removeItem = async (id: string) => {
    if (!token) {
      guestRemove(id);
      return;
    }
    setMutating(id);
    try {
      await removeCartItem(token, id);
      await load();
    } catch {
      setError("Failed to remove item.");
    } finally {
      setMutating(null);
    }
  };

  const clearCart = async () => {
    if (!token) {
      guestClear();
      setCount(0);
      useCartEntryStore.setState({ entries: {} });
      return;
    }
    try {
      await clearCartApi(token);
      setApiGroups([]);
      setCount(0);
      useCartEntryStore.setState({ entries: {} });
    } catch {
      setError("Failed to clear cart.");
    }
  };

  const totalItems = groups.reduce(
    (sum, g) => sum + g.items.reduce((s, i) => s + i.qty, 0),
    0
  );
  const totalWeightGrams = groups.reduce(
    (sum, g) =>
      sum +
      g.items.reduce((s, i) => {
        const w = (i.variant as ApiCartVariant)?.weight ?? 0;
        return s + w * i.qty;
      }, 0),
    0
  );
  const totalPrice = groups.reduce(
    (sum, g) =>
      sum +
      g.items.reduce((s, i) => {
        const v = i.variant as ApiCartVariant;
        const directPrice = v?.price ?? 0;
        const rawDiscountedPrice = v?.discounted_price ?? null;
        const weight = v?.weight ?? 0;
        const pricePerKg = v?.price_category?.price ?? 0;
        const basePrice =
          directPrice > 0
            ? directPrice
            : weight > 0 && pricePerKg > 0
            ? Math.round((weight / 1000) * pricePerKg)
            : pricePerKg;
        const discountedPrice = rawDiscountedPrice
          ? (directPrice === 0 && weight > 0 ? Math.round((weight / 1000) * rawDiscountedPrice) : rawDiscountedPrice)
          : null;
        const itemPrice = (discountedPrice && discountedPrice < basePrice) ? discountedPrice : basePrice;
        return s + itemPrice * i.qty;
      }, 0),
    0
  );

  const totalDiscount = groups.reduce(
    (sum, g) =>
      sum +
      g.items.reduce((s, i) => {
        const v = i.variant as ApiCartVariant;
        const directPrice = v?.price ?? 0;
        const rawDiscountedPrice = v?.discounted_price ?? null;
        const weight = v?.weight ?? 0;
        const pricePerKg = v?.price_category?.price ?? 0;
        const basePrice =
          directPrice > 0
            ? directPrice
            : weight > 0 && pricePerKg > 0
            ? Math.round((weight / 1000) * pricePerKg)
            : pricePerKg;
        const discountedPrice = rawDiscountedPrice
          ? (directPrice === 0 && weight > 0 ? Math.round((weight / 1000) * rawDiscountedPrice) : rawDiscountedPrice)
          : null;
        if (discountedPrice && discountedPrice < basePrice)
          return s + (basePrice - discountedPrice) * i.qty;
        return s;
      }, 0),
    0
  );

  return {
    groups,
    loading,
    error,
    mutating,
    updateQty,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
    totalDiscount,
    totalWeightGrams,
    isAuthenticated: !!token,
  };
};
