import Link from "next/link";
import { Card, CardDescription, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";
import { eq, useLiveQuery, count } from "@tanstack/react-db";
import { useCollections } from "@/context/collection-context";
export default function SubjectCard({
  subject,
  semester,
}: {
  subject: { id: string; name: string; description?: string };
  semester: { id: string; name: string };
}) {
  const { grades: gradesCollection } = useCollections();

  const { data: grades } = useLiveQuery(
    (q) =>
      q
        .from({ grade: gradesCollection })
        .select(({ grade }) => ({
          count: count(grade.id),
        }))
        .where(({ grade }) => eq(grade.subject_id, subject.id)),
    [subject.id]
  );

  const gradesCount = grades?.at(0)?.count || 0;
  const empty = gradesCount === 0;

  const stack = Array(empty ? 1 : Math.min(gradesCount, 3)).fill(null);

  return (
    <Link
      href={`/app/semester/${semester.id}/subject/${subject.id}`}
      key={subject.id}
    >
      <Card className="overflow-hidden cursor-pointer group">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <h2 className="text-lg font-semibold">{subject.name}</h2>
              <CardDescription>{subject.description || "-"}</CardDescription>
            </div>
            <div className="relative">
              {stack.map((_, index) => (
                <div
                  key={index}
                  style={{
                    zIndex: stack.length - index,
                    left: (index + 1) * 10 - 100,
                    transform: `translateY(${(index + 1) * 4}px)`,
                  }}
                  className={cn(
                    "w-20 h-40 border rounded-lg absolute top-6 -left-22 p-2 group-hover:top-4 transition-all bg-card rotate-6",
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
        </CardHeader>
      </Card>
    </Link>
  );
}
