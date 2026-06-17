import Image from "next/image";
import Link from "next/link";
import { fetchCategories } from "@/src/features/products/api";

export const NavCategoriesBar = async () => {
  const categories = await fetchCategories().catch(() => []);
  if (categories.length === 0) return null;

  return (
    <div className="hidden md:block sticky top-16 z-30 bg-white border-b border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-0 overflow-x-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group flex items-center gap-1.5 px-3 py-2.5 flex-shrink-0 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
            >
              {cat.image ? (
                <div className="relative w-5 h-5 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    priority={i < 8}
                    className="object-cover"
                    sizes="20px"
                  />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-zinc-200 flex-shrink-0" />
              )}
              <span className="text-[13px] font-medium whitespace-nowrap leading-none">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
