import z from "zod";

enum FormatTypes {
  ONE_TO_SIX = "oneToSix",
}

interface Format {
  name: string;
  best: number | string;
  worst: number | string;
  passingThreshold: number | string;
  inputSchema: z.ZodNumber | z.ZodString;
  normalize: (
    grade: number | string,
    outMin?: number,
    outMax?: number
  ) => number;
  denormalize: (
    normalizedGrade: number,
    inMin?: number,
    inMax?: number
  ) => number | string;
}

const normalizeOneToSix = (grade: number, outMin = 0, outMax = 1): number => {
  return ((grade - 1) / (6 - 1)) * (outMax - outMin) + outMin;
};

const denormalizeOneToSix = (
  normalizedGrade: number,
  inMin = 0,
  inMax = 1
): number => {
  return ((normalizedGrade - inMin) / (inMax - inMin)) * (6 - 1) + 1;
};

const FORMATS: Record<FormatTypes, Format> = {
  [FormatTypes.ONE_TO_SIX]: {
    name: "1-6",
    best: 6,
    worst: 1,
    passingThreshold: 4,
    inputSchema: z.number().min(1).max(6),
    normalize: (grade, ...args) => {
      if (typeof grade !== "number") {
        throw new Error("Grade must be a number for ONE_TO_SIX format");
      }
      return normalizeOneToSix(grade as number, ...args);
    },
    denormalize: denormalizeOneToSix,
  },
};

export { FormatTypes, FORMATS };