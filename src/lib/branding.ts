export type BrandKey = "albaraka" | "pijamapro" | "texnomart";

export type BrandLocation = {
  name: string;
  address: string;
  hours: string;
  phone: string;
  mapUrl: string;
};

export type BrandSocial = {
  label: string;
  href: string;
  path: string;
};

export type BrandTheme = {
  primary: string;       // bg class,        e.g. "bg-black"
  primaryHover: string;  // hover bg class,  e.g. "hover:bg-zinc-900"
  text: string;          // text class,      e.g. "text-zinc-900"
  accent: string;        // accent text,     e.g. "text-green-500"
  accentHover: string;   // icon hover bg,   e.g. "hover:bg-green-700"
};

export type BrandConfig = {
  key: BrandKey;
  storeId: string;
  displayName: string;
  logoPath: string;
  description: string;
  metadataTitle: string;
  metadataDescription: string;
  mainColor: string;
  secondaryColor: string;
  theme: BrandTheme;
  locations: BrandLocation[];
  socials: BrandSocial[];
  icons: {
    icon: string;
    icon16: string;
    icon32: string;
    apple: string;
    android192: string;
    android512: string;
  };
};

const INSTAGRAM_PATH =
  "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z";
const TELEGRAM_PATH =
  "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z";
const FACEBOOK_PATH =
  "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";

const BRAND_CONFIGS: Record<BrandKey, BrandConfig> = {
  albaraka: {
    key: "albaraka",
    storeId: "826095a5-08ac-4658-b5da-8bc857905c86",
    displayName: "Al Baraka",
    logoPath: "/albaraka/albaraka-logo.jpeg",
    description: "Har bir munosabat uchun tanlangan kiyimlar. Sifatli mahsulotlar adolatli narxlarda.",
    metadataTitle: "Al Baraka - Onlayn do'kon",
    metadataDescription: "Al Baraka onlayn do'konida mahsulotlarni qulay va tez buyurtma qiling.",
    mainColor: "#000000",
    secondaryColor: "#16a34a",
    theme: {
      primary: "bg-brand-primary",
      primaryHover: "hover:bg-brand-primary",
      text: "text-brand-primary",
      accent: "text-brand-primary",
      accentHover: "hover:bg-brand-primary",
    },
    locations: [
      { name: "Al-Baraka — Chilonzor", address: "Chilonzor filiali", hours: "09:00 – 21:00", phone: "+998 95 501 44 47", mapUrl: "https://maps.app.goo.gl/xUJmMBQXscUix3hw9" },
      { name: "Al-Baraka — ToshMi",    address: "Toshmi filiali",    hours: "08:00 – 23:00", phone: "+998 95 502 44 47", mapUrl: "https://maps.app.goo.gl/GLH5LXCuXgxp3X946?g_st=ic" },
      { name: "Al-Baraka — Yunusobod", address: "Yunusobod filiali", hours: "09:00 – 21:00", phone: "+998 95 509 44 47", mapUrl: "https://maps.app.goo.gl/1AxPkn3jsAe3iaD18?g_st=ic" },
    ],
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/al_baraka_outlet_kg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", path: INSTAGRAM_PATH },
      { label: "Facebook",  href: "#",                                    path: FACEBOOK_PATH  },
      { label: "Telegram",  href: "https://t.me/Albarakakg",              path: TELEGRAM_PATH  },
    ],
    icons: {
      icon:       "/albaraka/favicon.ico",
      icon16:     "/albaraka/favicon-16x16.png",
      icon32:     "/albaraka/favicon-32x32.png",
      apple:      "/albaraka/apple-touch-icon.png",
      android192: "/albaraka/android-chrome-192x192.png",
      android512: "/albaraka/android-chrome-512x512.png",
    },
  },

  pijamapro: {
    key: "pijamapro",
    storeId: "e955fcd8-475a-471b-9c1b-f90b8a07f0c1",
    displayName: "Pijama Pro",
    logoPath: "/pijamapro/pijamapro-logo.png",
    description: "Qulay va sifatli pijamalar. Oilaviy uyqu kiyimlari eng yaxshi narxlarda.",
    metadataTitle: "Pijama Pro - Onlayn do'kon",
    metadataDescription: "Pijama Pro onlayn do'konida mahsulotlarni ishonchli va oson xarid qiling.",
    mainColor: "#7c3aed",
    secondaryColor: "#a78bfa",
    theme: {
      primary: "bg-brand-primary",
      primaryHover: "hover:bg-brand-primary",
      text: "text-brand-primary",
      accent: "text-brand-primary",
      accentHover: "hover:bg-brand-primary",
    },
    locations: [
      { name: "Pijama Pro — Markaz", address: "Markaz filiali", hours: "09:00 – 21:00", phone: "+998 90 000 00 00", mapUrl: "#" },
    ],
    socials: [
      { label: "Instagram", href: "#", path: INSTAGRAM_PATH },
      { label: "Telegram",  href: "#", path: TELEGRAM_PATH  },
    ],
    icons: {
      icon:       "/pijamapro/favicon.ico",
      icon16:     "/pijamapro/favicon-16x16.png",
      icon32:     "/pijamapro/favicon-32x32.png",
      apple:      "/pijamapro/apple-touch-icon.png",
      android192: "/pijamapro/android-chrome-192x192.png",
      android512: "/pijamapro/android-chrome-512x512.png",
    },
  },

  texnomart: {
    key: "texnomart",
    storeId: "b34565ee-fdce-440d-a17f-55c588b72947",
    displayName: "Texnomart",
    logoPath: "/texnomart/texnomart-logo.png",
    description: "Arzon narxlarda sifatli texnika sotib oling.",
    metadataTitle: "Texnomart - Onlayn do'kon",
    metadataDescription: "Texnomart onlayn do'konida sifatli texnikani qulay va tez buyurtma qiling.",
    mainColor: "#f5ce42",
    secondaryColor: "#080808",
    theme: {
      primary: "bg-brand-primary",
      primaryHover: "hover:bg-brand-primary",
      text: "text-brand-primary",
      accent: "text-brand-primary",
      accentHover: "hover:bg-brand-primary",
    },
    locations: [],
    socials: [
      { label: "Instagram", href: "#", path: INSTAGRAM_PATH },
      { label: "Telegram",  href: "#", path: TELEGRAM_PATH  },
    ],
    icons: {
      icon:       "/texnomart/favicon.ico",
      icon16:     "/texnomart/favicon-16x16.png",
      icon32:     "/texnomart/favicon-32x32.png",
      apple:      "/texnomart/apple-touch-icon.png",
      android192: "/texnomart/android-chrome-192x192.png",
      android512: "/texnomart/android-chrome-512x512.png",
    },
  },
};

export function getBrandByHost(host?: string | null): BrandConfig {
  // NEXT_PUBLIC_STORE_KEY overrides everything (useful for local dev testing)
  const storeKey = process.env.NEXT_PUBLIC_STORE_KEY as BrandKey | undefined;
  if (storeKey && BRAND_CONFIGS[storeKey]) {
    return BRAND_CONFIGS[storeKey];
  }

  // Host header is authoritative in production.
  // NEXT_PUBLIC_SITE_URL is a fallback for separate single-domain deployments.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const normalized = (host || siteUrl).toLowerCase();

  if (normalized.includes("pijamapro")) {
    return BRAND_CONFIGS.pijamapro;
  }

  if (normalized.includes("texnomart")) {
    return BRAND_CONFIGS.texnomart;
  }

  return BRAND_CONFIGS.albaraka;
}
