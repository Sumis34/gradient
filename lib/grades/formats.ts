import z from "zod";

enum FormatTypes {
  ONE_TO_SIX = "oneToSix",
}

type NormalizerFn = (
  grade: number | string,
  outMin?: number,
  outMax?: number
) => number;

type DenormalizerFn = (
  normalizedGrade: number,
  inMin?: number,
  inMax?: number
) => number;

interface Format {
  name: string;
  passingThreshold: number;
  inputSchema: z.ZodNumber | z.ZodString;
  normalize: NormalizerFn;
  denormalize: DenormalizerFn;
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
    passingThreshold: 0.6,
    inputSchema: z.number().min(1).max(6),
    normalize: (grade, ...args) => {
      if (typeof grade !== "number") {
        throw new Error("Grade must be a number for ONE_TO_SIX format");
      }
      return normalizeOneToSix(grade as number, ...args);
    },
    denormalize: (normalizedGrade, ...args) => {
      const grade = denormalizeOneToSix(normalizedGrade, ...args);
      const rounded = Math.round(grade * 100) / 100;
      return rounded;
    },
  },
};

export { FormatTypes, FORMATS, type NormalizerFn, type DenormalizerFn };
