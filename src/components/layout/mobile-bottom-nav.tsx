"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCartCountStore } from "@/src/store/cart-count-store";
import { useBrand } from "@/src/lib/brand-context";

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const totalCount = useCartCountStore((s) => s.count);
  const { theme } = useBrand();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isActive = (href: string) => pathname === href;

  const itemClass = (href: string) =>
    `flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${
      isActive(href) ? `${theme.text} font-black` : "text-zinc-500 font-[900]"
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-zinc-200" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-stretch h-16">

        {/* Bosh sahifa */}
        <Link href="/" className={itemClass("/")} aria-label="Bosh sahifa">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {isActive("/") ? (
              <>
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
              </>
            ) : (
              <>
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={1.6} />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={1.6} />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={1.6} />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={1.6} />
              </>
            )}
          </svg>
          <span className="text-[11px] leading-none">Bosh sahifa</span>
        </Link>

        {/* Katalog */}
        <Link href="/products" className={itemClass("/products")} aria-label="Katalog">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            {isActive("/products") ? (
              <>
                <path fill="currentColor" d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" d="m3.3 7 8.7 5 8.7-5M12 22V12" />
              </>
            ) : (
              <>
                <path stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" d="m3.3 7 8.7 5 8.7-5M12 22V12" />
              </>
            )}
          </svg>
          <span className="text-[11px] leading-none">Katalog</span>
        </Link>

        {/* Savat */}
        <Link href="/cart" className={`${itemClass("/cart")} relative`} aria-label="Savat">
          <div className="relative">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              {isActive("/cart") ? (
                <>
                  <path fill="currentColor" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line stroke="white" strokeWidth={1.5} x1="3" y1="6" x2="21" y2="6" />
                  <path stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round" d="M16 10a4 4 0 0 1-8 0" />
                </>
              ) : (
                <>
                  <path stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line stroke="currentColor" strokeWidth={1.6} x1="3" y1="6" x2="21" y2="6" />
                  <path stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" d="M16 10a4 4 0 0 1-8 0" />
                </>
              )}
            </svg>
            {mounted && totalCount > 0 && (
              <span className={`absolute -top-1.5 -right-2 flex items-center justify-center w-4 h-4 rounded-full ${theme.primary} text-white text-[9px] font-bold leading-none`}>
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            )}
          </div>
          <span className="text-[11px] leading-none">Savat</span>
        </Link>

        {/* To'lovlar */}
        <Link href="/transactions" className={itemClass("/transactions")} aria-label="Tranzaksiyalar">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {isActive("/transactions") ? (
              <>
                <path fill="currentColor" d="M2 7a1 1 0 0 1 1-1h15l-3-3a1 1 0 1 1 1.4-1.4l4.5 4.5a1 1 0 0 1 0 1.4L16.4 12a1 1 0 1 1-1.4-1.4L18 7.5 3 7.5A1 1 0 0 1 2 7Z" />
                <path fill="currentColor" d="M22 17a1 1 0 0 1-1 1H6l3 3a1 1 0 1 1-1.4 1.4L3.1 18a1 1 0 0 1 0-1.4L7.6 12a1 1 0 1 1 1.4 1.4L6 16.5H21a1 1 0 0 1 1 .5Z" />
              </>
            ) : (
              <>
                <polyline stroke="currentColor" strokeWidth={1.6} points="17 1 21 5 17 9" />
                <path stroke="currentColor" strokeWidth={1.6} d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline stroke="currentColor" strokeWidth={1.6} points="7 23 3 19 7 15" />
                <path stroke="currentColor" strokeWidth={1.6} d="M21 13v2a4 4 0 0 1-4 4H3" />
              </>
            )}
          </svg>
          <span className="text-[11px] leading-none">To&apos;lovlar</span>
        </Link>

        {/* Kabinet */}
        <Link href="/profile" className={itemClass("/profile")} aria-label="Kabinet">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            {isActive("/profile") ? (
              <>
                <circle fill="currentColor" cx="12" cy="7" r="4" />
                <path fill="currentColor" d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2Z" />
              </>
            ) : (
              <>
                <path stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle stroke="currentColor" strokeWidth={1.6} fill="none" cx="12" cy="7" r="4" />
              </>
            )}
          </svg>
          <span className="text-[11px] leading-none">Kabinet</span>
        </Link>

      </div>
    </nav>
  );
};
