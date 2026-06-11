"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { useOrdersStore } from "@/src/store/orders-store";
import { StatusBadge } from "@/src/components/common/status-badge";
import { fetchMyTransactionsCount } from "@/src/features/checkout/transactionsApi";

export const ProfileModule = () => {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const orders = useOrdersStore((s) => s.orders);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      fetchMyTransactionsCount(token).then(setTotalOrders).catch(() => {});
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    router.refresh();
    router.push("/");
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "?";

  const recentOrders = orders.slice(0, 3);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-20 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-400 text-2xl">?</div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-zinc-900 mb-1">Hisobingizga kiring</h1>
          <p className="text-sm text-zinc-500">Profilingizni ko'rish uchun tizimga kiring</p>
        </div>
        <Link
          href="/login?from=/"
          className="px-8 py-3 rounded-xl btn-brand-primary text-sm font-semibold transition-colors"
        >
          Kirish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-10 flex flex-col gap-8">
      {/* Avatar + name */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-brand-secondary text-xl font-bold shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900">{user?.username}</h1>
        </div>
      </div>

      {/* Account details */}
      <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100">
        <div className="px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Hisob ma'lumotlari</p>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Foydalanuvchi nomi</span>
              <span className="font-medium text-zinc-900">{user?.username}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Jami buyurtmalar</span>
              <span className="font-medium text-zinc-900">{totalOrders ?? "—"}</span>
            </div>
           
          </div>
        </div>

        {/* Quick links */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Tezkor havolalar</p>
          <div className="flex flex-col gap-2">
            {[
              { label: "Mahsulotlarni ko'rish", href: "/products" },
              { label: "Buyurtmalarim", href: "/transactions" },
              { label: "Savat", href: "/cart" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between py-2 text-sm text-zinc-700 hover:text-brand-primary transition-colors group"
              >
                {item.label}
                <svg className="w-4 h-4 text-zinc-300 group-hover:text-brand-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900">So'nggi buyurtmalar</h2>
            <Link href="/transactions" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
              Barchasini ko'rish →
            </Link>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-zinc-900">{order.id}</p>
                  <p className="text-xs text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
                <StatusBadge status={order.status} />
                <p className="text-sm font-bold text-zinc-900">${order.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logout / Login */}
      <div className="pt-2">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            Chiqish
          </button>
        ) : (
          <Link
            href="/login?from=/"
            className="block w-full py-3 rounded-xl bg-zinc-900 text-white text-sm font-semibold text-center hover:bg-zinc-800 transition-colors"
          >
            Kirish
          </Link>
        )}
      </div>
    </div>
  );
};
