// lib/local-database/collections.ts
"use client";

import { createCollection, type Collection } from "@tanstack/react-db";
import { rxdbCollectionOptions } from "@tanstack/rxdb-db-collection";
import { initDB, SubjectsDocType, type GradesDocType } from "./rxdb";

export type AppCollections = {
  grades: Collection<GradesDocType, string>;
  subjects: Collection<SubjectsDocType, string>;
};

let collectionsPromise: Promise<AppCollections> | null = null;

export async function initCollections(): Promise<AppCollections> {
  if (!collectionsPromise) {
    collectionsPromise = (async () => {
      const db = await initDB();

      const grades: Collection<GradesDocType, string> = createCollection(
        rxdbCollectionOptions<GradesDocType>({
          rxCollection: db.grades,
          startSync: true,
        })
      );

      const subjects: Collection<SubjectsDocType, string> = createCollection(
        rxdbCollectionOptions<SubjectsDocType>({
          rxCollection: db.subjects,
          startSync: true,
        })
      );

      return { grades, subjects };
    })();
  }
  return collectionsPromise;
}
