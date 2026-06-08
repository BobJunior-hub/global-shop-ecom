"use client";

import { useTransition, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { fetchProducts, fetchCategories, fetchSubcategories } from "@/src/features/products/api";
import { ProductCard } from "@/src/features/products/components/product-card";
import type { Product } from "@/src/types/product";
import type { CategoryInfo, SubcategoryInfo } from "@/src/features/products/api";
import { useStoreId } from "@/src/lib/store-context";

export function HomeProductsClient() {
  const storeId = useStoreId();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryInfo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    Promise.all([fetchCategories(storeId), fetchProducts(undefined, undefined, undefined, 1, storeId)])
      .then(([cats, { products: prods, meta }]) => {
        setCategories(cats);
        setProducts(prods);
        setLastPage(meta.last_page);
        setTotalRecords(meta.total_records);
        setPage(1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [storeId]);

  const selectCategory = (id: string | null) => {
    if (id === selectedCategoryId) return;
    setSelectedCategoryId(id);
    setSelectedSubcategoryId(null);
    setSubcategories([]);
    setPage(1);

    if (id) fetchSubcategories(id, storeId).then(setSubcategories).catch(() => {});

    startTransition(async () => {
      try {
        const { products: data, meta } = await fetchProducts(undefined, id ?? undefined, undefined, 1, storeId);
        setProducts(data);
        setLastPage(meta.last_page);
        setTotalRecords(meta.total_records);
        setPage(1);
      } catch {
        setProducts([]);
      }
    });
  };

  const selectSubcategory = (id: string | null) => {
    if (id === selectedSubcategoryId) return;
    setSelectedSubcategoryId(id);
    setPage(1);
    startTransition(async () => {
      try {
        const { products: data, meta } = await fetchProducts(
          undefined,
          selectedCategoryId ?? undefined,
          id ?? undefined,
          1,
          storeId,
        );
        setProducts(data);
        setLastPage(meta.last_page);
        setTotalRecords(meta.total_records);
        setPage(1);
      } catch {
        setProducts([]);
      }
    });
  };

  const loadMore = useCallback(() => {
    if (loadingMore || page >= lastPage) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    fetchProducts(undefined, selectedCategoryId ?? undefined, selectedSubcategoryId ?? undefined, nextPage, storeId)
      .then(({ products: data, meta }) => {
        setProducts((prev) => [...prev, ...data]);
        setPage(nextPage);
        setLastPage(meta.last_page);
        setTotalRecords(meta.total_records);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [loadingMore, page, lastPage, selectedCategoryId, selectedSubcategoryId, storeId]);

  const hasMore = page < lastPage;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 py-6">
        <div className="flex gap-2 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-zinc-100 animate-pulse flex-shrink-0" />
          ))}
        </div>
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
      </div>
    );
  }

  return (
    <section className="w-full px-3 sm:px-4 pt-2 pb-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">

        {/* Category chips */}
        <div className="flex gap-3 sm:gap-5 overflow-x-auto pt-2 pb-3 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
          <button
            onClick={() => selectCategory(null)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-200 shadow-sm ${
              selectedCategoryId === null
                ? "bg-zinc-900 shadow-zinc-300"
                : "bg-zinc-100 group-hover:bg-zinc-200"
            }`}>
              <svg className={`w-7 h-7 sm:w-8 sm:h-8 ${selectedCategoryId === null ? "text-white" : "text-zinc-500"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5M3.75 18h16.5" />
              </svg>
            </div>
            <span className={`text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${selectedCategoryId === null ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-700"}`}>
              Barchasi
            </span>
          </button>

          {categories.map((cat) => {
            const active = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(active ? null : cat.id)}
                className="flex flex-col items-center gap-2 flex-shrink-0 group"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-200 shadow-sm ${
                  active ? "ring-2 ring-zinc-900 ring-offset-2" : "group-hover:shadow-md"
                }`}>
                  {cat.image ? (
                    <div className="relative w-full h-full">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="(max-width: 640px) 64px, 80px" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                      <span className="text-2xl">{cat.name[0]}</span>
                    </div>
                  )}
                </div>
                <span className={`text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${active ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-700"}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subcategory chips */}
        {selectedCategoryId && subcategories.length > 0 && (
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pt-1 pb-3 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
            <button
              onClick={() => selectSubcategory(null)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                selectedSubcategoryId === null
                  ? "bg-zinc-900"
                  : "bg-zinc-100 group-hover:bg-zinc-200"
              }`}>
                <svg className={`w-5 h-5 ${selectedSubcategoryId === null ? "text-white" : "text-zinc-500"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5M3.75 18h16.5" />
                </svg>
              </div>
              <span className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${selectedSubcategoryId === null ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-700"}`}>
                Hammasi
              </span>
            </button>
            {subcategories.map((sub) => {
              const active = selectedSubcategoryId === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => selectSubcategory(active ? null : sub.id)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 shadow-sm ${
                    active ? "ring-2 ring-zinc-900 ring-offset-2" : "group-hover:shadow-md"
                  }`}>
                    {sub.image ? (
                      <div className="relative w-full h-full">
                        <Image src={sub.image} alt={sub.name} fill className="object-cover" sizes="(max-width: 640px) 48px, 56px" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                        <span className="text-lg">{sub.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${active ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-700"}`}>
                    {sub.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Section header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900">
            {selectedSubcategoryId
              ? (subcategories.find((s) => s.id === selectedSubcategoryId)?.name ?? "Mahsulotlar")
              : selectedCategoryId
                ? (categories.find((c) => c.id === selectedCategoryId)?.name ?? "Mahsulotlar")
                : "Mashhur"}
            {isPending && (
              <span className="ml-2 inline-block w-3 h-3 rounded-full border-2 border-zinc-300 border-t-zinc-700 animate-spin align-middle" />
            )}
          </h2>
          <span className="text-sm text-zinc-400">{products.length} / {totalRecords} ta mahsulot</span>
        </div>

        {/* Skeleton while filtering */}
        {isPending ? (
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
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {loadingMore && (
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  )}
                  Yana ko&apos;rish
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-zinc-500">Bu kategoriyada mahsulotlar topilmadi</p>
            <button
              onClick={() => selectCategory(null)}
              className="mt-4 text-sm font-semibold text-zinc-900 hover:underline"
            >
              Barchasini ko&apos;rish
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
