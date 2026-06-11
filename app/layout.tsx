import type { Metadata } from "next";
import { headers } from "next/headers";
import { Poppins } from "next/font/google";
import { Navbar } from "@/src/components/layout/navbar";
import { Footer } from "@/src/components/layout/footer";
import { MobileBottomNav } from "@/src/components/layout/mobile-bottom-nav";
import { ToastProvider } from "@/src/components/common/toast-provider";
import { CartHydrator } from "@/src/components/cart-hydrator";
import { getBrandByHost } from "@/src/lib/branding";
import { StoreProvider } from "@/src/lib/store-context";
import { BrandProvider } from "@/src/lib/brand-context";
import "./globals.css";

const BACKEND_BASE = "http://95.169.204.245/api/v1";

function isValidHex(color: string | undefined): color is string {
  return typeof color === "string" && /^#[0-9A-Fa-f]{3,8}$/.test(color);
}

async function fetchStoreColors(brand: ReturnType<typeof getBrandByHost>): Promise<{ mainColor: string; secondaryColor: string }> {
  const fallback = { mainColor: brand.mainColor, secondaryColor: brand.secondaryColor };
  try {
    const adminToken = process.env.ADMIN_API_TOKEN;
    if (!adminToken) return fallback;

    const res = await fetch(`${BACKEND_BASE}/admin/stores/${brand.storeId}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    return {
      mainColor: isValidHex(json.data?.main_color) ? json.data.main_color : brand.mainColor,
      secondaryColor: isValidHex(json.data?.secondary_color) ? json.data.secondary_color : brand.secondaryColor,
    };
  } catch {
    return fallback;
  }
}

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  const brand = getBrandByHost(host);

  return {
    title: brand.metadataTitle,
    description: brand.metadataDescription,
    icons: {
      icon: [
        { url: brand.icons.icon },
        { url: brand.icons.icon16, sizes: "16x16", type: "image/png" },
        { url: brand.icons.icon32, sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: brand.icons.apple, sizes: "180x180", type: "image/png" }],
      other: [
        {
          rel: "icon",
          url: brand.icons.android192,
          sizes: "192x192",
          type: "image/png",
        },
        {
          rel: "icon",
          url: brand.icons.android512,
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = (await headers()).get("host");
  const brand = getBrandByHost(host);
  const { mainColor, secondaryColor } = await fetchStoreColors(brand);

  return (
    <html
      lang="uz"
      className={`${poppins.variable} h-full antialiased`}
    >
      <head>
        <style>{`:root{--brand-primary:${mainColor};--brand-secondary:${secondaryColor}}`}</style>
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <BrandProvider brand={brand}>
          <StoreProvider storeId={brand.storeId}>
            <CartHydrator />
            <Navbar brand={brand} />
            <main className="flex flex-col flex-1 pb-16 md:pb-0">{children}</main>
            <Footer brand={brand} />
            <MobileBottomNav />
            <ToastProvider />
          </StoreProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
