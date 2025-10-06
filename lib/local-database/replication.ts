"use client";

import { replicateSupabase } from "rxdb/plugins/replication-supabase";
import { supabase } from "@/lib/supabase/client";
import { GradientDatabase } from "./rxdb";

const pullModifier = (doc: any) => {
  // supabase sends nulls, RxDB prefers undefined
  Object.keys(doc).forEach((k) => {
    if (doc[k] === null) delete doc[k];
  });
  return doc;
};

const pushModifier = (doc: any) => {
  // RxDB sends undefined, Supabase prefers null
  if (!doc.updated_at) {
    doc.updated_at = new Date().toISOString();
  }
  return doc;
};

const commonConfig = {
  client: supabase,
  live: true,
  pull: {
    batchSize: 50,
    modifier: pullModifier,
  },
  push: {
    batchSize: 50,
    modifier: pushModifier,
  },
};

export function startReplication(db: GradientDatabase) {
  const gradesReplication = replicateSupabase({
    tableName: "grades",
    collection: db.grades,
    replicationIdentifier: "grades-supabase",
    ...commonConfig,
  });

  const subjectsReplication = replicateSupabase({
    tableName: "subjects",
    collection: db.subjects,
    replicationIdentifier: "subjects-supabase",
    ...commonConfig,
  });

  const semestersReplication = replicateSupabase({
    tableName: "semesters",
    collection: db.semesters,
    replicationIdentifier: "semesters-supabase",
    ...commonConfig,
  });

  const relSubjectsSemestersReplication = replicateSupabase({
    tableName: "rel_subjects_semesters",
    collection: db.relSubjectsSemesters,
    replicationIdentifier: "rel_subjects_semesters-supabase",
    ...commonConfig,
  });

  return {
    replications: [
      gradesReplication,
      subjectsReplication,
      semestersReplication,
      relSubjectsSemestersReplication,
    ],
  };
}
