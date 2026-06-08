import type { Product } from "./product";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type ApiCartProduct = {
  id: string;
  name: string;
  description?: string;
  code?: string;
  active?: boolean;
  subcategory_id?: string;
  store_id?: string;
  subcategory?: {
    id: string;
    name: string;
    product_category?: {
      id: string;
      name: string;
    };
  };
  store?: {
    id: string;
    name: string;
    description?: string;
  };
};

export type ApiCartVariant = {
  id?: string;
  size?: string;
  color?: string;
  price?: number;
  discounted_price?: number | null;
  weight?: number;
  stock?: number;
  price_category_id?: string;
  price_category?: {
    id: string;
    name: string;
    price: number;
    store?: { id: string; name: string; description?: string };
  } | null;
  photo?: { id: string; url: string }[];
  product?: ApiCartProduct;
};

export type ApiCartItem = {
  id: string;
  user_id: string;
  variant_id: string;
  qty: number;
  variant: ApiCartVariant | Record<string, never>;
};

export type ApiCartGroup = {
  store: {
    id: string;
    name: string;
    description: string;
  };
  items: ApiCartItem[];
};

export type ApiCartResponse = {
  success: boolean;
  data: ApiCartGroup[] | null;
};
