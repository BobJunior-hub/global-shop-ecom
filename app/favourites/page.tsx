// "use client";

// import { useFavouritesStore } from "@/src/store/favourites-store";
// import { ProductGrid } from "@/src/features/products/components/product-grid";
// import { EmptyState } from "@/src/components/common/empty-state";

// export default function FavouritesPage() {
//   const { items } = useFavouritesStore();

//   return (
//     <div className="max-w-7xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
//       <h1 className="text-2xl font-semibold text-zinc-900">Tanlanganlar</h1>

//       {items.length === 0 ? (
//         <EmptyState
//           title="Tanlanganlar yo'q"
//           description="Saqlash uchun istalgan mahsulotdagi yurakchani bosing."
//         />
//       ) : (
//         <>
//           <p className="text-sm text-zinc-500">{items.length} ta saqlangan</p>
//           <ProductGrid products={items} />
//         </>
//       )}
//     </div>
//   );
// }

export default function FavouritesPage() {
  return null;
}
