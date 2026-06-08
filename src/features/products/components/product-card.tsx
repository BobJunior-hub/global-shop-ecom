"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/src/types/product";
import { useAddToCart } from "@/src/features/cart/hooks/use-add-to-cart";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, changeQty, isAdding, getQty } = useAddToCart();
  const firstVariant = product.variants[0] ?? null;
  const firstVariantId = firstVariant?.id ?? "";
  const qty = getQty(firstVariantId);
  const adding = isAdding(firstVariantId);

  return (
    <div className="group relative flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden hover:shadow-md transition-shadow">

      {/* ── Image + info → navigates to detail page ── */}
      <Link href={`/products/${product.id}`} className="flex flex-col flex-1">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-zinc-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.375 4.5h17.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 16.875V5.625c0-.621.504-1.125 1.125-1.125z" />
              </svg>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-sm font-medium text-zinc-500">Mavjud emas</span>
            </div>
          )}
          {product.discountedPrice && product.discountedPrice < product.price && (
            <span className="absolute top-2 left-2 text-xs font-bold text-green-600 bg-white px-1.5 py-0.5 rounded-full shadow-sm">
              −{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% 🔥
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 p-3 flex-1">
          <div className="flex flex-col gap-0.5 flex-1">
            <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1">{product.name}</h3>

            {product.avgStar > 0 && (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className={`w-3 h-3 ${s <= Math.round(product.avgStar) ? "text-zinc-900" : "text-zinc-300"}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
                <span className="text-[10px] text-zinc-400 ml-0.5">{product.avgStar.toFixed(1)}</span>
              </div>
            )}

            {product.description ? (
              <p className="text-xs text-zinc-500 line-clamp-2">{product.description}</p>
            ) : (
              <p className="text-xs text-zinc-500 capitalize">{product.category}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col gap-0.5">
            {product.price > 0 && (
              <>
                {product.discountedPrice && product.discountedPrice < product.price ? (
                  <>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-base font-bold text-zinc-900">
                        {product.discountedPrice.toLocaleString()} <span className="text-xs font-medium">UZS</span>
                      </span>
                      <span className="text-xs font-medium text-zinc-400 line-through">
                        {product.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-green-600">
                      −{(product.price - product.discountedPrice).toLocaleString()} UZS tejash
                    </span>
                  </>
                ) : (
                  <span className="text-base font-bold text-zinc-900">
                    {product.price.toLocaleString()} <span className="text-xs font-medium text-zinc-400">UZS / dona</span>
                  </span>
                )}
              </>
            )}
            {product.pricePerKg > 0 && (
              <span className="text-sm font-medium text-zinc-600">
                {product.discountedPricePerKg && product.discountedPricePerKg < product.pricePerKg ? (
                  <>
                    {product.discountedPricePerKg.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-zinc-400">UZS / kg</span>
                    <span className="ml-1.5 text-xs font-normal text-zinc-400 line-through">
                      {product.pricePerKg.toLocaleString()} UZS
                    </span>
                  </>
                ) : (
                  <>{product.pricePerKg.toLocaleString()} <span className="text-xs font-normal text-zinc-400">UZS / kg</span></>
                )}
              </span>
            )}
            {!product.price && !product.pricePerKg && (
              <span className="text-base font-bold text-zinc-900">—</span>
            )}
          </div>
        </div>
      </Link>

      {/* ── Add-to-cart button — separate from Link ── */}
      <div className="px-3 pb-5">
        {qty > 0 ? (
          <div className="inline-flex items-center w-full justify-between rounded-xl bg-black text-white text-sm font-semibold overflow-hidden">
            <button
              onClick={() => changeQty(firstVariantId, -1)}
              disabled={adding}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/15 transition-colors disabled:opacity-40"
            >
              −
            </button>
            <span className="flex-1 text-center tabular-nums">
              {adding ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : qty}
            </span>
            <button
              onClick={() => changeQty(firstVariantId, 1, product.stock)}
              disabled={adding || qty >= product.stock}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/15 transition-colors disabled:opacity-40"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              if (!firstVariant) return;
              addToCart(firstVariant.id, 1, product.id, { product: { ...product, variants: [firstVariant] }, variant: firstVariant });
            }}
            disabled={product.stock === 0 || !firstVariant || adding}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            )}
            Qo&apos;shish
          </button>
        )}
      </div>

    </div>
  );
};
