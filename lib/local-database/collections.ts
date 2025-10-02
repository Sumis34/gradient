// lib/local-database/collections.ts
"use client";

import { createCollection, type Collection } from "@tanstack/react-db";
import { rxdbCollectionOptions } from "@tanstack/rxdb-db-collection";
import { initDB as getDatabase, RelSubjectsSemestersDocType, SemestersDocType, SubjectsDocType, type GradesDocType } from "./rxdb";

export type AppCollections = {
  grades: Collection<GradesDocType, string>;
  subjects: Collection<SubjectsDocType, string>;
  semesters: Collection<SemestersDocType, string>;
  relSubjectsSemesters: Collection<RelSubjectsSemestersDocType, string>;
};

let collectionsPromise: Promise<AppCollections> | null = null;

export async function initCollections(): Promise<AppCollections> {
  if (!collectionsPromise) {
    collectionsPromise = (async () => {
      const db = await getDatabase();

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

      const semesters: Collection<SemestersDocType, string> = createCollection(
        rxdbCollectionOptions<SemestersDocType>({
          rxCollection: db.semesters,
          startSync: true,
        })
      );

      const relSubjectsSemesters: Collection<RelSubjectsSemestersDocType, string> = createCollection(
        rxdbCollectionOptions<RelSubjectsSemestersDocType>({
          rxCollection: db.relSubjectsSemesters,
          startSync: true,
        })
      );

      return { grades, subjects, semesters, relSubjectsSemesters };
    })();
  }
  return collectionsPromise;
}
