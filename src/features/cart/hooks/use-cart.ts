import { useCartStore } from "@/src/store/cart-store";

export const useCart = () => {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalCount = useCartStore((s) => s.totalCount);
  const totalPrice = useCartStore((s) => s.totalPrice);

  return {
    items,
    clearCart,
    totalCount: totalCount(),
    totalPrice: totalPrice(),
  };
};
