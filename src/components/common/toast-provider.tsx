"use client";

import { Toaster } from "react-hot-toast";
import { useBrand } from "@/src/lib/brand-context";

export const ToastProvider = () => {
  const { mainColor, secondaryColor } = useBrand();
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 10000,
        style: {
          borderRadius: "12px",
          background: "#18181b",
          color: "#fff",
          fontSize: "14px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: mainColor, secondary: secondaryColor },
        },
      }}
    />
  );
};
