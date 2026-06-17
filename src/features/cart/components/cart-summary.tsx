"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { useBrand } from "@/src/lib/brand-context";

type Props = {
  totalCount: number;
  totalPrice: number;
  totalDiscount: number;
  totalWeightGrams: number;
  promoDiscount: number;
};

export const CartSummary = ({ totalCount, totalPrice, totalDiscount, totalWeightGrams, promoDiscount }: Props) => {
  const { theme } = useBrand();
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  const [showChoice, setShowChoice] = useState(false);

  // Wait for the persisted auth store to rehydrate from localStorage
  const [hydrated, setHydrated] = useState(
    () => useAuthStore.persist?.hasHydrated() ?? false
  );
  useEffect(() => {
    if (hydrated) return;
    return useAuthStore.persist?.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  const handleCheckout = () => {
    if (!hydrated) return;
    if (token) {
      router.push("/checkout");
    } else {
      setShowChoice(true);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-zinc-900">Buyurtma xulosasi</h2>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-zinc-600">
          <span>Mahsulotlar soni</span>
          <span>{totalCount} ta</span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Mahsulotlar narxi</span>
          <span>{(totalPrice + totalDiscount).toLocaleString()} UZS</span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Umumiy og'irlik</span>
          <span>{(totalWeightGrams / 1000).toFixed(2)} kg</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Chegirma</span>
            <span>− {totalDiscount.toLocaleString()} UZS</span>
          </div>
        )}
        {promoDiscount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Promo chegirma</span>
            <span>− {promoDiscount.toLocaleString()} UZS</span>
          </div>
        )}
        <div className="border-t border-zinc-200 pt-2 flex justify-between font-semibold text-zinc-900">
          <span>Jami</span>
          <span>{(totalPrice - promoDiscount).toLocaleString()} UZS</span>
        </div>
      </div>

      {showChoice ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-zinc-700 text-center">
            Qanday davom etmoqchisiz?
          </p>

          <Link
            href={token ? "/checkout" : "/login?from=/checkout"}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl ${theme.primary} ${theme.primaryHover} text-white text-sm font-semibold transition-colors`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Hisobim bilan to&apos;lash
          </Link>

          <Link
            href="/checkout"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-zinc-300 bg-white text-zinc-800 text-sm font-semibold hover:bg-zinc-100 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Ro'yxatdan o'tmasdan to&apos;lash
          </Link>

          <button
            type="button"
            onClick={() => setShowChoice(false)}
            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors text-center"
          >
            Bekor qilish
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleCheckout}
          disabled={!hydrated}
          className={`w-full py-3 rounded-xl ${theme.primary} ${theme.primaryHover} text-white text-sm font-semibold transition-colors disabled:opacity-50`}
        >
          {!hydrated ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "To'lovga o'tish"}
        </button>
      )}

      <Link
        href="/products"
        className="text-sm text-center text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        Xaridni davom ettirish
      </Link>
    </div>
  );
};
