"use client";

import Link from "next/link";
import { useProducts } from "@/src/features/products/hooks/useProducts";
import { ProductCard } from "@/src/features/products/components/product-card";

export const FeaturedProducts = () => {
  const { products, loading } = useProducts();

  return (
    <section className="w-full px-3 sm:px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/products"
            className="group flex items-center gap-1 text-lg font-bold text-zinc-900 hover:text-green-700 transition-colors"
          >
            Mashhur
            <svg
              className="w-5 h-5 text-zinc-400 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/products"
            className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            Barchasini ko'rish
          </Link>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 overflow-hidden animate-pulse">
                <div className="aspect-square bg-zinc-200" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-3 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-200 rounded w-1/2" />
                  <div className="h-7 bg-zinc-200 rounded mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {products.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <p className="text-sm text-zinc-400 text-center py-12">Mahsulotlar topilmadi</p>
        )}

        {/* Second section: Yangi kelganlar */}
        {!loading && products.length > 10 && (
          <>
            <div className="flex items-center justify-between mt-10 mb-4">
              <Link
                href="/products"
                className="group flex items-center gap-1 text-lg font-bold text-zinc-900 hover:text-green-700 transition-colors"
              >
                Yangi kelganlar
                <svg
                  className="w-5 h-5 text-zinc-400 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                Barchasini ko'rish
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {products.slice(10, 20).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
