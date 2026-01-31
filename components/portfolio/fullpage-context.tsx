"use client";

import { createContext, useContext } from "react";

export const FullPageContext = createContext<{
  scrollToSection: (index: number) => void;
} | null>(null);

export function useFullPage() {
  const ctx = useContext(FullPageContext);
  if (!ctx) {
    throw new Error(
      "useFullPage must be used inside <FullPageWrapper />"
    );
  }
  return ctx;
}
