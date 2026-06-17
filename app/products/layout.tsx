import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Al-Baraka",
  description: "Browse our products",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
