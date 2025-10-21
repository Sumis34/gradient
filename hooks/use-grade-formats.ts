import { FORMATS, FormatTypes } from "@/lib/grades/formats";

export default function useGradeFormat(format: FormatTypes) {
  return FORMATS[format];
}