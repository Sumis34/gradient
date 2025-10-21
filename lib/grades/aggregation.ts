import { GradesDocType } from "../local-database/rxdb";

type MinimalGrade = Pick<GradesDocType, "weight" | "value">;

const best = (normalizedGrades: MinimalGrade[]): number | null => {
  const max = Math.max(...normalizedGrades.map((grade) => grade.value));
  return max === -Infinity ? null : max;
};

const worst = (normalizedGrades: MinimalGrade[]): number | null => {
  const min = Math.min(...normalizedGrades.map((grade) => grade.value));
  return min === Infinity ? null : min;
};

const weightedAverage = (normalizedGrades: MinimalGrade[]): number => {
  const totalWeight = normalizedGrades.reduce(
    (sum, current) => sum + (current.weight ?? 0),
    0
  );

  if (totalWeight === 0) return 0;

  return (
    normalizedGrades.reduce(
      (sum, current) => sum + current.value * (current.weight ?? 0),
      0
    ) / totalWeight
  );
};

export { best, worst, weightedAverage };
