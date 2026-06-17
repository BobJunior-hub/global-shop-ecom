import Image from "next/image";
import Link from "next/link";
import { fetchProducts } from "@/src/features/products/api";

const FALLBACKS = [
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=700&q=80",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80",
];

export const PromoBanners = async () => {
  const result = await fetchProducts().catch(() => null);
  const withImage = (result?.products ?? []).filter((p) => p.image);

  const pick = (exclude?: string) => {
    const pool = exclude ? withImage.filter((p) => p.image !== exclude) : withImage;
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const first = pick();
  const second = pick(first?.image);

  const img1 = first?.image || FALLBACKS[0];
  const img2 = second?.image || FALLBACKS[1];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 pb-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Banner 1 */}
        <Link
          href="/products"
          className="group relative rounded-2xl overflow-hidden h-52 bg-zinc-900 flex items-center"
        >
          <Image
            src={img1}
            alt="Yangi kolleksiya"
            fill
            className="object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
            sizes="50vw"
          />
          <div className="relative z-10 flex flex-col gap-2 px-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
              Minglab mahsulotlar
            </span>
            <p className="text-2xl font-bold text-white leading-tight">
              Sifat<br />Ustunligi
            </p>
            <span className="mt-2 text-xs font-semibold text-white underline underline-offset-4">
              Mahsulotlarni ko'rish →
            </span>
          </div>
        </Link>

        {/* Banner 2 */}
        <Link
          href="/products"
          className="group relative rounded-2xl overflow-hidden h-52 bg-stone-100 flex items-center"
        >
          <Image
            src={img2}
            alt="Aksessuarlar kolleksiyasi"
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            sizes="50vw"
          />
          <div className="relative z-10 flex flex-col gap-2 px-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
              Har kuni yangi takliflar
            </span>
            <p className="text-2xl font-bold text-zinc-900 leading-tight">
              Ajoyib<br />Narxlar
            </p>
            <span className="mt-2 text-xs font-semibold text-zinc-900 underline underline-offset-4">
              Ko'proq ko'rish →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};
