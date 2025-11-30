"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientWrapper({ children }) {
  return (
    <ClerkProvider>
      {children}
      <ToastContainer position="bottom-right" />
    </ClerkProvider>
  );
}
