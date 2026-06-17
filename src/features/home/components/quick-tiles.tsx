import Link from "next/link";

const TILES = [
  {
    label: "Yangi mahsulotlar",
    icon: "🛍️",
    href: "/products",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    label: "Arzon narxlar",
    icon: "⬇️",
    href: "/products",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    label: "Mashhur do'konlar",
    icon: "🏪",
    href: "/products",
    bg: "#fefce8",
    border: "#fef08a",
  },
  {
    label: "Yetkazib berish",
    icon: "🚚",
    href: "/products",
    bg: "#fff7ed",
    border: "#fed7aa",
  },
];

export function QuickTiles() {
  return (
    <section className="w-full px-3 sm:px-4 py-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TILES.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="group flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: tile.bg, borderColor: tile.border }}
          >
            <span className="text-2xl leading-none flex-shrink-0">{tile.icon}</span>
            <span className="text-[13px] font-semibold text-zinc-700 group-hover:text-zinc-900 leading-tight">
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
