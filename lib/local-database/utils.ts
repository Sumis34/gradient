import { startReplication } from "./replication";
import { GradientDatabase } from "./rxdb";

async function assignUserId(db: GradientDatabase, userId: string) {
  const grades = await db.grades.find().exec();
  const subjects = await db.subjects.find().exec();

  for (const subject of subjects) {
    if (!subject.user_id) {
      await subject.patch({ user_id: userId });
    }
  }

  for (const grade of grades) {
    if (!grade.user_id) {
      await grade.patch({ user_id: userId });
    }
  }
}

async function enableSync(db: GradientDatabase, userId: string) {
  await assignUserId(db, userId);

  await startReplication(db);
}

export { enableSync };
