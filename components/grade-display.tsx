import { cn } from "@/lib/utils";

function GradeDisplay({
  state,
  formattedAverageGrade,
}: {
  state: "pass" | "fail" | "empty";
  formattedAverageGrade: number | string;
}) {
  return (
    <div
      className={cn(
        state === "fail" && "text-red-500 bg-red-500/20",
        state === "pass" && "text-green-500 bg-green-500/20",
        state === "empty" && "text-muted-foreground bg-muted",
        "p-3 rounded-md font-mono"
      )}
    >
      {formattedAverageGrade}
    </div>
  );
}

export default GradeDisplay;
