"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => (
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
        iconTheme: { primary: "#000000", secondary: "#fff" },
      },
    }}
  />
);
