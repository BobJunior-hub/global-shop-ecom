import type { CartItem } from "./cart";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};
