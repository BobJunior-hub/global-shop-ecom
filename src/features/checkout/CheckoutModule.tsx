"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { useApiCart } from "@/src/features/cart/hooks/use-api-cart";
import { createTransaction, fetchDeliveryTypes, fetchDeliveryTypeById, uploadReceipt } from "./transactionsApi";
import type { ApiDeliveryType } from "./transactionsApi";
import { fetchCardsByStore, fetchCards } from "@/src/features/cards/cardsApi";
import type { ApiCard } from "@/src/types/card";
import { OrderSummary } from "./components/order-summary";
import { useTotalPromoDiscount } from "@/src/store/promo-store";
import { ShippingForm } from "./components/shipping-form";
import { EmptyState } from "@/src/components/common/empty-state";
import { Button } from "@/src/components/common/button";
import { Loader } from "@/src/components/common/loader";
import type { ApiCartItem, ApiCartVariant } from "@/src/types/cart";
import { useBrand } from "@/src/lib/brand-context";

export const CheckoutModule = () => {
  const { theme, displayName } = useBrand();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { groups, loading: cartLoading, totalItems, totalPrice, totalDiscount, totalWeightGrams, clearCart } = useApiCart();
  const totalPromoDiscount = useTotalPromoDiscount();

  const [deliveryTypes, setDeliveryTypes] = useState<ApiDeliveryType[]>([]);
  const [storeCards, setStoreCards] = useState<Map<string, ApiCard[]>>(new Map());
  const [fallbackCards, setFallbackCards] = useState<ApiCard[]>([]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [successDeliveryName, setSuccessDeliveryName] = useState<string | null>(null);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  const copyCard = (card: ApiCard) => {
    navigator.clipboard.writeText(card.number).then(() => {
      setCopiedCardId(card.id);
      setTimeout(() => setCopiedCardId(null), 2000);
    });
  };
  const [successItems, setSuccessItems] = useState<ApiCartItem[]>([]);
  const [successStoreName, setSuccessStoreName] = useState<string>("");
  const currentGroup = groups[currentGroupIndex];
  const isLastGroup = currentGroupIndex >= groups.length - 1;

  useEffect(() => {
    fetchDeliveryTypes().then(setDeliveryTypes);
  }, []);

  useEffect(() => {
    if (groups.length === 0) return;
    Promise.all(
      groups.map((g) =>
        fetchCardsByStore(g.store.id)
          .then((cards) => ({ storeId: g.store.id, cards }))
          .catch(() => ({ storeId: g.store.id, cards: [] as ApiCard[] }))
      )
    ).then((results) => {
      const map = new Map<string, ApiCard[]>();
      results.forEach(({ storeId, cards }) => { if (cards.length) map.set(storeId, cards); });
      setStoreCards(map);
      const hasAny = results.some((r) => r.cards.length > 0);
      if (!hasAny) fetchCards().then((r) => setFallbackCards(r.data)).catch(() => {});
    });
  }, [groups]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentGroup) return;

    const data = new FormData(e.currentTarget);
    const address = data.get("address") as string;
    const phone_number = data.get("phone_number") as string;
    const delivery_type_id = (data.get("delivery_type_id") as string) || deliveryTypes[0]?.id;
    const items = currentGroup.items.map((item) => ({ variant_id: item.variant_id, qty: item.qty }));

    if (!receiptFile) {
      setError("Iltimos tolov chekingizni yuklang");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const receipt = (await uploadReceipt(token, receiptFile)).url;
      await createTransaction(token, { address, phone_number, delivery_type_id, items, receipt });
      const delivery = delivery_type_id ? await fetchDeliveryTypeById(delivery_type_id) : null;
      setSuccessItems(currentGroup.items);
      setSuccessStoreName(currentGroup.store.name);
      setSuccessDeliveryName(delivery?.name ?? "Standart yetkazib berish");
      if (isLastGroup) {
        await clearCart();
        setTimeout(() => router.push("/"), 4000);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Buyurtma yaratib bo'lmadi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center py-20">
        <Loader label="Savat yuklanmoqda..." />
      </div>
    );
  }

  if (successDeliveryName) {
    const receiptTotal = successItems.reduce((sum, item) => {
      const v = item.variant as ApiCartVariant;
      const direct = v?.price ?? 0;
      const kg = v?.price_category?.price ?? 0;
      const w = v?.weight ?? 0;
      const p = direct > 0 ? direct : (w > 0 && kg > 0 ? Math.round((w / 1000) * kg) : kg);
      return sum + p * item.qty;
    }, 0);

    return (
      <div className="flex flex-col flex-1 items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className={`${theme.primary} px-6 py-5 flex flex-col items-center gap-2 text-center`}>
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold italic tracking-widest text-white/50 uppercase">{displayName}</p>
              <h2 className="text-lg font-bold text-white">Buyurtma qabul qilindi!</h2>
            </div>
          </div>

          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex justify-between text-xs text-zinc-400 font-medium">
              <span>{successStoreName}</span>
              <span>{successDeliveryName}</span>
            </div>
            <div className="border-t border-dashed border-zinc-200" />
            <div className="flex flex-col gap-3">
              {successItems.map((item) => {
                const v = item.variant as ApiCartVariant;
                const direct = v?.price ?? 0;
                const kg = v?.price_category?.price ?? 0;
                const w = v?.weight ?? 0;
                const unitPrice = direct > 0 ? direct : (w > 0 && kg > 0 ? Math.round((w / 1000) * kg) : kg);
                const name = v?.product?.name ?? "Mahsulot";
                const meta = [v?.size && `${v.size}`, v?.color].filter(Boolean).join(" / ");
                return (
                  <div key={item.id} className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="text-sm font-semibold text-zinc-900 truncate">{name}</span>
                      {meta && <span className="text-xs text-zinc-400">{meta}</span>}
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-0.5">
                      <span className="text-xs text-zinc-400">{item.qty} × {unitPrice.toLocaleString()}</span>
                      <span className={`text-sm font-semibold ${theme.primaryText}`}>{(unitPrice * item.qty).toLocaleString()} UZS</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-dashed border-zinc-200" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-zinc-500">Jami</span>
              <span className={`text-base font-bold ${theme.primaryText}`}>{receiptTotal.toLocaleString()} UZS</span>
            </div>
          </div>

          <div className="px-6 pb-6">
            {!isLastGroup ? (
              <button
                onClick={() => {
                  setSuccessDeliveryName(null);
                  setSuccessItems([]);
                  setReceiptFile(null);
                  setError(null);
                  setCurrentGroupIndex((i) => i + 1);
                }}
                className={`w-full py-3 rounded-xl ${theme.primary} ${theme.primaryHover} text-white text-sm font-semibold transition-colors`}
              >
                Keyingi do&apos;kon: {groups[currentGroupIndex + 1]?.store.name}
              </button>
            ) : (
              <p className="text-xs text-center text-zinc-400">Xaridingiz uchun rahmat</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center py-20">
        <EmptyState
          title="Buyurtma yo'q"
          description="Avval savatga mahsulot qo'shing."
          action={
            <Link href="/products">
              <Button>Mahsulotlarni ko'rish</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const currentCards = storeCards.get(currentGroup?.store.id ?? "") ?? (storeCards.size === 0 ? fallbackCards : []);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">To&apos;lov</h1>
        {groups.length > 1 && (
          <span className="text-sm text-zinc-500 font-medium">
            Do&apos;kon {currentGroupIndex + 1} / {groups.length}
          </span>
        )}
      </div>

      {currentGroup && groups.length > 1 && (
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-700">
            {currentGroup.store.name}
          </div>
        </div>
      )}

      {currentCards && currentCards.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              {currentGroup?.store.name} — to&apos;lov kartasi
            </p>
            <div className="flex flex-wrap gap-2">
              {currentCards.map((card) => {
                const copied = copiedCardId === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => copyCard(card)}
                    title="Karta raqamini nusxalash"
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer select-none ${
                      copied
                        ? "border-green-400 bg-green-50"
                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors ${copied ? "bg-green-500" : theme.primary}`}>
                      {copied ? (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-mono font-semibold tracking-widest transition-colors ${copied ? "text-green-700" : "text-zinc-800"}`}>
                      {copied ? "Nusxalandi!" : card.number.replace(/(.{4})/g, "$1 ").trim()}
                    </span>
                    {!copied && (
                      <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors ml-1" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <rect x="9" y="9" width="13" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">Karta raqamini nusxalash uchun bosing</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout form — always visible for everyone */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-6">
          <form onSubmit={handleSubmit}>
            <ShippingForm
              loading={submitting}
              deliveryTypes={deliveryTypes}
              onFileChange={setReceiptFile}
              receiptFile={receiptFile}
            />
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          </form>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1">
          <OrderSummary
            groups={currentGroup ? [currentGroup] : []}
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
