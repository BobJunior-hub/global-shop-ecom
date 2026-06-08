"use client";

import { createContext, useContext } from "react";

const StoreContext = createContext<string>("");

export function StoreProvider({
  storeId,
  children,
}: {
  storeId: string;
  children: React.ReactNode;
}) {
  return <StoreContext.Provider value={storeId}>{children}</StoreContext.Provider>;
}

export function useStoreId(): string {
  return useContext(StoreContext);
}
