"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useProducts } from "./hooks/useProducts";
import { fetchCategories, fetchSubcategories } from "./api";
import type { CategoryInfo, SubcategoryInfo } from "./api";
import { ProductGrid } from "./components/product-grid";
import { EmptyState } from "@/src/components/common/empty-state";
import { Loader } from "@/src/components/common/loader";
import Image from "next/image";
import { useAuthStore } from "@/src/store/auth-store";
import { useCartEntryStore } from "@/src/store/cart-entry-store";
import { useStoreId } from "@/src/lib/store-context";

function CategoryIcon({ src }: { src?: string }) {
  if (src) {
    return (
      <span className="w-12 h-12 rounded-2xl! overflow-hidden shrink-0 relative bg-zinc-100">
        <Image src={src} alt="" fill className="object-cover rounded-2xl!" sizes="48px" />
      </span>
    );
  }
  return (
    <span className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
      <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    </span>
  );
}

export const ProductsModule = () => {
  const storeId = useStoreId();
  const token = useAuthStore((s) => s.token);
  const hydrate = useCartEntryStore((s) => s.hydrate);
  useEffect(() => { if (token) hydrate(token); }, [token, hydrate]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("category") ?? "";
  const subcategoryId = searchParams.get("subcategory") ?? "";
  const showAll = searchParams.get("all") === "1";
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<SubcategoryInfo[]>([]);
  const [loadingSubcats, setLoadingSubcats] = useState(true);

 
  const [mobileCatId, setMobileCatId] = useState<string | null>(categoryId || null);
  const [mobileSearch, setMobileSearch] = useState(searchQuery);

  useEffect(() => {
    fetchCategories(storeId).then(setCategories);
    setLoadingSubcats(true);
    fetchSubcategories(undefined, storeId)
      .then(setAllSubcategories)
      .finally(() => setLoadingSubcats(false));
  }, [storeId]);


  useEffect(() => {
    if (categoryId) setMobileCatId(categoryId);
  }, [categoryId]);

  const inBrowseMode = !subcategoryId && !searchQuery && !showAll;

  const { products, loading, loadingMore, error, page, lastPage, totalRecords, goToPage } = useProducts({
    search: searchQuery || undefined,
    category: categoryId || null,
    subcategory: subcategoryId || null,
    skip: inBrowseMode,
    storeId,
  });

  const setParam = (key: string, value: string | null) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };

  const selectCategory = (id: string | null) => {
    const p = new URLSearchParams(searchParams.toString());
    if (id) p.set("category", id); else p.delete("category");
    p.delete("subcategory");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };

  const pickSubcategory = (catId: string, subId: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("category", catId);
    p.set("subcategory", subId);
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedSubcategory = allSubcategories.find((s) => s.id === subcategoryId);
  const visibleSubcategories = categoryId
    ? allSubcategories.filter((s) => s.categoryId === categoryId)
    : allSubcategories;

  const subcatsByCategory: Record<string, SubcategoryInfo[]> = {};
  for (const sub of allSubcategories) {
    if (!subcatsByCategory[sub.categoryId]) subcatsByCategory[sub.categoryId] = [];
    subcatsByCategory[sub.categoryId].push(sub);
  }

  const mobileCategory = categories.find((c) => c.id === mobileCatId);
  const mobileSubcats = mobileCatId ? (subcatsByCategory[mobileCatId] ?? []) : [];

  
  const handleMobileSearch = (q: string) => {
    setMobileSearch(q);
    const p = new URLSearchParams(searchParams.toString());
    if (q) p.set("search", q); else p.delete("search");
    p.delete("subcategory");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };

  
  const mobileBack = () => {
    setMobileCatId(null);
    selectCategory(null);
  };

 
  const mobileTapCategory = (id: string) => {
    setMobileCatId(id);
    selectCategory(id);
  };


  const mobileTapSubcategory = (subId: string) => {
    if (!mobileCatId) return;
    pickSubcategory(mobileCatId, subId);
  };


  const mobileShowProducts = !!subcategoryId || !!searchQuery || showAll;

  return (
    <>
     
      <div className="md:hidden flex flex-col h-[calc(100vh-7rem)]">

        {/* Search bar */}
        {/* <div className="px-4 pt-3 pb-2 bg-white">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Mahsulotlarni izlash..."
              value={mobileSearch}
              onChange={(e) => handleMobileSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-zinc-100 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
            />
            {mobileSearch && (
              <button
                onClick={() => handleMobileSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div> */}

        {/* ── PRODUCTS (search or subcategory selected) ── */}
        {mobileShowProducts && (
          <div className="flex-1 overflow-y-auto px-4 pt-2">
            {/* Back header */}
            <button
              onClick={() => {
                const p = new URLSearchParams(searchParams.toString());
                p.delete("subcategory");
                p.delete("all");
                if (!mobileSearch) p.delete("search");
                router.replace(`${pathname}?${p.toString()}`, { scroll: false });
                setMobileSearch("");
              }}
              className="flex items-center gap-2 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {mobileSearch ? "Qidiruv" : selectedCategory?.name ?? "Barcha kategoriyalar"}
            </button>

            {selectedSubcategory && (
              <p className="text-xs text-zinc-400 mb-3 font-medium">{selectedSubcategory.name}</p>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader label="Yuklanmoqda..." /></div>
            ) : error ? (
              <p className="text-sm text-red-500 text-center py-20">{error}</p>
            ) : products.length === 0 ? (
              <EmptyState title="Mahsulot topilmadi" description="Qidiruv yoki filtringizni o'zgartiring." />
            ) : (
              <>
                <p className="text-xs text-zinc-400 mb-3">{products.length} / {totalRecords} ta mahsulot</p>
                <ProductGrid products={products} />
                {page < lastPage && (
                  <div className="flex justify-center pt-6 pb-8">
                    <button
                      onClick={() => goToPage(page + 1)}
                      disabled={loadingMore}
                      className="px-8 py-3 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 disabled:opacity-60 transition-colors"
                    >
                      {loadingMore ? "Yuklanmoqda..." : "Yana ko'rish"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── SUBCATEGORIES (category selected, no subcategory yet) ── */}
        {!mobileShowProducts && mobileCatId && (
          <div className="flex-1 overflow-y-auto">
            {/* Back */}
            <button
              onClick={mobileBack}
              className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-zinc-800 hover:text-zinc-900 transition-colors w-full border-b border-zinc-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Barcha kategoriyalar
            </button>

            {/* Selected category name */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-100">
              <CategoryIcon src={mobileCategory?.image} />
              <span className="text-base font-semibold text-zinc-900">{mobileCategory?.name}</span>
            </div>

            {/* All items in category */}
            <button
              onClick={() => {
                if (!mobileCatId) return;
                router.push(`/products?category=${mobileCatId}&all=1`);
              }}
              className="flex items-center justify-between w-full px-4 py-4 border-b border-zinc-200 text-base font-semibold text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
            >
              Barcha tovarlar
              <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Subcategory list */}
            {loadingSubcats ? (
              <div className="flex items-center justify-center py-10"><Loader label="" /></div>
            ) : mobileSubcats.length === 0 ? (
              <p className="text-sm text-zinc-400 px-4 py-6">Subkategoriyalar topilmadi</p>
            ) : (
              mobileSubcats.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => mobileTapSubcategory(sub.id)}
                  className="flex items-center justify-between w-full px-4 py-4 border-b border-zinc-100 last:border-0 text-base font-medium text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <CategoryIcon src={sub.image} />
                    <span>{sub.name}</span>
                  </div>
                  <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))
            )}
          </div>
        )}

        {/* ── CATEGORIES LIST (no category selected) ── */}
        {!mobileShowProducts && !mobileCatId && (
          <div className="flex-1 overflow-y-auto">
            {categories.length === 0 && loadingSubcats ? (
              <div className="flex items-center justify-center py-20"><Loader label="Yuklanmoqda..." /></div>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => mobileTapCategory(cat.id)}
                  className="flex items-center gap-4 w-full px-4 py-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
                >
                  <CategoryIcon src={cat.image} />
                  <span className="flex-1 text-left text-base font-semibold text-zinc-900">{cat.name}</span>
                  <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP  (≥ md)  — unchanged two-panel layout
      ══════════════════════════════════════════════════════ */}
      <div className="hidden md:block max-w-7xl mx-auto w-full px-4 py-6">
        {/* Search bar */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <h1 className="text-xl font-semibold text-zinc-900 truncate">
            {selectedSubcategory?.name ?? selectedCategory?.name ?? "Barcha kategoriyalar"}
          </h1>
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setParam("search", e.target.value || null)}
            className="w-full sm:w-56 h-9 px-3 rounded-lg border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all shrink-0"
          />
        </div>

        {/* Two-panel layout */}
        <div className="flex gap-5 h-[calc(100vh-10rem)]">
          {/* LEFT — categories */}
          <aside className="w-44 md:w-52 shrink-0 bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden overflow-y-auto [scrollbar-width:thin]">
            <div>
              <button
                onClick={() => selectCategory(null)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm border-b border-zinc-50 transition-colors ${
                  !categoryId ? "bg-zinc-900 text-white font-semibold" : "hover:bg-zinc-50 text-zinc-700"
                }`}
              >
                <span>Barchasi</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.id === categoryId ? null : cat.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm border-b border-zinc-50 last:border-0 transition-colors ${
                    categoryId === cat.id ? "bg-zinc-900 text-white font-semibold" : "hover:bg-zinc-50 text-zinc-700"
                  }`}
                >
                  <span className="text-left leading-snug">{cat.name}</span>
                  <svg className={`w-3.5 h-3.5 shrink-0 ml-1 ${categoryId === cat.id ? "opacity-70" : "opacity-25"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </aside>

          {/* RIGHT — subcategories or products */}
          <div className="flex-1 min-w-0 overflow-y-auto [scrollbar-width:thin] pr-1">
            {/* Breadcrumb */}
            {(selectedCategory || selectedSubcategory) && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-4">
                <button onClick={() => selectCategory(null)} className="hover:text-zinc-600 transition-colors">Barchasi</button>
                {selectedCategory && (
                  <>
                    <span>/</span>
                    <button
                      onClick={() => subcategoryId ? selectCategory(categoryId) : undefined}
                      className={`transition-colors ${subcategoryId ? "hover:text-zinc-600 cursor-pointer" : "text-zinc-700 font-medium pointer-events-none"}`}
                    >
                      {selectedCategory.name}
                    </button>
                  </>
                )}
                {selectedSubcategory && (
                  <><span>/</span><span className="text-zinc-700 font-medium">{selectedSubcategory.name}</span></>
                )}
              </div>
            )}

            {/* BROWSE MODE */}
            {inBrowseMode && (
              loadingSubcats ? (
                <div className="flex items-center justify-center py-20"><Loader label="Yuklanmoqda..." /></div>
              ) : categoryId ? (
                visibleSubcategories.length === 0 ? (
                  <EmptyState title="Subkategoriyalar topilmadi" description="" />
                ) : (
                  <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
                    {visibleSubcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setParam("subcategory", sub.id)}
                        className="text-left px-4 py-3.5 rounded-xl bg-white border border-zinc-100 hover:border-zinc-300 hover:shadow-sm text-sm text-zinc-700 font-medium transition-all"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  {categories.map((cat) => {
                    const subs = subcatsByCategory[cat.id] ?? [];
                    if (subs.length === 0) return null;
                    return (
                      <div key={cat.id}>
                        <button onClick={() => selectCategory(cat.id)} className="flex items-center gap-1.5 mb-2.5 group">
                          <span className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-500 transition-colors">{cat.name}</span>
                          <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                          {subs.map((sub) => (
                            <button key={sub.id} onClick={() => pickSubcategory(cat.id, sub.id)} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* PRODUCTS MODE */}
            {!inBrowseMode && (
              loading ? (
                <div className="flex items-center justify-center py-20"><Loader label="Mahsulotlar yuklanmoqda..." /></div>
              ) : error ? (
                <p className="text-sm text-red-500 text-center py-20">{error}</p>
              ) : products.length === 0 ? (
                <EmptyState title="Mahsulot topilmadi" description={searchQuery || categoryId ? "Qidiruv yoki filtringizni o'zgartiring." : "Hozircha mahsulotlar mavjud emas."} />
              ) : (
                <>
                  <p className="text-xs text-zinc-400 mb-3">{products.length} / {totalRecords} ta mahsulot</p>
                  <ProductGrid products={products} />
                  {page < lastPage && (
                    <div className="flex justify-center pt-6">
                      <button onClick={() => goToPage(page + 1)} disabled={loadingMore} className="px-8 py-3 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 disabled:opacity-60 transition-colors">
                        {loadingMore ? "Yuklanmoqda..." : "Yana ko'rish"}
                      </button>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};
