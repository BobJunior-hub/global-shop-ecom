import { ProductDetailClient } from "@/src/features/products/components/product-detail-client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetailClient productId={id} />;
}
