import { GradesDocType } from "../local-database/rxdb";

type MinimalGrade = Pick<GradesDocType, "weight" | "value">;

const best = (normalizedGrades: MinimalGrade[]): number => {
  return Math.max(...normalizedGrades.map((grade) => grade.value));
};

const worst = (normalizedGrades: MinimalGrade[]): number => {
  return Math.min(...normalizedGrades.map((grade) => grade.value));
};

const weightedAverage = (normalizedGrades: MinimalGrade[]): number => {
  return (
    normalizedGrades.reduce(
      (sum, current) => sum + current.value * ((current.weight ?? 0) / 100),
      0
    ) / normalizedGrades.length
  );
};

export { best, worst, weightedAverage };
