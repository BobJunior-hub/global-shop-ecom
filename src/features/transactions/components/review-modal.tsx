"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/src/store/auth-store";

async function postReview(
  productId: string,
  data: { rating: number; text: string },
  token: string,
): Promise<boolean> {
  const res = await fetch(`/api/v1/products/${productId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment: data.text, star: data.rating }),
  });
  if (!res.ok) return false;
  const json = await res.json();
  return json?.success === true;
}

type Props = {
  productId: string;
  productName: string;
  onClose: () => void;
  onDone: () => void;
};

function Star({ filled, hovered }: { filled: boolean; hovered: boolean }) {
  return (
    <svg
      className={`w-8 h-8 transition-colors duration-100 ${filled ? "text-zinc-900" : hovered ? "text-zinc-400" : "text-zinc-300"}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export function ReviewModal({ productId, productName, onClose, onDone }: Props) {
  const { token } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rating || !token) return;
    setSubmitting(true);
    setError(null);
    try {
      const ok = await postReview(productId, { rating, text: text.trim() }, token);
      if (ok) {
        onDone();
      } else {
        setError("Yuborishda xatolik yuz berdi. Qayta urinib ko'ring.");
      }
    } catch {
      setError("Yuborishda xatolik yuz berdi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-500"
          aria-label="Yopish"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="pr-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">Mahsulot bahosi</p>
          <p className="text-sm font-bold text-zinc-900 leading-snug line-clamp-2">{productName}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Stars */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`${star} yulduz`}
                >
                  <Star filled={rating >= star} hovered={hover >= star} />
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-400 h-4">
              {(hover || rating) === 1 && "Yomon"}
              {(hover || rating) === 2 && "Qoniqarsiz"}
              {(hover || rating) === 3 && "O'rtacha"}
              {(hover || rating) === 4 && "Yaxshi"}
              {(hover || rating) === 5 && "A'lo darajada!"}
            </p>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500">
              Izoh <span className="text-zinc-300">(ixtiyoriy)</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Mahsulot haqida fikringizni yozing..."
              rows={3}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/15 focus:bg-white resize-none transition-all"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={!rating || submitting}
              className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-40 transition-colors"
            >
              {submitting ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
