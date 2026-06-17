"use client";

import Link from "next/link";
import { useState } from "react";
import { useApiCart } from "./hooks/use-api-cart";
import { CartItemRow } from "./components/cart-item-row";
import { CartSummary } from "./components/cart-summary";
import { Loader } from "@/src/components/common/loader";
import { useBrand } from "@/src/lib/brand-context";

export const CartModule = () => {
  const { theme } = useBrand();
  const { groups, loading, error, mutating, updateQty, removeItem, clearCart, totalItems, totalPrice, totalDiscount, totalWeightGrams } = useApiCart();
  const [promoDiscounts, setPromoDiscounts] = useState<Record<string, number>>({});
  const totalPromoDiscount = Object.values(promoDiscounts).reduce((a: number, b: number) => a + b, 0);

  const handlePromoChange = (itemId: string, amount: number) => {
    setPromoDiscounts((prev: Record<string, number>) => ({ ...prev, [itemId]: amount }));
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center py-20">
        <Loader label="Savat yuklanmoqda..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center py-20">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0);

  if (totalCount === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center py-20 text-center gap-4">
        <div className={`flex items-center justify-center w-16 h-16 rounded-full ${theme.iconBg}`}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className={`text-base font-semibold ${theme.primaryText}`}>Savatingiz bo&apos;sh</h3>
          <p className={`text-sm ${theme.text} max-w-xs`}>Boshlash uchun mahsulotlar qo&apos;shing.</p>
        </div>
        <Link
          href="/products"
          className={`px-6 py-3 rounded-xl ${theme.primary} ${theme.primaryHover} text-white text-sm font-semibold transition-colors`}
        >
          Mahsulotlarni ko&apos;rish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Savatingiz</h1>
        <button
          onClick={clearCart}
          className="text-sm text-zinc-400 hover:text-red-500 transition-colors"
        >
          Savatni tozalash
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items grouped by store */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {groups.map((group) => (
            <div key={group.store.id} className="rounded-xl border border-zinc-200 bg-white px-6">
              {/* Store label */}
              <div className="flex items-center gap-2 py-3 border-b border-zinc-100">
                <svg className={`w-4 h-4 shrink-0 ${theme.primaryText}`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
                  <path d="M9 21V12h6v9" />
                </svg>
                <span className="text-xs font-semibold text-zinc-600">{group.store.name}</span>
              </div>
              {group.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  mutating={mutating === item.id}
                  onUpdateQty={updateQty}
                  onRemove={removeItem}
                  onPromoChange={handlePromoChange}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            totalCount={totalItems}
            totalPrice={totalPrice}
            totalDiscount={totalDiscount}
            totalWeightGrams={totalWeightGrams}
            promoDiscount={totalPromoDiscount}
          />
        </div>
      </div>
    </div>
  );
};
