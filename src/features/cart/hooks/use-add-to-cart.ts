"use client";

import { useState } from "react";
import { useAuthStore } from "@/src/store/auth-store";
import { useCartCountStore } from "@/src/store/cart-count-store";
import { useCartEntryStore } from "@/src/store/cart-entry-store";
import { addCartItem, updateCartItem, removeCartItem } from "../cartApi";
import { useGuestCartStore } from "@/src/store/guest-cart-store";
import type { ApiVariant, Product } from "@/src/types/product";

export type GuestCartData = { product: Product; variant: ApiVariant };

export const useAddToCart = () => {
  const token = useAuthStore((s) => s.token);
  const increment = useCartCountStore((s) => s.increment);
  const decrement = useCartCountStore((s) => s.decrement);
  const { entries, setEntry, removeEntry, removeSubItem, updateSubItemQty, updateGuestQty } =
    useCartEntryStore();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const guestAdd = useGuestCartStore((s) => s.addItem);
  const guestUpdateQty = useGuestCartStore((s) => s.updateQty);
  const guestRemove = useGuestCartStore((s) => s.removeItem);

  // Entries are now keyed by variantId so each size+color combination is tracked independently.
  const addToCart = async (
    variantId: string,
    qty: number,
    productId: string,
    guestData?: GuestCartData
  ) => {
    if (!token) {
      if (!guestData) return;
      const { product, variant } = guestData;
      const guestId = `guest-${productId}-${variantId}`;
      const existing = entries[variantId];
      if (existing) {
        const newQty = existing.totalQty + qty;
        guestUpdateQty(existing.subItems[0].cartItemId, newQty);
        updateGuestQty(variantId, newQty);
      } else {
        guestAdd({
          id: guestId,
          user_id: "",
          variant_id: variantId,
          qty,
          variant: {
            id: variant.id,
            size: variant.size,
            color: variant.color,
            price: variant.price,
            discounted_price: variant.discounted_price ?? null,
            weight: variant.weight,
            stock: variant.stock,
            price_category: variant.price_category ?? null,
            photo: variant.photo,
            product: {
              id: product.id,
              name: product.name,
              description: product.description,
              subcategory: product.subcategory_id
                ? {
                    id: product.subcategory_id,
                    name: product.subcategory,
                    product_category: {
                      id: product.category_id,
                      name: product.category,
                    },
                  }
                : undefined,
            },
          },
        });
        setEntry(variantId, {
          totalQty: qty,
          subItems: [{ cartItemId: guestId, variantId, qty, variantStock: Number.MAX_SAFE_INTEGER }],
          variantPool: [],
        });
      }
      return;
    }

    setAddingId(variantId);
    setError(null);
    try {
      const item = await addCartItem(token, variantId, qty);
      increment();
      setEntry(variantId, {
        totalQty: qty,
        subItems: [
          {
            cartItemId: item.id,
            variantId,
            qty,
            variantStock: guestData?.variant.stock ?? Number.MAX_SAFE_INTEGER,
          },
        ],
        variantPool: [],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Savatga qo'shib bo'lmadi.");
    } finally {
      setAddingId(null);
    }
  };

  const changeQty = async (variantId: string, delta: number, stock?: number) => {
    const entry = entries[variantId];
    if (!entry) return;
    const newTotal = entry.totalQty + delta;
    if (stock != null && newTotal > stock) return;
    if (newTotal < 0) return;
    setAddingId(variantId);
    try {
      if (!token) {
        const guestItem = entry.subItems[0];
        if (!guestItem) return;
        if (newTotal <= 0) {
          guestRemove(guestItem.cartItemId);
          removeEntry(variantId);
        } else {
          guestUpdateQty(guestItem.cartItemId, newTotal);
          updateGuestQty(variantId, newTotal);
        }
      } else {
        const subItem = entry.subItems[0];
        if (!subItem) return;
        if (delta > 0) {
          const newQty = subItem.qty + 1;
          await updateCartItem(token, subItem.cartItemId, newQty);
          increment();
          updateSubItemQty(variantId, subItem.cartItemId, newQty);
        } else {
          if (subItem.qty <= 1) {
            await removeCartItem(token, subItem.cartItemId);
            decrement();
            removeSubItem(variantId, subItem.cartItemId);
          } else {
            await updateCartItem(token, subItem.cartItemId, subItem.qty - 1);
            decrement();
            updateSubItemQty(variantId, subItem.cartItemId, subItem.qty - 1);
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yangilab bo'lmadi.");
    } finally {
      setAddingId(null);
    }
  };

  return {
    addToCart,
    changeQty,
    isAdding: (variantId: string) => addingId === variantId,
    getQty: (variantId: string) => entries[variantId]?.totalQty ?? 0,
    error,
  };
};
