import type { ApiProduct, ApiProductsResponse, ApiVariant, Product } from "@/src/types/product";

const BASE_URL = "/api/v1";

export function getVariantPrice(v: ApiVariant): number {
  if (v.price > 0) return v.price;
  if (v.price_category && v.weight > 0)
    return Math.round((v.weight / 1000) * v.price_category.price);
  return v.price_category?.price ?? 0;
}

export function getVariantDiscountedPrice(v: ApiVariant): number | null {
  if (!v.discounted_price) return null;
  if (v.price > 0) return v.discounted_price;
  if (v.weight > 0) return Math.round((v.weight / 1000) * v.discounted_price);
  return v.discounted_price;
}

export function mapApiProduct(p: ApiProduct): Product {
  const price = p.variants?.[0] ? getVariantPrice(p.variants[0]) : 0;
  const discountedPrice = p.variants?.[0] ? getVariantDiscountedPrice(p.variants[0]) : null;
  const pricePerKg = p.variants?.[0]?.price_category?.price ?? 0;
  const firstVariant = p.variants?.[0];
  const discountedPricePerKg =
    firstVariant?.price === 0 && firstVariant?.weight > 0 && firstVariant?.discounted_price
      ? firstVariant.discounted_price
      : null;
  const stock = p.variants?.[0]?.stock ?? 0;
  // Images come from variant.photo arrays
  const images = (p.variants ?? [])
    .flatMap((v) => v.photo ?? [])
    .map((ph) => ph.url)
    .filter(Boolean);
  const image = images[0] ?? "";
  const category = p.subcategory?.product_category?.name ?? "";
  const category_id = p.subcategory?.product_category?.id ?? "";
  const subcategory = p.subcategory?.name ?? "";
  const subcategory_id = p.subcategory_id ?? "";
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    price,
    discountedPrice,
    pricePerKg,
    discountedPricePerKg,
    image,
    images,
    category,
    category_id,
    subcategory,
    subcategory_id,
    stock,
    avgStar: p.avg_star ?? 0,
    variants: p.variants ?? [],
  };
}

export type ProductsPage = {
  products: Product[];
  meta: ApiProductsResponse["meta_data"];
};

export async function fetchProducts(
  search?: string,
  categoryId?: string,
  subcategoryId?: string,
  page = 1,
  storeId?: string,
): Promise<ProductsPage> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (categoryId) params.set("product_category_id", categoryId);
  if (subcategoryId) params.set("subcategory_id", subcategoryId);
  if (page > 1) params.set("page", String(page));
  if (storeId) params.set("store_id", storeId);
  const qs = params.toString();
  const url = `${BASE_URL}/products/public${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  const json: ApiProductsResponse = await res.json();
  if (!json.success) throw new Error("API error");
  return { products: json.data.map(mapApiProduct), meta: json.meta_data };
}

export type StoreCategory = { id: string; name: string };

export type CategoryInfo = {
  id: string;
  name: string;
  image: string;
};

type ApiCategory = {
  id: string;
  name: string;
  photo?: { id: string; url: string } | null;
  store?: { id: string; name: string; logo_url?: string };
};

type ApiCategoriesResponse = {
  success: boolean;
  data: ApiCategory[];
};

export async function fetchCategories(storeId?: string): Promise<CategoryInfo[]> {
  try {
    const params = new URLSearchParams();
    if (storeId) params.set("store_id", storeId);
    const qs = params.toString();
    const res = await fetch(`${BASE_URL}/product-categories${qs ? `?${qs}` : ""}`, { cache: "no-store" });
    if (!res.ok) return [];
    const json: ApiCategoriesResponse = await res.json();
    if (!json.success) return [];
    return json.data.map((c) => ({ id: c.id, name: c.name, image: c.photo?.url ?? c.store?.logo_url ?? "" }));
  } catch {
    return [];
  }
}

export type SubcategoryInfo = { id: string; name: string; categoryId: string; image: string };

type ApiSubcategoriesResponse = {
  success: boolean;
  data: {
    id: string;
    name: string;
    photo: { url: string } | null;
    product_category: {
      id: string;
      name: string;
      store?: { logo_url: string };
    };
  }[];
};

export async function fetchSubcategories(categoryId?: string, storeId?: string): Promise<SubcategoryInfo[]> {
  try {
    const params = new URLSearchParams({ limit: "100" });
    if (categoryId) params.set("product_category_id", categoryId);
    if (storeId) params.set("store_id", storeId);
    const res = await fetch(`${BASE_URL}/subcategories?${params}`, { cache: "no-store" });
    if (!res.ok) return [];
    const json: ApiSubcategoriesResponse = await res.json();
    if (!json.success) return [];
    return json.data.map((s) => ({
      id: s.id,
      name: s.name,
      categoryId: s.product_category.id,
      image: s.photo?.url || s.product_category.store?.logo_url || "",
    }));
  } catch {
    return [];
  }
}

export async function fetchSubcategoryById(id: string): Promise<SubcategoryInfo | null> {
  try {
    const res = await fetch(`${BASE_URL}/subcategories/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success) return null;
    const s = json.data;
    return { id: s.id, name: s.name, categoryId: s.product_category.id, image: s.photo?.url || s.product_category?.store?.logo_url || "" };
  } catch {
    return null;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success) return null;
    return mapApiProduct(json.data);
  } catch {
    return null;
  }
}
