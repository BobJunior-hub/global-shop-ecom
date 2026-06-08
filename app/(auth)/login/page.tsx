"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAction = async (formData: FormData) => {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    setError("");
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) {
      router.refresh();
      router.push(from);
    } else {
      setError("Noto'g'ri foydalanuvchi nomi yoki parol");
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl border border-zinc-200 p-8 flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-zinc-900">Xush kelibsiz</h1>
        <p className="text-sm text-zinc-500">
          {from === "/checkout"
            ? "Xaridni yakunlash uchun kiring."
            : "Hisobingizga kiring"}
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
          error={error || undefined}
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
        <Button type="submit" loading={loading} className="w-full mt-1">
          Kirish
        </Button>
      </form>

      <p className="text-sm text-center text-zinc-500">
        Hisob yo'qmi?{" "}
        <Link href={from !== "/products" ? `/register?from=${from}` : "/register"} className="font-medium text-zinc-900 hover:underline">
          Ro'yxatdan o'tish
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 py-16 bg-zinc-50">
      <Suspense fallback={<div className="w-full max-w-sm h-80 rounded-2xl bg-zinc-100 animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
