"use client";

import { useRef, useState } from "react";
import { Input } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import type { ApiDeliveryType } from "../transactionsApi";

const MAX_DIGITS = 9;

function formatDigits(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, MAX_DIGITS);
  let out = "";
  if (d.length > 0) out += d.slice(0, 2);
  if (d.length > 2) out += "-" + d.slice(2, 5);
  if (d.length > 5) out += "-" + d.slice(5, 7);
  if (d.length > 7) out += "-" + d.slice(7, 9);
  return out;
}

type Props = {
  loading: boolean;
  deliveryTypes: ApiDeliveryType[];
  onFileChange: (file: File | null) => void;
  receiptFile: File | null;
  defaultAddress?: string;
  defaultPhone?: string;
};

export const ShippingForm = ({ loading, deliveryTypes, onFileChange, receiptFile, defaultAddress, defaultPhone }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [digits, setDigits] = useState(() =>
    formatDigits((defaultPhone ?? "").replace(/^(\+?998)/, ""))
  );

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDigits(formatDigits(e.target.value));
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-zinc-900">Yetkazib berish ma'lumotlari</h2>

      <Input
        label="Manzil"
        name="address"
        placeholder="Amir Temur ko'chasi, 1, Toshkent"
        required
        defaultValue={defaultAddress}
      />
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-700">Telefon raqami</label>
        <div className="flex items-center w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-zinc-900 focus-within:border-transparent transition-all">
          <span className="text-sm text-zinc-800 shrink-0 pr-1 select-none">+998</span>
          <input
            type="tel"
            value={digits}
            onChange={handlePhone}
            placeholder="90-123-45-67"
            required
            minLength={12}
            maxLength={12}
            className="flex-1 text-sm text-zinc-900 bg-transparent outline-none placeholder-zinc-400"
          />
          <input type="hidden" name="phone_number" value={digits ? "+998" + digits.replace(/-/g, "") : ""} />
        </div>
       </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-700">Chek (kvitansiya)</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-3 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 cursor-pointer hover:bg-zinc-50 transition-colors"
        >
          <span className="shrink-0 px-3 py-1 rounded-md bg-zinc-900 text-white text-xs font-semibold">
            Fayl tanlash
          </span>
          <span className="text-sm text-zinc-400 truncate">
            {receiptFile ? receiptFile.name : "Fayl tanlanmagan"}
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </div>

      {deliveryTypes.length > 0 && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-700">Yetkazib berish turi</label>
          <select
            name="delivery_type_id"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            {deliveryTypes.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
        Buyurtma berish
      </Button>
    </div>
  );
};
