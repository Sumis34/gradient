"use client";

import { replicateSupabase } from "rxdb/plugins/replication-supabase";
import { supabase } from "@/lib/supabase/client";
import { GradientDatabase, initDB } from "./rxdb";

let started = false;

const pullModifier = (doc: any) => {
  // supabase sends nulls, RxDB prefers undefined
  Object.keys(doc).forEach((k) => {
    if (doc[k] === null) delete doc[k];
  });
  return doc;
};

export async function startReplication(db: GradientDatabase) {
  if (started) return;
  started = true;

  const gradesReplication = replicateSupabase({
    tableName: "grades",
    client: supabase,
    collection: db.grades,
    replicationIdentifier: "grades-supabase",
    live: true,
    pull: {
      batchSize: 50,
      modifier: pullModifier,
    },
    push: {
      batchSize: 50,
    },
    modifiedField: "updated_at",
  });

  const subjectsReplication = replicateSupabase({
    tableName: "subjects",
    client: supabase,
    collection: db.subjects,
    replicationIdentifier: "subjects-supabase",
    live: true,
    pull: {
      batchSize: 50,
      modifier: pullModifier,
    },
    push: {
      batchSize: 50,
    },
    modifiedField: "updated_at",
  });

  gradesReplication.error$.subscribe((err) =>
    console.error("[replication error]", err)
  );

  subjectsReplication.error$.subscribe((err) =>
    console.error("[replication error]", err)
  );

  await gradesReplication.awaitInitialReplication();
  await subjectsReplication.awaitInitialReplication();
  console.log("Replication ready");
}
