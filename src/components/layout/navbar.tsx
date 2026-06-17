"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCartCountStore } from "@/src/store/cart-count-store";
import { useAuthStore } from "@/src/store/auth-store";
import { Modal } from "@/src/components/common/modal";
import type { BrandConfig } from "@/src/lib/branding";
// import { useFavouritesStore } from "@/src/store/favourites-store";

type NavbarProps = {
  brand: BrandConfig;
};

export const Navbar = ({ brand }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const totalCount = useCartCountStore((s) => s.count);
  const { user, isAuthenticated, logout } = useAuthStore();
  // const favouriteCount = useFavouritesStore((s) => s.items.length);
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleSearch = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (query.trim()) router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    else router.push("/products");
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.refresh();
    router.push("/");
  };

  return (
    <>
      {/* ─── Desktop ─── */}
      <header className="hidden md:block sticky top-0 z-40 bg-white border-b border-zinc-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        {/* Row 1: Logo · Katalog · Search · Auth */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 mr-1">
            <Image
              src={brand.logoPath}
              alt={brand.displayName}
              width={124}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Katalog button */}
          {/* <Link
            href="/products"
            className={`flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-semibold flex-shrink-0 transition-colors ${
              pathname === "/products"
                ? "bg-green-600 text-white"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Katalog
          </Link> */}

          {/* Search bar — home page only */}
          {pathname === "/" && (
            <form onSubmit={handleSearch} className="flex-1 flex">
              <div className="relative w-full">
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Mahsulotlar va turkumlar izlash"
                  className="w-full h-10 pl-4 pr-12 rounded-lg border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className={`absolute right-0 top-0 h-10 w-11 flex items-center justify-center rounded-r-lg ${brand.theme.primary} ${brand.theme.primaryHover} transition-colors`}
                  aria-label="Qidirish"
                >
                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-0.5 shrink-0 ml-auto">
            {/* Kirish / Profile */}
            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-0.5">
                <Link
                  href="/profile"
                  className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 ${pathname === "/profile" ? "bg-zinc-100 text-zinc-900" : ""}`}
                >
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full ${brand.theme.iconBg} text-white text-[10px] font-bold`}>
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-[11px] font-medium leading-none">{user?.username?.split(" ")[0]}</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[11px] font-medium leading-none">Kirish</span>
              </Link>
            )}

            {/* Bosh sahifa */}
            <Link
              href="/"
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/"
                  ? "text-zinc-900 bg-zinc-100"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
              aria-label="Bosh sahifa"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span className="text-[11px] font-medium leading-none">Bosh sahifa</span>
            </Link>

            {/* Buyurtmalarim */}
            <Link
              href="/transactions"
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/transactions"
                  ? "text-zinc-900 bg-zinc-100"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
              aria-label="Buyurtmalarim"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-[11px] font-medium leading-none">Buyurtmalarim</span>
            </Link>

            {/* Saralangan */}
            {/* <Link
              href="/favourites"
              className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/favourites"
                  ? "text-red-500 bg-red-50"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
              aria-label="Saralangan"
            >
              <svg
                className={`w-5 h-5 ${pathname === "/favourites" ? "fill-red-500 text-red-500" : "fill-none"}`}
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="text-[11px] font-medium leading-none">Saralangan</span>
              {mounted && favouriteCount > 0 && (
                <span className="absolute top-1 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">
                  {favouriteCount > 9 ? "9+" : favouriteCount}
                </span>
              )}
            </Link> */}

            {/* Savat */}
            <Link
              href="/cart"
              className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/cart"
                  ? "text-zinc-900 bg-zinc-100"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
              aria-label="Savat"
            >
              <div className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {mounted && totalCount > 0 && (
                  <span className={`absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 rounded-full ${brand.theme.primary} text-white text-[9px] font-bold`}>
                    {totalCount > 9 ? "9+" : totalCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium leading-none">Savat</span>
            </Link>

            {/* Chiqish */}
            {mounted && isAuthenticated && (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors text-zinc-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Chiqish"
                title="Chiqish"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-[11px] font-medium leading-none">Chiqish</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── Mobile: top search bar — home page only ─── */}
      {pathname === "/" && <div className="md:hidden sticky top-0 z-40 bg-white border-b border-zinc-200 shadow-sm">
        <div className="flex items-center gap-2 px-3 h-14">
          <Link href="/" className="shrink-0">
            <Image
              src={brand.logoPath}
              alt={brand.displayName}
              width={92}
              height={30}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
          <form onSubmit={handleSearch} className="flex-1 flex">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mahsulot izlash..."
                className="w-full h-9 pl-3 pr-10 rounded-lg border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
              />
              <button
                type="submit"
                className={`absolute right-0 top-0 h-9 w-9 flex items-center justify-center rounded-r-lg ${brand.theme.primary}`}
                aria-label="Qidirish"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>}

      {/* Logout modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Chiqish">
        <p className="text-sm text-zinc-500 mb-6">Hisobingizdan chiqmoqchimisiz?</p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="flex-1 py-2.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-2.5 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Chiqish
          </button>
        </div>
      </Modal>
    </>
  );
};
