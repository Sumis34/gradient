"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { addRxPlugin } from "rxdb/plugins/core";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getDB, GradientDatabase } from "../lib/local-database/rxdb";

if (process.env.NODE_ENV === "development") {
  addRxPlugin(RxDBDevModePlugin);
}

const PersistenceContext = createContext<GradientDatabase | null>(null);

export function PersistenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [db, setDb] = useState<GradientDatabase | null>(null);

  useEffect(() => {
    let mounted = true;

    getDB().then((database) => {
      if (mounted) setDb(database);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!db) return null; // or a loading spinner

  return (
    <PersistenceContext.Provider value={db}>
      {children}
    </PersistenceContext.Provider>
  );
}

export const usePersistence = () => {
  const ctx = useContext(PersistenceContext);
  if (!ctx)
    throw new Error("usePersistence must be used inside PersistenceProvider");
  return ctx;
};
