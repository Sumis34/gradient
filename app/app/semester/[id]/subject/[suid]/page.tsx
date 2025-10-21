"use client";

import { EditGradeForm } from "@/components/edit-grade";
import { EditSubjectForm } from "@/components/edit-subject";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollections } from "@/context/collection-context";
import { GradesDocType } from "@/lib/local-database/rxdb";
import { cn } from "@/lib/utils";
import { IconBook2 } from "@tabler/icons-react";
import { eq, useLiveQuery, and } from "@tanstack/react-db";
import { PenIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { use, useState } from "react";
import GradeRow from "@/components/grade-row";
import useGradeFormat from "@/hooks/use-grade-formats";
import { useAuth } from "@/hooks/use-auth";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; suid: string }>;
}) {
  const { id, suid } = use(params);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [isEditGradeOpen, setIsEditGradeOpen] = useState(false);

  const { defaultGradeFormat } = useAuth();

  const { denormalize } = useGradeFormat(defaultGradeFormat);

  const { subjects: subjectsCollection, grades: gradesCollection } =
    useCollections();

  const { data: subjects } = useLiveQuery((q) =>
    q
      .from({ subject: subjectsCollection })
      .where(({ subject }) =>
        and(eq(subject.semester_id, id), eq(subject.id, suid))
      )
      .select(({ subject }) => ({
        id: subject.id,
        name: subject.name,
        description: subject.description,
        semesterId: subject.semester_id,
      }))
  );

  const subject = subjects?.at(0);

  const { data: grades } = useLiveQuery(
    (q) =>
      q
        .from({ grade: gradesCollection })
        .where(({ grade }) => eq(grade.subject_id, suid))
        .select(({ grade }) => ({
          id: grade.id,
          name: grade.name,
          value: grade.value,
          weight: grade.weight,
          date: grade.date,
          subject_id: grade.subject_id,
        })),
    [suid]
  );

  const bestGrade = grades?.reduce((best, current) => {
    return current.value > best ? current.value : best;
  }, 0);

  const worstGrade =
    grades?.sort((a, b) => a.value - b.value).at(0)?.value ?? -1;

  const averageGrade =
    grades?.reduce(
      (sum, current) => sum + current.value * ((current.weight ?? 0) / 100),
      0
    ) / grades.length;

  const stats = [
    {
      name: "Average",
      stat: averageGrade ? averageGrade.toFixed(2) : "N/A",
    },
    {
      name: "Best Grade",
      stat: bestGrade ? bestGrade.toFixed(2) : "N/A",
    },
    {
      name: "Worst Grade",
      stat: worstGrade > -1 ? worstGrade.toFixed(2) : "N/A",
    },
  ];

  return (
    <div className="px-5 space-y-5">
      <div className="flex justify-between items-center my-4">
        <h1>{subject?.name}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"secondary"} size="sm">
              Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PenIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                subjectsCollection.delete(suid);
              }}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {stats.map((item) => (
          <Card key={item.name} className="p-6 py-4">
            <CardContent className="p-0">
              <dt className="text-sm font-medium text-muted-foreground">
                {item.name}
              </dt>
              <dd className="mt-2 flex items-baseline space-x-2.5">
                <span className="text-3xl font-semibold text-foreground">
                  {item.stat}
                </span>
                {/* <span
                  className={cn(
                    item.changeType === "positive"
                      ? "text-green-800 dark:text-green-400"
                      : "text-red-800 dark:text-red-400",
                    "text-sm font-medium"
                  )}
                >
                  {item.change}
                </span> */}
              </dd>
            </CardContent>
          </Card>
        ))}
      </dl>
      <div>
        <div className="mb-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Grades</h2>
          <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
            <DialogTrigger asChild>
              <Button size={"sm"}>Add Grade</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Grade</DialogTitle>
                <DialogDescription>
                  Add a new grade to this subject.
                </DialogDescription>
              </DialogHeader>
              <EditGradeForm
                afterSubmit={() => setIsAddGradeOpen(false)}
                subjectId={suid}
              >
                <DialogFooter className="justify-between">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Add</Button>
                </DialogFooter>
              </EditGradeForm>
            </DialogContent>
          </Dialog>
        </div>
        {grades.length === 0 && (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconBook2 />
              </EmptyMedia>
              <EmptyTitle>No Grades Yet</EmptyTitle>
              <EmptyDescription>
                Add grades to this subject to start tracking your progress.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => setIsAddGradeOpen(true)} size={"sm"}>
                <PlusIcon />
                Add Grade
              </Button>
            </EmptyContent>
          </Empty>
        )}
        {grades.length > 0 && (
          <div className="overflow-x-auto">
            <Card className="divide-y py-0 flex flex-col gap-2 overflow-hidden">
              <table>
                <tbody>
                  {grades.map((grade) => (
                    <GradeRow
                      key={grade.id}
                      grade={grade}
                      subjectId={suid}
                      formatGrade={denormalize}
                    />
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
