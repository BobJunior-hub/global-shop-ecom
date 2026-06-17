import Image from "next/image";
import Link from "next/link";
import { fetchCategories } from "@/src/features/products/api";

export const CategoryRow = async () => {
  const categories = await fetchCategories();
  if (categories.length === 0) return null;

  return (
    <section className="w-full px-3 sm:px-4 py-2 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group flex items-center gap-2 flex-shrink-0 snap-start px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              {cat.image ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    priority={i < 6}
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex-shrink-0" />
              )}
              <span className="text-[13px] font-medium text-zinc-600 group-hover:text-zinc-900 whitespace-nowrap transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
