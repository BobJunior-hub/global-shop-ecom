import { authFetch } from "@/src/services/auth-fetch";

const BASE_URL = "/api/v1";


async function extractError(res: Response, fallback: string): Promise<never> {
  try {
    const body = await res.json();
    throw new Error(body?.message ?? body?.error ?? fallback);
  } catch (e) {
    if (e instanceof Error && e.message !== fallback) throw e;
    throw new Error(fallback);
  }
}

export type TransactionItem = {
  variant_id: string;
  qty: number;
};

export type CreateTransactionPayload = {
  address: string;
  phone_number: string;
  delivery_type_id?: string;
  items: TransactionItem[];
  receipt?: string;
};

export type ApiDeliveryType = {
  id: string;
  name: string;
};

export type ApiTransactionStatus = {
  id: string;
  name: string;
};

export type ApiVariantPhoto = {
  id: string;
  url: string;
};

export type ApiVariantProduct = {
  id: string;
  name: string;
  description: string;
  code: string;
};

export type ApiVariant = {
  id: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  weight: number | null;
  photos?: ApiVariantPhoto[];
  product: ApiVariantProduct;
};

export type ApiTransactionItem = {
  id: string;
  qty: number;
  amount: string;
  variant: ApiVariant;
};

export type ApiTransaction = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  status_id: string;
  delivery_type_id: string;
  receipt: string;
  address: string;
  phone_number: string;
  delivery_type: ApiDeliveryType | Record<string, never>;
  status: ApiTransactionStatus | Record<string, never>;
  items?: ApiTransactionItem[];
};

export async function fetchMyTransactions(token: string): Promise<ApiTransaction[]> {
  try {
    const res = await authFetch(`${BASE_URL}/transactions/my`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchMyTransactionsCount(token: string): Promise<number> {
  try {
    const res = await authFetch(`${BASE_URL}/transactions/my`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const json = await res.json();
    return json.meta_data?.total_records ?? 0;
  } catch {
    return 0;
  }
}

export type ApiReceipt = {
  id: string;
  created_at: string;
  updated_at: string;
  url: string;
};

export async function uploadReceipt(token: string | null, file: File): Promise<ApiReceipt> {
  const form = new FormData();
  form.append("file", file);
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}/receipts/upload`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) await extractError(res, "Chekni yuklash muvaffaqiyatsiz bo'ldi.");
  const json = await res.json();
  return json.data as ApiReceipt;
}

export async function fetchDeliveryTypes(): Promise<ApiDeliveryType[]> {
  try {
    const res = await fetch(`${BASE_URL}/delivery-types`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchDeliveryTypeById(id: string): Promise<ApiDeliveryType | null> {
  try {
    const res = await fetch(`${BASE_URL}/delivery-types/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? json) as ApiDeliveryType;
  } catch {
    return null;
  }
}

export async function createTransaction(
  token: string | null,
  payload: CreateTransactionPayload
): Promise<void> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await authFetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) await extractError(res, "Buyurtma yaratib bo'lmadi.");
}
