import Link from "next/link";
import { Card, CardDescription, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";
import { eq, useLiveQuery, count } from "@tanstack/react-db";
import { useCollections } from "@/context/collection-context";
import { useAuth } from "@/hooks/use-auth";
import useGradeFormat from "@/hooks/use-grade-formats";
import { weightedAverage } from "@/lib/grades/aggregation";
import GradeDisplay from "./grade-display";

export default function SubjectCard({
  subject,
  semester,
}: {
  subject: { id: string; name: string; description?: string };
  semester: { id: string; name: string };
}) {
  const { grades: gradesCollection } = useCollections();
  const { defaultGradeFormat } = useAuth();
  const { denormalize, passingThreshold } = useGradeFormat(defaultGradeFormat);

  const { data: grades } = useLiveQuery(
    (q) =>
      q
        .from({ grade: gradesCollection })
        .select(({ grade }) => ({
          value: grade.value,
          weight: grade.weight,
        }))
        .where(({ grade }) => eq(grade.subject_id, subject.id)),
    [subject.id]
  );

  const gradesCount = grades.length;
  const empty = gradesCount === 0;

  const stack = Array(empty ? 1 : Math.min(gradesCount, 3)).fill(null);

  const average = weightedAverage(grades);
  const formattedAverageGrade = average === 0 ? "0.00" : denormalize(average).toFixed(2);

  const pass = average >= passingThreshold;

  return (
    <Link
      href={`/app/semester/${semester.id}/subject/${subject.id}`}
      key={subject.id}
    >
      <Card className="overflow-hidden cursor-pointer group">
        <CardHeader className="gap-0">
          <div className="flex gap-6 text-3xl items-center relative">
            {
              <GradeDisplay
                state={empty ? "empty" : pass ? "pass" : "fail"}
                formattedAverageGrade={formattedAverageGrade}
              />
            }
            <div className="flex flex-1 justify-between">
              <div>
                <h2 className="text-lg font-semibold">{subject.name}</h2>
                <CardDescription>{subject.description || "-"}</CardDescription>
              </div>
              <div className="relative h-full w-20">
                {stack.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      zIndex: stack.length - index,
                      left: (index + 1) * 10 - 30,
                      transform: `translateY(${(index + 1) * 4}px)`,
                    }}
                    className={cn(
                      "w-20 h-40 border rounded-lg absolute top-6 p-2 group-hover:top-4 transition-all bg-card rotate-6",
                      empty && "border-dashed",
                      !empty && "bg-background"
                    )}
                  >
                    {empty && (
                      <p className="text-muted-foreground text-xs font-mono text-center">
                        Empty
                      </p>
                    )}
                    {!empty && (
                      <p className="text-muted-foreground text-xs font-mono text-center">
                        {gradesCount} {gradesCount > 1 ? "Grades" : "Grade"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
