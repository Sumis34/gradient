"use client";
import { createContext, useContext } from "react";
import { Collection, createCollection } from "@tanstack/react-db";
import { rxdbCollectionOptions } from "@tanstack/rxdb-db-collection";
import { usePersistence } from "./persistence-context";
import {
  GradesDocType,
  RelSubjectsSemestersDocType,
  SemestersDocType,
  SubjectsDocType,
} from "../lib/local-database/rxdb";

export type AppCollections = {
  grades: Collection<GradesDocType, string>;
  subjects: Collection<SubjectsDocType, string>;
  semesters: Collection<SemestersDocType, string>;
  relSubjectsSemesters: Collection<RelSubjectsSemestersDocType, string>;
};

const CollectionContext = createContext<AppCollections | null>(null);

export function CollectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = usePersistence();

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

  const relSubjectsSemesters: Collection<RelSubjectsSemestersDocType, string> =
    createCollection(
      rxdbCollectionOptions<RelSubjectsSemestersDocType>({
        rxCollection: db.relSubjectsSemesters,
        startSync: true,
      })
    );

  return (
    <CollectionContext.Provider
      value={{ grades, subjects, semesters, relSubjectsSemesters }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export const useCollections = () => {
  const ctx = useContext(CollectionContext);
  if (!ctx)
    throw new Error("useCollections must be used inside CollectionProvider");
  return ctx;
};
