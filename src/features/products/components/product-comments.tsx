"use client";

import { useState, useEffect, forwardRef } from "react";
import { useAuthStore } from "@/src/store/auth-store";
import { fetchMyTransactions } from "@/src/features/checkout/transactionsApi";

type ApiComment = {
  id: string;
  product_id: string;
  comment: string;
  star: number;
  user: { id: string; username: string };
};

async function fetchComments(productId: string): Promise<ApiComment[]> {
  const res = await fetch(`/api/v1/products/${productId}/comments?limit=100`);
  if (!res.ok) return [];
  const json = await res.json();
  return json?.data ?? [];
}

async function postComment(
  productId: string,
  data: { comment: string; star: number },
  token: string,
): Promise<ApiComment | null> {
  const res = await fetch(`/api/v1/products/${productId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.success ? json.data : null;
}

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className="focus:outline-none disabled:cursor-default"
          aria-label={`${star} yulduz`}
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              (hover || value) >= star ? "text-zinc-900" : "text-zinc-300"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

type Props = {
  productId: string;
  onStatsChange?: (avg: number, count: number) => void;
};

export const ProductComments = forwardRef<HTMLElement, Props>(
  function ProductComments({ productId, onStatsChange }, ref) {
    const { isAuthenticated, token, user } = useAuthStore();

    const [comments, setComments] = useState<ApiComment[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [canComment, setCanComment] = useState(false);
    const [checkingEligibility, setCheckingEligibility] = useState(false);

    const [text, setText] = useState("");
    const [star, setStar] = useState(5);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
      setLoadingComments(true);
      fetchComments(productId)
        .then((data) => {
          setComments(data);
          if (onStatsChange) {
            const avg = data.length > 0
              ? data.reduce((s, c) => s + c.star, 0) / data.length
              : 0;
            onStatsChange(avg, data.length);
          }
        })
        .finally(() => setLoadingComments(false));
    }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      if (!isAuthenticated || !token) { setCanComment(false); return; }
      setCheckingEligibility(true);
      fetchMyTransactions(token)
        .then((transactions) => {
          const eligible = transactions.some(
            (t) =>
              t.status?.name?.toLowerCase() === "yetkazildi" &&
              t.items?.some((item) => item.variant.product.id === productId),
          );
          setCanComment(eligible);
        })
        .finally(() => setCheckingEligibility(false));
    }, [isAuthenticated, token, productId]);

    const avgRating =
      comments.length > 0
        ? comments.reduce((s, c) => s + c.star, 0) / comments.length
        : 0;

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!text.trim() || !token) return;
      setSubmitting(true);
      setError(null);
      try {
        const newComment = await postComment(productId, { comment: text.trim(), star }, token);
        if (newComment) {
          setComments((prev) => {
            const updated = [newComment, ...prev];
            if (onStatsChange) {
              const avg = updated.reduce((s, c) => s + c.star, 0) / updated.length;
              onStatsChange(avg, updated.length);
            }
            return updated;
          });
          setText("");
          setStar(5);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError("Izoh yuborishda xatolik yuz berdi.");
        }
      } catch {
        setError("Izoh yuborishda xatolik yuz berdi.");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <section ref={ref} className="mt-10 border-t border-zinc-100 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-zinc-900">
            Izohlar
            {comments.length > 0 && (
              <span className="ml-2 text-sm font-normal text-zinc-400">({comments.length})</span>
            )}
          </h2>
          {comments.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avgRating)} readonly />
              <span className="text-sm font-semibold text-zinc-700">{avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Comment form */}
        {!isAuthenticated ? (
          <div className="mb-8 flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 text-sm text-zinc-500">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Izoh qoldirish uchun{" "}
            <a href="/login" className="font-semibold text-zinc-900 underline underline-offset-2">
              tizimga kiring
            </a>
          </div>
        ) : checkingEligibility ? (
          <div className="mb-8 h-10 rounded-2xl bg-zinc-100 animate-pulse" />
        ) : canComment ? (
          <form onSubmit={handleSubmit} className="mb-8 bg-zinc-50 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold shrink-0">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-medium text-zinc-700">{user?.username}</span>
            </div>

            <StarRating value={star} onChange={setStar} />

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Mahsulot haqida fikringizni yozing..."
              rows={3}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/15 resize-none transition-all"
            />

            {error && <p className="text-xs text-red-500">{error}</p>}
            {success && <p className="text-xs text-green-600">Izohingiz qabul qilindi!</p>}

            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="self-end px-5 py-2 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </form>
        ) : (
          <div className="mb-8 flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-sm text-amber-700">
            <svg className="w-4 h-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Izoh qoldirish uchun ushbu mahsulotni sotib olib, &quot;Yetkazildi&quot; holatiga yetishi kerak.
          </div>
        )}

        {/* Comments list */}
        {loadingComments ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-zinc-200 shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 bg-zinc-200 rounded w-1/4" />
                  <div className="h-3 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="w-10 h-10 text-zinc-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-zinc-400">Hozircha izoh yo&apos;q</p>
            <p className="text-xs text-zinc-300 mt-1">Birinchi bo&apos;lib fikringizni qoldiring</p>
          </div>
        ) : (
          <div className="space-y-5">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold shrink-0">
                  {c.user?.username?.charAt(0).toUpperCase() ?? "?"}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-zinc-800">{c.user?.username}</span>
                    <StarRating value={c.star} readonly />
                  </div>
                  <p className="text-sm text-zinc-600 mt-1 leading-relaxed">{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }
);
