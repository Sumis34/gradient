// lib/local-database/rxdb.ts
"use client";

import {
  createRxDatabase,
  addRxPlugin,
  type RxDatabase,
  type RxCollection,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
} from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";

if (process.env.NODE_ENV === "development") {
  addRxPlugin(RxDBDevModePlugin);
}

// ---- Schema ----
const gradesSchemaLiteral = {
  title: "grades",
  version: 0,
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    created_at: { type: "string", format: "date-time" },
    weight: { type: "integer" },
    subject_id: { type: "string", maxLength: 100 },
    value: { type: "number" },
    name: { type: "string" },
    date: { type: "string", format: "date-time" },
    user_id: { type: "string", maxLength: 100 },
  },
  required: ["id", "subject_id", "value", "date"],
} as const;

const gradesSchemaTyped = toTypedRxJsonSchema(gradesSchemaLiteral);

export type GradesDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof gradesSchemaTyped
>;
export const gradesSchema: RxJsonSchema<GradesDocType> = gradesSchemaLiteral;

export type GradeCollection = RxCollection<GradesDocType>;

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
    semester_id: { type: "string", maxLength: 100 },
    _deleted: { type: "boolean" },
  },
  required: ["id", "name", "semester_id"],
} as const;

const subjectsSchemaTyped = toTypedRxJsonSchema(subjectSchema);

export type SubjectsDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof subjectsSchemaTyped
>;

export const subjectsSchema: RxJsonSchema<SubjectsDocType> =
  subjectsSchemaTyped;

export type SubjectsCollection = RxCollection<SubjectsDocType>;

const semestersSchemaLiteral = {
  title: "semesters",
  version: 0,
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    created_at: { type: "string", format: "date-time" },
    name: { type: "string" },
    description: { type: "string" },
    user_id: { type: "string", maxLength: 100 },
  },
  required: ["id", "name"],
} as const;

const semestersSchemaTyped = toTypedRxJsonSchema(semestersSchemaLiteral);

export type SemestersDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof semestersSchemaTyped
>;

export const semestersSchema: RxJsonSchema<SemestersDocType> =
  semestersSchemaLiteral;

export type SemestersCollection = RxCollection<SemestersDocType>;

let dbPromise: Promise<GradientDatabase> | null = null;

export type GradientDatabase = RxDatabase<{
  grades: GradeCollection;
  subjects: SubjectsCollection;
  semesters: SemestersCollection;
}>;

async function createDatabase(): Promise<GradientDatabase> {
  const db = await createRxDatabase<GradientDatabase>({
    name: "gradient",
    storage: wrappedValidateAjvStorage({
      storage: getRxStorageDexie(),
    }),
  });

  await db.addCollections({
    grades: { schema: gradesSchema },
    subjects: { schema: subjectSchema },
    semesters: { schema: semestersSchema },
  });

  return db;
}

/**
 * Returns the singleton instance of the GradientDatabase.
 * Ensures the DB is only initialized once.
 */
export function getDB(): Promise<GradientDatabase> {
  if (!dbPromise) {
    dbPromise = createDatabase();
  }
  return dbPromise;
}