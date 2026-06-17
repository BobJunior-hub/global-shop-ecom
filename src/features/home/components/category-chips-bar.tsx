"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import type { CategoryInfo } from "@/src/features/products/api";
import { useBrand } from "@/src/lib/brand-context";

export function CategoryChipsBar({ categories }: { categories: CategoryInfo[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedId = searchParams.get("category");
  const { theme } = useBrand();

  const setCategory = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set("category", id);
    else params.delete("category");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
      <button
        onClick={() => setCategory(null)}
        className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all border-2 ${
          selectedId === null
            ? `border-transparent ${theme.iconBg}`
            : "border-zinc-200 bg-zinc-100 group-hover:border-zinc-400"
        }`}>
          <svg className={`w-7 h-7 ${selectedId === null ? "text-white" : "text-zinc-500"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5M3.75 18h16.5" />
          </svg>
        </div>
        <span className={`text-xs font-semibold whitespace-nowrap ${selectedId === null ? theme.primaryText : "text-zinc-500 group-hover:text-zinc-700"}`}>
          Barchasi
        </span>
      </button>

      {categories.map((cat) => {
        const active = selectedId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setCategory(active ? null : cat.id)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
          >
            <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
              active
                ? "border-zinc-900"
                : "border-zinc-200 group-hover:border-zinc-400"
            }`}>
              {cat.image ? (
                <div className="relative w-full h-full">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="64px" />
                </div>
              ) : (
                <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                  <span className="text-xl">{cat.name[0]}</span>
                </div>
              )}
            </div>
            <span className={`text-xs font-semibold whitespace-nowrap ${active ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-700"}`}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
