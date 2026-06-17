"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import type { ApiStore, ApiStoreBanner } from "@/src/types/store";
import { fetchStoreById, fetchStoreBanners } from "@/src/features/branches/storesApi";
import { Loader } from "@/src/components/common/loader";

type Props = {
  storeId: string;
};

export const BranchDetailModule = ({ storeId }: Props) => {
  const [store, setStore] = useState<ApiStore | null>(null);
  const [banners, setBanners] = useState<ApiStoreBanner[]>([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    fetchStoreById(storeId).then(setStore);
    fetchStoreBanners(storeId).then(setBanners);
  }, [storeId]);

  const prev = useCallback(() => setSlide((s) => (s === 0 ? banners.length - 1 : s - 1)), [banners.length]);
  const next = useCallback(() => setSlide((s) => (s === banners.length - 1 ? 0 : s + 1)), [banners.length]);

  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [next, banners.length]);

  if (!store) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader label="Yuklanmoqda..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-10 flex flex-col gap-8">
      {/* Back */}
      <Link
        href="/stores"
        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors w-fit"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Barcha do&apos;konlar
      </Link>

      {/* Store header */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 flex flex-col sm:flex-row gap-5 sm:items-start">
        <div className="w-14 h-14 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0">
          <svg className="w-7 h-7 text-zinc-900" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <h1 className="text-xl font-bold text-zinc-900">{store.name}</h1>
          {store.description && (
            <p className="text-sm text-zinc-500">{store.description}</p>
          )}
          <div className="flex flex-col gap-1.5">
            {store.address && (
              <span className="text-sm text-zinc-500 flex items-center gap-2">
                <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {store.address}
              </span>
            )}
            {store.phone && (
              <span className="text-sm text-zinc-500 flex items-center gap-2">
                <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {store.phone}
              </span>
            )}
            {store.working_hours && (
              <span className="text-sm text-zinc-500 flex items-center gap-2">
                <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {store.working_hours}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Banners */}
      {banners.length > 0 && (
        <div className="relative w-full overflow-hidden rounded-xl select-none" style={{ aspectRatio: "16 / 5" }}>
          {banners.map((banner, i) => (
            <div
              key={banner.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === slide ? 1 : 0 }}
            >
              <Image
                src={banner.photo.url}
                alt={store.name}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          ))}

          {banners.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Oldingi"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Keyingi"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    aria-label={`Slayd ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${i === slide ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
