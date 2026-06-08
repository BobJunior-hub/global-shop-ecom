"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchStores } from "./storesApi";
import type { ApiStore } from "@/src/types/store";
import { Loader } from "@/src/components/common/loader";

export const BranchesModule = () => {
  const [stores, setStores] = useState<ApiStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStores()
      .then(setStores)
      .catch(() => setError("Could not load stores."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-10 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Bizning do'konlar</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Yaqiningizda Al-Baraka do'konini toping va mavjud mahsulotlarni ko'ring.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader label="Do'konlar yuklanmoqda..." />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/stores/${store.id}`}
              className="group rounded-xl border border-zinc-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:shadow-md transition-shadow"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-zinc-900" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
                  <path d="M9 21V12h6v9" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <h2 className="text-base font-bold text-zinc-900 group-hover:text-black transition-colors">
                  {store.name}
                </h2>
                {store.description && (
                  <p className="text-sm text-zinc-500 truncate">{store.description}</p>
                )}
                {store.address && (
                  <p className="text-sm text-zinc-400 truncate">{store.address}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  {store.phone && (
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {store.phone}
                    </span>
                  )}
                  {store.working_hours && (
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {store.working_hours}
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <div className="shrink-0">
                <svg className="w-5 h-5 text-zinc-300 group-hover:text-zinc-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}

          {stores.length === 0 && (
            <p className="text-sm text-zinc-500 text-center py-10">Do'konlar topilmadi.</p>
          )}
        </div>
      )}
    </div>
  );
};
