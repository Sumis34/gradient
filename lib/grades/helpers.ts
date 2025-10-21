enum Format {
  ONE_TO_SIX,
  A_TO_F,
}

const normalizeGrade = (
  grade: number | string,
  format: Format = Format.ONE_TO_SIX
): number => {
  switch (format) {
    case Format.ONE_TO_SIX:
      if (typeof grade === "string") {
        throw new Error("Grade must be a number for ONE_TO_SIX format");
      }
      return normalizeOneToSix(grade);
    default:
      throw new Error("Unsupported grade format");
  }
};

const normalizeOneToSix = (grade: number, outMin = 0, outMax = 1): number => {
  return ((grade - 1) / (6 - 1)) * (outMax - outMin) + outMin;
};

const denormalizeGrade = (normalizedGrade: number, format: Format) => {
  switch (format) {
    case Format.ONE_TO_SIX:
      return denormalizeOneToSix(normalizedGrade);
    default:
      throw new Error("Unsupported grade format");
  }
};

const denormalizeOneToSix = (normalizedGrade: number, inMin = 0, inMax = 1): number => {
  return ((normalizedGrade - inMin) / (inMax - inMin)) * (6 - 1) + 1;
}

export { Format, normalizeGrade, denormalizeGrade };
