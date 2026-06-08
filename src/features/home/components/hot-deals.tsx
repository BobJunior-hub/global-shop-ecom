"use client";

import Link from "next/link";
import { useProducts } from "@/src/features/products/hooks/useProducts";
import { ProductCard } from "@/src/features/products/components/product-card";

export const HotDeals = () => {
  const { products, loading } = useProducts();

  const priceMax = products.length > 0 ? Math.max(...products.map((p) => p.price)) : 0;

  if (loading || priceMax === 0) return null;

  const threshold = priceMax * 0.4;
  const dealProducts = products.filter((p) => p.price <= threshold).slice(0, 4);

  if (dealProducts.length === 0) return null;

  return (
    <section className="bg-stone-50 py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Cheklangan vaqt
            </span>
            <h2 className="text-2xl font-bold text-zinc-900">Ajoyib takliflar</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Barchasini ko'rish →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
