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
import { useCollections } from "@/context/collection-context";
import { IconBook2 } from "@tabler/icons-react";
import { eq, useLiveQuery, and } from "@tanstack/react-db";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; suid: string }>;
}) {
  const { id, suid } = use(params);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);

  const {
    subjects: subjectsCollection,
    grades: gradesCollection,
    relSubjectsSemesters: relSubjectsSemestersCollection,
  } = useCollections();

  const { data: subjects } = useLiveQuery((q) =>
    q
      .from({ rel: relSubjectsSemestersCollection })
      .innerJoin({ subject: subjectsCollection }, ({ subject, rel }) =>
        eq(subject.id, rel.subject_id)
      )
      .where(({ rel }) =>
        and(eq(rel.semester_id, id), eq(rel.subject_id, suid))
      )
      .select(({ subject, rel }) => ({
        id: subject.id,
        name: subject.name,
        description: subject.description,
        semesterId: rel.semester_id,
        relId: rel.id,
      }))
  );

  const subject = subjects?.at(0);

  const { data: grades } = useLiveQuery(
    (q) =>
      q
        .from({ grade: gradesCollection })
        .where(({ grade }) => eq(grade.subject_id, subject?.relId)),
    [subject?.relId]
  );

  const decodeGrade = (grade: number) => {
    return grade.toFixed(2);
  };

  return (
    <div className="px-5 space-y-5">
      <div className="flex justify-between items-center my-4">
        <h1>{subject?.name}</h1>
        <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
          <DialogTrigger asChild>
            <Button>Add Grade</Button>
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
              subjectRelId={subject?.relId ?? ""}
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
      <div className="grid sm:grid-cols-3 gap-3">
        <Card>
          <CardHeader></CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card>
          <CardHeader></CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card>
          <CardHeader></CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
      <div>
        <div className="mb-3">
          <h2 className="text-lg font-semibold">Grades</h2>
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
            <Card className="divide-y py-2 flex flex-col gap-2">
              <table>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id} className="border-b last:border-b-0">
                      <td className="py-2 align-middle w-32 pl-5">
                        <span className="text-3xl">
                          {decodeGrade(grade.grade)}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="font-medium">{grade.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(grade.date).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
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
