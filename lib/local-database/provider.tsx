// lib/local-database/provider.tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CollectionsContext } from "./context";
import { initCollections, type AppCollections } from "./collections";

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<AppCollections | null>(null);

  useEffect(() => {
    let mounted = true;
    initCollections().then((cols) => {
      if (mounted) setCollections(cols);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!collections) return null; // could render <Loader/>

  return (
    <CollectionsContext.Provider value={collections}>
      {children}
    </CollectionsContext.Provider>
  );
}
