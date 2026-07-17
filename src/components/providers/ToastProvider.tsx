"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#ffffff",
          color: "#26243b",
          border: "1px solid #e8e2d6",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(38,36,59,0.10)",
          fontSize: "14px",
        },
        success: { iconTheme: { primary: "#4f7a52", secondary: "#ffffff" } },
        error: { iconTheme: { primary: "#a8564c", secondary: "#ffffff" } },
      }}
    />
  );
}
