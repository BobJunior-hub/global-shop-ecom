import { BranchDetailModule } from "@/src/features/branches/BranchDetailModule";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoreDetailPage({ params }: Props) {
  const { id } = await params;
  return <BranchDetailModule storeId={id} />;
}
