import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Al-Baraka",
  description: "Your order history",
};

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
