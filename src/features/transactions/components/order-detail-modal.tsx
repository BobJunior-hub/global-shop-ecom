"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import type { ApiTransaction } from "@/src/features/checkout/transactionsApi";

const TELEGRAM_CHANNEL = "https://t.me/Albarakakg";

const statusColors: Record<string, string> = {
  jarayonda: "bg-blue-100 text-blue-700",
  yetkazildi: "bg-green-100 text-green-700",
  bekor: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

type Props = {
  transaction: ApiTransaction;
  onClose: () => void;
};

export const OrderDetailModal = ({ transaction, onClose }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const statusName =
    "name" in transaction.status ? (transaction.status as { name: string }).name : "—";
  const deliveryName =
    "name" in transaction.delivery_type
      ? (transaction.delivery_type as { name: string }).name
      : "—";

  const d = new Date(transaction.created_at);
  const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;

  const colorKey = statusName.toLowerCase();
  const badgeClass = statusColors[colorKey] ?? "bg-zinc-100 text-zinc-700";
  const items = transaction.items ?? [];

  const total = items.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-md max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-500"
          aria-label="Yopish"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header — Al Baraka brand */}
        <div className="flex flex-col items-center gap-1 pt-8 pb-5 px-6 border-b border-dashed border-zinc-200">
          <div className="flex flex-col items-center leading-none mb-1">
            <span
              className="text-2xl font-black text-zinc-900 tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              AL-BARAKA
            </span>
            <span className="text-[10px] font-semibold text-zinc-500 tracking-widest uppercase mt-0.5">
              Outlet
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{date}</p>

          {/* Status + receipt */}
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
              {statusName}
            </span>
            {transaction.receipt && (
              <a
                href={transaction.receipt}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-900"
              >
                Chek
              </a>
            )}
          </div>
        </div>

        {/* Items */}
        {items.length > 0 && (
          <div className="px-6 py-4 flex flex-col gap-4 border-b border-dashed border-zinc-200">
            {items.map((item) => {
              const photo = item.variant.photos?.[0];
              const productName = item.variant.product.name;
              const productId = item.variant.product.id;
              const hasLink = productId !== "00000000-0000-0000-0000-000000000000";
              const itemTotal = Number(item.amount);
              const unitPrice = item.qty > 1 ? Math.round(itemTotal / item.qty) : itemTotal;

              return (
                <div key={item.id} className="flex items-start gap-3">
                  {/* Photo */}
                  <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                    {photo ? (
                      <Image
                        src={photo.url}
                        alt={productName || "Mahsulot"}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {productName ? (
                      hasLink ? (
                        <a
                          href={`/products/${productId}`}
                          className="text-sm font-semibold text-zinc-900 hover:underline line-clamp-2"
                        >
                          {productName}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-zinc-900 line-clamp-2">{productName}</p>
                      )
                    ) : null}
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1">
                      {item.variant.size && (
                        <span className="text-xs text-zinc-500">
                          O'lcham: <span className="text-zinc-700 font-medium">{item.variant.size}</span>
                        </span>
                      )}
                      {item.variant.color && (
                        <span className="text-xs text-zinc-500">
                          Rang: <span className="text-zinc-700 font-medium">{item.variant.color}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.qty} dona</p>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-zinc-900">{itemTotal.toLocaleString()} so'm</p>
                    {item.qty > 1 && (
                      <p className="text-[11px] text-zinc-400">{unitPrice.toLocaleString()} × {item.qty}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Total */}
        <div className="px-6 py-3 flex justify-between items-center border-b border-dashed border-zinc-200">
          <span className="text-sm font-semibold text-zinc-700">Jami</span>
          <span className="text-base font-black text-zinc-900">{total.toLocaleString()} so'm</span>
        </div>

        {/* Delivery info */}
        <div className="px-6 py-4 flex flex-col gap-1 border-b border-dashed border-zinc-200">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Manzil</span>
            <span className="text-zinc-800 font-medium text-right max-w-[60%] break-words">{transaction.address}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Yetkazish</span>
            <span className="text-zinc-800 font-medium">{deliveryName}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Telefon</span>
            <span className="text-zinc-800 font-medium">{transaction.phone_number || "—"}</span>
          </div>
        </div>

        {/* QR code */}
        <div className="flex flex-col items-center gap-2 px-6 py-6">
          <QRCodeSVG
            value={TELEGRAM_CHANNEL}
            size={96}
            bgColor="#ffffff"
            fgColor="#18181b"
            level="M"
          />
          <p className="text-[11px] text-zinc-400 text-center">
            Telegram kanalimizga obuna bo'ling
          </p>
        </div>
      </div>
    </div>
  );
};
