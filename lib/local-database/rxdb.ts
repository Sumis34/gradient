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

export type SubjectDoc = {
  id: string;
  created_at?: string;
  name: string;
  description?: string;
  user_id: string;
  updated_at?: string;
  _deleted?: boolean;
};

export type SubjectCollection = RxCollection<SubjectDoc>;

export type GradientDatabase = RxDatabase<{
  grades: GradeCollection;
  subjects: SubjectCollection;
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

const subjectSchema = {
  title: "subjects",
  version: 0,
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    created_at: { type: "string", format: "date-time" },
    name: { type: "string" },
    description: { type: "string" },
    user_id: { type: "string", maxLength: 100 },
    updated_at: { type: "string", format: "date-time" },
    _deleted: { type: "boolean" },
  },
  required: ["id", "name", "user_id"],
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
        subjects: { schema: subjectSchema },
      });

      return db;
    })();
  }
  return dbPromise;
}
