import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Al-Baraka",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
