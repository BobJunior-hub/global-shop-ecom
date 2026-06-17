"use client";

import Image from "next/image";
import { useState } from "react";
import type { ApiCartItem, ApiCartVariant } from "@/src/types/cart";
import { applyPromoCode } from "@/src/features/influencers/influencersApi";
import { usePromoStore } from "@/src/store/promo-store";
import { useBrand } from "@/src/lib/brand-context";

type Props = {
  item: ApiCartItem;
  mutating: boolean;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onPromoChange: (itemId: string, discountAmount: number) => void;
};

export const CartItemRow = ({ item, mutating, onUpdateQty, onRemove, onPromoChange }: Props) => {
  const { theme } = useBrand();
  const { variant, qty } = item;
  const v = variant as ApiCartVariant;

  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "checking" | "applied" | "invalid">("idle");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const setStorePromo = usePromoStore((s) => s.setPromoDiscount);

  const handleApplyPromo = async () => {
    const code = promoInput.trim();
    if (!code) return;
    setPromoStatus("checking");
    const result = await applyPromoCode(code, v?.product?.id ?? "", v?.product?.store_id);
    if (result) {
      setPromoDiscount(result.discountPercent);
      setPromoStatus("applied");
      const discountedUnitPrice = Math.round(baseItemPrice * (1 - result.discountPercent / 100));
      const amount = (baseItemPrice - discountedUnitPrice) * qty;
      onPromoChange(item.id, amount);
      setStorePromo(item.id, amount);
    } else {
      setPromoDiscount(0);
      setPromoStatus("invalid");
      onPromoChange(item.id, 0);
      setStorePromo(item.id, 0);
    }
  };
  const directPrice = v?.price ?? 0;
  const rawDiscountedPrice = v?.discounted_price ?? null;
  const weight = v?.weight ?? 0;
  const pricePerKg = v?.price_category?.price ?? 0;
  const basePrice = directPrice > 0
    ? directPrice
    : (weight > 0 && pricePerKg > 0 ? Math.round((weight / 1000) * pricePerKg) : pricePerKg);
  const discountedPrice = rawDiscountedPrice
    ? (directPrice === 0 && weight > 0 ? Math.round((weight / 1000) * rawDiscountedPrice) : rawDiscountedPrice)
    : null;
  const baseItemPrice = (discountedPrice && discountedPrice < basePrice) ? discountedPrice : basePrice;
  const itemPrice = promoDiscount > 0
    ? Math.round(baseItemPrice * (1 - promoDiscount / 100))
    : baseItemPrice;
  const image = v?.photo?.[0]?.url ?? "";
  const product = v?.product;
  const name = product?.name ?? "Mahsulot";
  const category = product?.subcategory?.product_category?.name;
  const subcategory = product?.subcategory?.name;

  return (
    <div className={`flex gap-4 py-4 border-b border-zinc-100 last:border-0 transition-opacity ${mutating ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Image */}
      <div className="w-20 h-20 rounded-xl bg-zinc-100 shrink-0 overflow-hidden relative">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1">
            {variant?.color && <span className="text-[10px] font-semibold text-zinc-600 leading-none text-center">{variant.color}</span>}
            {variant?.size && <span className="text-xs font-bold text-zinc-900 leading-none">{variant.size}</span>}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 truncate">{name}</p>

        {(category || subcategory) && (
          <p className="text-xs text-zinc-400 truncate">
            {[category, subcategory].filter(Boolean).join(" › ")}
          </p>
        )}

        {product?.description && (
          <p className="text-xs text-zinc-500 truncate">{product.description}</p>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {variant?.color && (
            <span className="text-xs text-zinc-500">Rang: <span className="font-medium text-zinc-700">{variant.color}</span></span>
          )}
          {variant?.size && (
            <span className="text-xs text-zinc-500">O'lcham: <span className="font-medium text-zinc-700">{variant.size}</span></span>
          )}
          {product?.code && (
            <span className="text-xs text-zinc-400">Kod: {product.code}</span>
          )}
          {variant?.stock != null && (
            <span className={`text-xs font-medium ${variant.stock > 0 ? theme.primaryText : "text-red-500"}`}>
              {variant.stock > 0 ? `${variant.stock} ta mavjud` : "Mavjud emas"}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
          {basePrice > 0 && (
            <span className="text-xs text-zinc-500">
              1 dona:{" "}
              <span className="font-medium text-zinc-700">{itemPrice.toLocaleString()} UZS</span>
              {(promoDiscount > 0 || (discountedPrice && discountedPrice < basePrice)) && (
                <span className="ml-1 line-through text-zinc-400">{basePrice.toLocaleString()}</span>
              )}
            </span>
          )}
          {directPrice === 0 && pricePerKg > 0 && weight === 0 && (
            <span className="text-xs text-zinc-500">1 kg: <span className="font-medium text-zinc-700">{pricePerKg.toLocaleString()} UZS</span></span>
          )}
          {directPrice === 0 && weight > 0 && (
            <span className="text-xs text-zinc-400">({weight}g)</span>
          )}
        </div>

        {/* Promo code — hidden for products already on sale */}
        {!(discountedPrice && discountedPrice < basePrice) && <div className="mt-2">
          {promoStatus === "applied" ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-green-600">−{promoDiscount}% promo qo'llanildi</span>
              <button
                type="button"
                onClick={() => { setPromoStatus("idle"); setPromoDiscount(0); setPromoInput(""); onPromoChange(item.id, 0); setStorePromo(item.id, 0); }}
                className="text-[10px] text-zinc-400 hover:text-zinc-600 underline"
              >
                Bekor
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5 w-fit">
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleApplyPromo(); }}
                  placeholder="Promo kod"
                  className="h-6 w-20 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 text-[10px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={promoStatus === "checking" || !promoInput.trim()}
                  className={`h-6 px-2 rounded-md ${theme.primary} ${theme.primaryHover} text-white text-[10px] font-semibold shrink-0 disabled:opacity-40 transition-colors`}
                >
                  {promoStatus === "checking" ? "..." : "Qo'llash"}
                </button>
              </div>
              {promoStatus === "invalid" && (
                <span className="text-[10px] text-red-500">Kod topilmadi</span>
              )}
            </div>
          )}
        </div>}
      </div>

      {/* Right — qty controls + total + remove */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <button
          onClick={() => onRemove(item.id)}
          className="text-zinc-300 hover:text-red-500 transition-colors"
          aria-label="O'chirish"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-end gap-1.5">
          {itemPrice > 0 && (
            <div className="flex flex-col items-end gap-0.5">
              <span className={`text-sm font-bold ${theme.primaryText}`}>
                {(itemPrice * qty).toLocaleString()} UZS
              </span>
              {(promoDiscount > 0 || (discountedPrice && discountedPrice < basePrice)) && (
                <>
                  <span className="text-xs text-zinc-400 line-through">
                    {(basePrice * qty).toLocaleString()} UZS
                  </span>
                  <span className="text-xs font-semibold text-green-600">
                    −{((basePrice - itemPrice) * qty).toLocaleString()} UZS ({promoDiscount > 0 ? promoDiscount : Math.round(((basePrice - (discountedPrice ?? basePrice)) / basePrice) * 100)}%)
                  </span>
                </>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => qty <= 1 ? onRemove(item.id) : onUpdateQty(item.id, qty - 1)}
              className="w-7 h-7 rounded border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors text-sm"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-medium">{qty}</span>
            <button
              onClick={() => onUpdateQty(item.id, qty + 1)}
              disabled={v?.stock != null && qty >= v.stock}
              className="w-7 h-7 rounded border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
