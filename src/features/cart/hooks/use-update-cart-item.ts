import { useCartStore } from "@/src/store/cart-store";

export const useUpdateCartItem = () => {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return { updateQuantity, removeItem };
};
