// lib/local-database/collections.ts
"use client";

import { createCollection, type Collection } from "@tanstack/react-db";
import { rxdbCollectionOptions } from "@tanstack/rxdb-db-collection";
import { initDB, type GradeDoc } from "./rxdb";

export type AppCollections = {
  grades: Collection<GradeDoc, string>;
};

let collectionsPromise: Promise<AppCollections> | null = null;

export async function initCollections(): Promise<AppCollections> {
  if (!collectionsPromise) {
    collectionsPromise = (async () => {
      const db = await initDB();

      const grades: Collection<GradeDoc, string> = createCollection(
        rxdbCollectionOptions<GradeDoc>({
          rxCollection: db.grades,
          startSync: true,
        })
      );

      return { grades };
    })();
  }
  return collectionsPromise;
}
