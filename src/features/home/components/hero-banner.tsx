"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { fetchStoreBanners } from "@/src/features/branches/storesApi";
import type { ApiStoreBanner } from "@/src/types/store";
import { useStoreId } from "@/src/lib/store-context";

export function HeroBanner() {
  const storeId = useStoreId();
  const [banners, setBanners] = useState<ApiStoreBanner[]>([]);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;
    fetchStoreBanners(storeId)
      .then(setBanners)
      .finally(() => setLoading(false));
  }, [storeId]);

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? banners.length - 1 : c - 1)), [banners.length]);
  const next = useCallback(() => setCurrent((c) => (c === banners.length - 1 ? 0 : c + 1)), [banners.length]);

  useEffect(() => {
    if (isHovered || banners.length < 2) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [next, isHovered, banners.length]);

  if (loading) {
    return (
      <div
        className="w-full rounded-xl bg-zinc-100 animate-pulse"
        style={{ aspectRatio: "1240 / 413" }}
      />
    );
  }

  if (banners.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl select-none"
      style={{ aspectRatio: "1240 / 413" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={banner.photo.url}
            alt={`Banner ${i + 1}`}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1240px"
          />
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Oldingi"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors outline-none focus:outline-none"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Keyingi"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors outline-none focus:outline-none"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slayd ${i + 1}`}
                className={`rounded-full transition-all duration-300 outline-none focus:outline-none ${
                  i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
