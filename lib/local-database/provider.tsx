// lib/local-database/provider.tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CollectionsContext } from "./context";
import { initCollections, type AppCollections } from "./collections";

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<AppCollections | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const cols = await initCollections();
      if (mounted) setCollections(cols);
    })().catch((err) => console.error("DB init failed", err));

    return () => {
      mounted = false;
    };
  }, []);

  if (!collections) return null; // TODO loader

  return (
    <CollectionsContext.Provider value={collections}>
      {children}
    </CollectionsContext.Provider>
  );
}
