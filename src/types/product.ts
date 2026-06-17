export type ApiVariantPhoto = {
  id: string;
  url: string;
};

export type ApiVariant = {
  id: string;
  price_category_id: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  discounted_price?: number | null;
  weight: number;
  photo: ApiVariantPhoto[];
  price_category?: {
    id: string;
    name: string;
    price: number;
    store: { id: string; name: string; description: string };
  } | null;
};

export type ApiProduct = {
  id: string;
  name: string;
  description: string;
  subcategory_id: string;
  store_id: string;
  active: boolean;
  code: string;
  avg_star?: number;
  variants: ApiVariant[];
  subcategory: {
    id: string;
    name: string;
    product_category: {
      id: string;
      name: string;
    };
  } | null;
  store: {
    id: string;
    name: string;
    description: string;
  };
};

export type ApiProductsResponse = {
  success: boolean;
  data: ApiProduct[];
  meta_data: {
    current_page: number;
    page_size: number;
    first_page: number;
    last_page: number;
    total_records: number;
  };
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number | null;
  pricePerKg: number;
  discountedPricePerKg: number | null;
  image: string;
  images: string[];
  category: string;
  category_id: string;
  subcategory: string;
  subcategory_id: string;
  stock: number;
  avgStar: number;
  variants: ApiVariant[];
};
