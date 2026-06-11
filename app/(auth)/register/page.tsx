"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { useBrand } from "@/src/lib/brand-context";
import { useStoreId } from "@/src/lib/store-context";
import { Input } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const register = useAuthStore((s) => s.register);
  const { displayName } = useBrand();
  const storeId = useStoreId();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAction = async (formData: FormData) => {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    setError("");

    if (password !== confirm) {
      setError("Parollar mos kelmadi");
      return;
    }

    setLoading(true);
    const ok = await register(username, password, confirm, storeId);
    setLoading(false);

    if (ok) {
      router.push(from ? `/login?from=${encodeURIComponent(from)}` : "/login");
    } else {
      setError("Ro'yxatdan o'tib bo'lmadi. Qayta urinib ko'ring");
    }
  };

  const isConfirmError = error === "Parollar mos kelmadi";
  const loginHref = from ? `/login?from=${encodeURIComponent(from)}` : "/login";

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl border border-zinc-200 p-8 flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-zinc-900">Hisob yaratish</h1>
        <p className="text-sm text-zinc-500">
          {from === "/checkout" ? "Buyurtmani yakunlash uchun ro'yxatdan o'ting." : `${displayName}ga qo'shiling`}
        </p>
      </div>

      <form onSubmit={async (e) => { e.preventDefault(); await handleAction(new FormData(e.currentTarget)); }} className="flex flex-col gap-4">
        <Input
          label="Foydalanuvchi nomi"
          type="text"
          name="username"
          placeholder="Foydalanuvchi nomingiz"
          required
        />
        <Input
          label="Parol"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-zinc-400 hover:text-zinc-700 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rish"}
            >
              <EyeIcon open={showPassword} />
            </button>
          }
        />
        <Input
          label="Parolni tasdiqlang"
          type={showConfirm ? "text" : "password"}
          name="confirm"
          placeholder="••••••••"
          required
          error={isConfirmError ? error : undefined}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="text-zinc-400 hover:text-zinc-700 transition-colors"
              tabIndex={-1}
              aria-label={showConfirm ? "Parolni yashirish" : "Parolni ko'rish"}
            >
              <EyeIcon open={showConfirm} />
            </button>
          }
        />
        {error && !isConfirmError && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <Button type="submit" loading={loading} className="w-full mt-1">
          Hisob yaratish
        </Button>
      </form>

      <p className="text-sm text-center text-zinc-500">
        Hisobingiz bormi?{" "}
        <Link href={loginHref} className="font-medium text-zinc-900 hover:underline">
          Kirish
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 py-16 bg-zinc-50">
      <Suspense fallback={<div className="w-full max-w-sm h-80 rounded-2xl bg-zinc-100 animate-pulse" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
