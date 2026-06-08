import { Suspense } from "react";
import { ProductsModule } from "@/src/features/products/ProductsModule";
import { Loader } from "@/src/components/common/loader";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center py-20"><Loader label="Loading products..." /></div>}>
      <ProductsModule />
    </Suspense>
  );
}
