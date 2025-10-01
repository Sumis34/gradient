// lib/local-database/collections.ts
"use client";

import { createCollection, type Collection } from "@tanstack/react-db";
import { rxdbCollectionOptions } from "@tanstack/rxdb-db-collection";
import { initDB, SubjectDoc, type GradeDoc } from "./rxdb";

export type AppCollections = {
  grades: Collection<GradeDoc, string>;
  subjects: Collection<SubjectDoc, string>;
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

      const subjects: Collection<SubjectDoc, string> = createCollection(
        rxdbCollectionOptions<SubjectDoc>({
          rxCollection: db.subjects,
          startSync: true,
        })
      );

      return { grades, subjects };
    })();
  }
  return collectionsPromise;
}
