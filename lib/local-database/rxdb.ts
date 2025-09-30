// lib/local-database/rxdb.ts
"use client";

import {
  createRxDatabase,
  addRxPlugin,
  type RxDatabase,
  type RxCollection,
} from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";

addRxPlugin(RxDBDevModePlugin);

// ---- Types ----
export type GradeDoc = {
  id: string;
  created_at?: string;
  weight?: number;
  subject_id: string;
  grade: number;
  description?: string;
  date: string;
  user_id: string;
};

export type GradeCollection = RxCollection<GradeDoc>;

export type GradientDatabase = RxDatabase<{
  grades: GradeCollection;
}>;

// ---- Schema ----
const gradeSchema = {
  title: "grades",
  version: 0,
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    created_at: { type: "string", format: "date-time" },
    weight: { type: "integer" },
    subject_id: { type: "string", maxLength: 100 },
    grade: { type: "number" },
    description: { type: "string" },
    date: { type: "string", format: "date-time" },
    user_id: { type: "string", maxLength: 100 },
  },
  required: ["id", "user_id", "subject_id", "grade", "date"],
} as const;

let dbPromise: Promise<GradientDatabase> | null = null;

export async function initDB(): Promise<GradientDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await createRxDatabase<GradientDatabase>({
        name: "gradient",
        storage: wrappedValidateAjvStorage({
          storage: getRxStorageDexie(),
        }),
      });

      await db.addCollections({
        grades: { schema: gradeSchema },
      });

      return db;
    })();
  }
  return dbPromise;
}
