// lib/local-database/context.tsx
"use client";

import { createContext, useContext } from "react";
import type { AppCollections } from "./collections";

export const CollectionsContext = createContext<AppCollections | null>(null);

export function useCollections(): AppCollections {
  const ctx = useContext(CollectionsContext);
  if (!ctx) {
    throw new Error("useCollections must be inside <DatabaseProvider>");
  }
  return ctx;
}
