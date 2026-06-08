import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | Al-Baraka",
  description: "Your shopping cart",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
