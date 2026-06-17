"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import type { Product } from "@/src/types/product";
import { fetchProductById, getVariantPrice, getVariantDiscountedPrice } from "@/src/features/products/api";
import { useAddToCart } from "@/src/features/cart/hooks/use-add-to-cart";
import { Loader } from "@/src/components/common/loader";
import { useBrand } from "@/src/lib/brand-context";
import { ProductComments } from "./product-comments";

type Props = {
  productId: string;
};

export const ProductDetailClient = ({ productId }: Props) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const commentsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLoadingProduct(true);
    fetchProductById(productId)
      .then((p) => setProduct(p))
      .finally(() => setLoadingProduct(false));
  }, [productId]);

  const { theme } = useBrand();
  const { addToCart, changeQty: cartChangeQty, isAdding, getQty, error: cartError } = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (product) {
      const sortedSizes = [...new Set(product.variants.map((v) => v.size))].sort((a, b) => Number(a) - Number(b));
      const firstSize = sortedSizes[0] ?? null;
      const firstVariant = firstSize
        ? (product.variants.find((v) => v.size === firstSize) ?? null)
        : (product.variants[0] ?? null);
      if (firstVariant) {
        setSelectedSize(firstVariant.size);
        setSelectedColor(firstVariant.color);
        const photo = firstVariant.photo?.[0]?.url;
        setActiveImage(photo || product.image);
      } else {
        setActiveImage(product.image);
      }
      const firstVariantQty = getQty(firstVariant?.id ?? "");
      if (firstVariantQty > 0) setQuantity(firstVariantQty);
    }
  }, [product]); // eslint-disable-line react-hooks/exhaustive-deps

  const sizes = useMemo(
    () => [...new Set((product?.variants ?? []).map((v) => v.size))].sort((a, b) => Number(a) - Number(b)),
    [product]
  );

  const colorsForSize = useMemo(() => {
    const variants = product?.variants ?? [];
    const source = selectedSize != null ? variants.filter((v) => v.size === selectedSize) : variants;
    return [...new Set(source.map((v) => v.color))];
  }, [product, selectedSize]);

  const selectedVariant = useMemo(() => {
    if (!product || selectedSize == null || selectedColor == null) return null;
    return product.variants.find((v) => v.size === selectedSize && v.color === selectedColor) ?? null;
  }, [product, selectedSize, selectedColor]);

  const sizeVariant = useMemo(() => {
    if (!product || selectedSize == null) return null;
    return product.variants.find((v) => v.size === selectedSize) ?? null;
  }, [product, selectedSize]);

  const activeVariant = selectedVariant ?? sizeVariant;

  if (loadingProduct) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader label="Yuklanmoqda..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-sm text-zinc-500">Mahsulot topilmadi.</p>
      </div>
    );
  }

  const cartQty = selectedVariant ? getQty(selectedVariant.id) : 0;
  const inCart = cartQty > 0;

  const activeStock = selectedVariant
    ? selectedVariant.stock
    : selectedSize
      ? product.variants.filter((v) => v.size === selectedSize).reduce((sum, v) => sum + v.stock, 0)
      : product.stock;
  const activePrice = activeVariant ? getVariantPrice(activeVariant) : product.price;
  const activeDiscountedPrice = activeVariant ? getVariantDiscountedPrice(activeVariant) : null;

  const changeQty = (delta: number) =>
    setQuantity((q) => Math.max(0, Math.min(activeStock, q + delta)));

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
    const variants = product?.variants ?? [];
    const availableColors = [...new Set(variants.filter((v) => v.size === size).map((v) => v.color))];
    const firstColor = availableColors[0] ?? null;
    setSelectedColor(firstColor);
    if (firstColor) {
      const variant = variants.find((v) => v.size === size && v.color === firstColor);
      const photo = variant?.photo?.[0]?.url;
      if (photo) setActiveImage(photo);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setQuantity(1);
    const variant = product.variants.find(
      (v) => v.color === color && (selectedSize == null || v.size === selectedSize)
    );
    const photo = variant?.photo?.[0]?.url;
    if (photo) setActiveImage(photo);
  };

  const handleAddToCart = () => {
    const variant = selectedVariant ?? product.variants[0] ?? null;
    if (!variant) return;
    addToCart(variant.id, quantity, product.id, { product, variant });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-zinc-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.375 4.5h17.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 16.875V5.625c0-.621.504-1.125 1.125-1.125z" />
                </svg>
              </div>
            )}
          </div>

        </div>

        {/* Info */}
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              {product.category}
            </span>
            <h1 className={`text-2xl font-bold ${theme.primaryText}`}>{product.name}</h1>
            {commentCount > 0 && (
              <button
                type="button"
                onClick={() => commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="flex items-center gap-1.5 group w-fit"
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className={`w-4 h-4 transition-colors ${s <= Math.round(avgRating) ? "text-zinc-900" : "text-zinc-300"}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
                <span className="text-xs text-zinc-500 group-hover:text-zinc-800 transition-colors">
                  {avgRating.toFixed(1)} ({commentCount} izoh)
                </span>
              </button>
            )}
            {product.description && (
              <p className={`text-sm leading-relaxed ${theme.text}`}>{product.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            {activeDiscountedPrice && activeDiscountedPrice < activePrice ? (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className={`text-3xl font-bold ${theme.primaryText}`}>
                    {activeDiscountedPrice.toLocaleString()} UZS
                  </p>
                  <p className="text-xl font-medium text-zinc-400 line-through">
                    {activePrice.toLocaleString()} UZS
                  </p>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  −{(activePrice - activeDiscountedPrice).toLocaleString()} UZS tejash ({Math.round(((activePrice - activeDiscountedPrice) / activePrice) * 100)}%)
                </span>
              </>
            ) : (
              <p className={`text-3xl font-bold ${theme.primaryText}`}>
                {activePrice > 0 ? `${activePrice.toLocaleString()} UZS` : "—"}
              </p>
            )}
            {activeVariant && activeVariant.price === 0 && activeVariant.price_category && (
              <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
                  <svg className="w-4 h-4 shrink-0 text-zinc-700" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 3v17" />
                    <path d="M8 20h8" />
                    <path d="M3 6h18" />
                    <path d="M6 6l-3 6a3 3 0 0 0 6 0L6 6z" />
                    <path d="M18 6l-3 6a3 3 0 0 0 6 0L18 6z" />
                  </svg>
                  1 kg:{" "}
                  {activeVariant.discounted_price && activeVariant.discounted_price < activeVariant.price_category.price ? (
                    <>
                      <span className="font-medium text-zinc-700">{activeVariant.discounted_price.toLocaleString()} UZS</span>
                      <span className="ml-1.5 line-through text-zinc-400">{activeVariant.price_category.price.toLocaleString()} UZS</span>
                    </>
                  ) : (
                    <span className="font-medium text-zinc-700">{activeVariant.price_category.price.toLocaleString()} UZS</span>
                  )}
                </span>
                {activeVariant.weight > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
                    <svg className="w-4 h-4 shrink-0 text-zinc-700" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M9 6a3 3 0 1 1 6 0" />
                      <path d="M5 8h14l-1.5 11H6.5L5 8z" />
                    </svg>
                    Vazni: <span className="font-medium text-zinc-700">{activeVariant.weight}g</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className={`text-xs font-semibold uppercase tracking-widest ${theme.text}`}>
                Razmer
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const sizeStock = product.variants
                    .filter((v) => v.size === size)
                    .reduce((sum, v) => sum + v.stock, 0);
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`min-w-[2.5rem] h-10 px-3 rounded-lg border text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? `border-transparent ${theme.primary} text-white`
                          : sizeStock === 0
                            ? "border-zinc-200 text-zinc-300 cursor-not-allowed line-through"
                            : "border-zinc-200 text-zinc-700 hover:border-zinc-400"
                      }`}>
                      {size}
                    </button>
                  );
                })}
              </div>
              {selectedSize !== null && activeStock === 0 && (
                <p className="text-sm font-medium text-red-500">Mavjud emas</p>
              )}
            </div>
          )}

          {/* Color selector */}
          {colorsForSize.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className={`text-xs font-semibold uppercase tracking-widest ${theme.text}`}>
                Rang{selectedColor ? `: ${selectedColor}` : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {colorsForSize.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`px-4 h-9 rounded-lg border text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? `border-transparent ${theme.primary} text-white`
                        : "border-zinc-200 text-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className={`flex items-center gap-3 ${activeStock === 0 ? "opacity-0 pointer-events-none" : ""}`}>
            <button
              onClick={() => inCart ? cartChangeQty(selectedVariant!.id, -1) : changeQty(-1)}
              disabled={inCart ? isAdding(selectedVariant!.id) : quantity <= 0}
              className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {selectedVariant && isAdding(selectedVariant.id) ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                inCart ? cartQty : quantity
              )}
            </span>
            <button
              onClick={() => inCart ? cartChangeQty(selectedVariant!.id, 1, activeStock) : changeQty(1)}
              disabled={inCart ? (isAdding(selectedVariant!.id) || cartQty >= activeStock) : quantity >= activeStock}
              className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 transition-colors"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {inCart ? (
              <Link
                href="/cart"
                className={`inline-flex items-center justify-center gap-1 flex-1 px-3 py-1.5 sm:px-8 sm:py-3 rounded-full text-xs sm:text-base font-semibold transition-colors ${theme.primary} ${theme.primaryHover} text-white whitespace-nowrap`}
              >
                <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Savatga o&apos;tish
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={activeStock === 0 || product.variants.length === 0 || quantity === 0 || (selectedVariant ? isAdding(selectedVariant.id) : false)}
                className={`inline-flex items-center justify-center gap-1 flex-1 px-3 py-1.5 sm:px-8 sm:py-3 rounded-full text-xs sm:text-base font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${theme.primary} ${theme.primaryHover} text-white whitespace-nowrap`}
              >
                {selectedVariant && isAdding(selectedVariant.id) ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                )}
                {selectedVariant && isAdding(selectedVariant.id) ? "Qo'shilmoqda…" : "Sotib olish"}
              </button>
            )}

            <button
              onClick={() => {
                const msg = `Salom! "${product.name}" mahsuloti haqida savol bor: ${window.location.href}`;
                window.open(`https://t.me/baraka_chilonzor?text=${encodeURIComponent(msg)}`, "_blank");
              }}
              className={`inline-flex items-center justify-center gap-1 flex-1 px-3 py-1.5 sm:px-5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-colors ${theme.primary} ${theme.primaryHover} text-white whitespace-nowrap`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Admin bilan bog&apos;lanish
            </button>
          </div>
          {cartError && (
            <p className="text-sm text-red-600">{cartError}</p>
          )}

        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <ProductComments
          ref={commentsRef}
          productId={productId}
          onStatsChange={(avg, count) => {
            setAvgRating(avg);
            setCommentCount(count);
          }}
        />
      </div>
    </div>
  );
};
