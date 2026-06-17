"use client";

import { useState } from "react";
import Image from "next/image";

import type { ApiTransaction, ApiTransactionItem } from "@/src/features/checkout/transactionsApi";
import { OrderDetailModal } from "./order-detail-modal";
import { ReviewModal } from "./review-modal";

type Props = {
  transaction: ApiTransaction;
};

const statusColors: Record<string, string> = {
  jarayonda: "bg-blue-100 text-blue-800",
  yetkazildi: "bg-green-100 text-green-800",
  bekor: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

type ReviewTarget = { productId: string; productName: string };

function StarTrigger({ reviewed, onClick }: { reviewed: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(e as unknown as React.MouseEvent); }}
      className="flex items-center gap-1 mt-1 group cursor-pointer"
      aria-label="Baholash"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 transition-colors ${reviewed ? "text-amber-400" : "text-zinc-300 group-hover:text-amber-300"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      <span className="text-[10px] text-zinc-400 group-hover:text-zinc-600 transition-colors ml-0.5">
        {reviewed ? "Baholandi" : "Baholash"}
      </span>
    </div>
  );
}

export const OrderRow = ({ transaction }: Props) => {
  const [open, setOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const d = new Date(transaction.created_at);
  const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;

  const statusName =
    "name" in transaction.status ? (transaction.status as { name: string }).name : "—";
  const deliveryName =
    "name" in transaction.delivery_type
      ? (transaction.delivery_type as { name: string }).name
      : "—";

  const colorKey = statusName.toLowerCase();
  const badgeClass = statusColors[colorKey] ?? "bg-zinc-100 text-zinc-700";
  const items = transaction.items ?? [];
  const isDelivered = colorKey === "yetkazildi" || colorKey === "yetqazildi";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex flex-col gap-3 px-5 py-4 text-left hover:bg-zinc-50 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-zinc-900">{transaction.address}</p>
            <p className="text-xs text-zinc-500">{date} · {deliveryName}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
              {statusName}
            </span>
            {transaction.receipt && (
              <a
                href={transaction.receipt}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-900 transition-colors"
              >
                Chek
              </a>
            )}
          </div>
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-3 pt-3 border-t border-zinc-100">
            {items.map((item: ApiTransactionItem) => {
              const photo = item.variant.photos?.[0];
              const productName = item.variant.product.name;
              const hasName = productName !== "";

              const thumbnail = photo ? (
                <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-zinc-100">
                  <Image
                    src={photo.url}
                    alt={productName || "Mahsulot"}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 shrink-0 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                  </svg>
                </div>
              );

              const productId = item.variant.product.id;

              return (
                <div key={item.id} className="flex items-start gap-3">
                  {thumbnail}
                  <div className="flex-1 min-w-0">
                    {hasName && (
                      <p className="text-sm font-medium text-zinc-900 truncate">{productName}</p>
                    )}
                    <p className="text-xs text-zinc-500">
                      {item.variant.size} · {item.variant.color}
                    </p>
                    <p className="text-xs text-zinc-400">{item.qty} dona</p>
                    {isDelivered && (
                      <StarTrigger
                        reviewed={reviewedIds.has(productId)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setReviewTarget({ productId, productName });
                        }}
                      />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 shrink-0">
                    {Number(item.amount).toLocaleString()} so'm
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Tap hint */}
        <p className="text-[11px] text-zinc-400 text-right -mt-1">Batafsil ko'rish →</p>
      </button>

      {open && (
        <OrderDetailModal transaction={transaction} onClose={() => setOpen(false)} />
      )}

      {reviewTarget && (
        <ReviewModal
          productId={reviewTarget.productId}
          productName={reviewTarget.productName}
          onClose={() => setReviewTarget(null)}
          onDone={() => {
            setReviewedIds((prev) => new Set(prev).add(reviewTarget.productId));
            setReviewTarget(null);
          }}
        />
      )}
    </>
  );
};
