"use client";

import type { ApiCartGroup } from "@/src/types/cart";
import { useBrand } from "@/src/lib/brand-context";

type Props = {
  groups: ApiCartGroup[];
  totalPrice: number;
  totalDiscount: number;
  totalWeightGrams: number;
  promoDiscount: number;
};

export const OrderSummary = ({ groups, totalPrice, totalDiscount, totalWeightGrams, promoDiscount }: Props) => {
  const { theme } = useBrand();
  const originalTotal = totalPrice + totalDiscount;
  const totalCount = groups.reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.qty, 0), 0);

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-zinc-900">Buyurtma xulosasi</h2>

      {/* Per-item breakdown */}
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.store.id} className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{group.store.name}</p>
            {group.items.map((item) => {
              const name = (item.variant as { product?: { name?: string } })?.product?.name ?? "Mahsulot";
              const color = (item.variant as { color?: string })?.color;
              const size = (item.variant as { size?: string })?.size;
              const label = [color, size ? `O'lcham ${size}` : null].filter(Boolean).join(" · ") || name;
              return (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-600 truncate max-w-[180px]">
                    {label}
                    <span className="text-zinc-400"> × {item.qty}</span>
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 pt-3 flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-zinc-600">
          <span>Mahsulotlar soni</span>
          <span>{totalCount} ta</span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Mahsulotlar narxi</span>
          <span>{originalTotal.toLocaleString()} UZS</span>
        </div>
        {totalWeightGrams > 0 && (
          <div className="flex justify-between text-zinc-600">
            <span>Umumiy og&apos;irlik</span>
            <span>{(totalWeightGrams / 1000).toFixed(2)} kg</span>
          </div>
        )}
        {totalDiscount > 0 && (
          <div className={`flex justify-between ${theme.primaryText} font-medium`}>
            <span>Chegirma</span>
            <span>− {totalDiscount.toLocaleString()} UZS</span>
          </div>
        )}
        {promoDiscount > 0 && (
          <div className={`flex justify-between ${theme.primaryText} font-medium`}>
            <span>Promo chegirma</span>
            <span>− {promoDiscount.toLocaleString()} UZS</span>
          </div>
        )}
        <div className={`border-t border-zinc-200 pt-2 flex justify-between font-semibold ${theme.primaryText}`}>
          <span>Jami</span>
          <span>{(totalPrice - promoDiscount).toLocaleString()} UZS</span>
        </div>
      </div>
    </div>
  );
};
