const BASE_URL = "/api/v1";

type Influencer = {
  id: string;
  name: string;
  promo_code: string;
  is_active: boolean;
};

type InfluencerProductLink = {
  id: string;
  discount_percent: number;
  influencer_profit: number;
  product: { id: string; name: string };
};

async function findInfluencerByPromoCode(
  promoCode: string,
  storeId?: string,
): Promise<Influencer | null> {
  const params = new URLSearchParams({ search: promoCode, limit: "50" });
  if (storeId) params.set("store_id", storeId);
  const res = await fetch(`${BASE_URL}/influencers?${params}`);
  if (!res.ok) return null;
  const json = await res.json();
  const list: Influencer[] = json?.data ?? [];
  return list.find((inf) => inf.promo_code === promoCode && inf.is_active) ?? null;
}

async function getInfluencerProducts(influencerId: string): Promise<InfluencerProductLink[]> {
  const res = await fetch(`${BASE_URL}/influencers/${influencerId}/products?limit=200`);
  if (!res.ok) return [];
  const json = await res.json();
  return json?.data ?? [];
}

export async function applyPromoCode(
  promoCode: string,
  productId: string,
  storeId?: string,
): Promise<{ discountPercent: number } | null> {
  const influencer = await findInfluencerByPromoCode(promoCode, storeId);
  if (!influencer) return null;
  const products = await getInfluencerProducts(influencer.id);
  const match = products.find((p) => p.product?.id === productId);
  if (!match) return null;
  return { discountPercent: match.discount_percent };
}
