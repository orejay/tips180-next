"use client";

import { createContext, useContext } from "react";

export type LeagueCatalog = {
  logos: Record<string, string>;
  names: Record<string, string>;
};

const LeagueCatalogContext = createContext<LeagueCatalog>({ logos: {}, names: {} });

export function LeagueCatalogProvider({
  value,
  children,
}: {
  value: LeagueCatalog;
  children: React.ReactNode;
}) {
  return <LeagueCatalogContext.Provider value={value}>{children}</LeagueCatalogContext.Provider>;
}

export function useLeagueCatalog(): LeagueCatalog {
  return useContext(LeagueCatalogContext);
}
