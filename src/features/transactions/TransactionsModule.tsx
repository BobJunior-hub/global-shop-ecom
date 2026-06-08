"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth-store";
import { fetchMyTransactions } from "@/src/features/checkout/transactionsApi";
import type { ApiTransaction } from "@/src/features/checkout/transactionsApi";
import { OrderRow } from "./components/order-row";
import { Loader } from "@/src/components/common/loader";

export const TransactionsModule = () => {
  const token = useAuthStore((s) => s.token);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetchMyTransactions(token)
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-10 flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900">Buyurtmalarim</h1>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader label="Buyurtmalar yuklanmoqda..." />
        </div>
      )}

      {!loading && !token && (
        <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-zinc-500">Buyurtmalarni ko'rish uchun kiring.</p>
        </div>
      )}

      {!loading && token && transactions.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-zinc-500">Hali buyurtma yo'q.</p>
        </div>
      )}

      {!loading && transactions.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100 overflow-hidden">
          {transactions.map((t) => (
            <OrderRow key={t.id} transaction={t} />
          ))}
        </div>
      )}
    </div>
  );
};
