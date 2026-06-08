import type { Product } from "@/src/types/product";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: Product[];
};

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
