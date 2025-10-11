"use client";

import { EditSubjectForm } from "@/components/edit-subject";
import SubjectCard from "@/components/subject-card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { eq, useLiveQuery } from "@tanstack/react-db";
import { PenIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { use } from "react";

export default function SemesterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { semesters: semestersCollection, subjects: subjectsCollection } =
    useCollections();

  const { data: semesters } = useLiveQuery((q) =>
    q
      .from({ semesters: semestersCollection })
      .where(({ semesters }) => eq(semesters.id, id))
  );

  const { data: subjects } = useLiveQuery((q) =>
    q
      .from({ subject: subjectsCollection })
      .where(({ subject }) => eq(subject.semester_id, id))
  );

  const semester = semesters?.at(0);

  if (!semester || !subjects) {
    return <></>;
  }

  return (
    <div className="px-5 space-y-5">
      <div>
        <div className="flex justify-between items-center my-4">
          <h1 className="capitalize">{semester.name}</h1>
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
                  semestersCollection.delete(id);
                }}
              >
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      </div>
      <div>
        <Dialog>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Subjects</h2>
            <DialogTrigger asChild>
              <Button size={"sm"}>
                <PlusIcon />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Subject</DialogTitle>
                <DialogDescription>
                  Add a new subject to this semester.
                </DialogDescription>
              </DialogHeader>
              <EditSubjectForm semesterId={semester.id}>
                <DialogFooter className="justify-between">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Add</Button>
                </DialogFooter>
              </EditSubjectForm>
            </DialogContent>
          </div>
          {subjects.length === 0 && (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconBook2 />
                </EmptyMedia>
                <EmptyTitle>No Subjects Yet</EmptyTitle>
                <EmptyDescription>
                  Add subjects to this semester to start tracking your grades.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <DialogTrigger asChild>
                  <Button size={"sm"}>
                    <PlusIcon />
                    Add Subject
                  </Button>
                </DialogTrigger>
              </EmptyContent>
            </Empty>
          )}
        </Dialog>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((subject) => {
            return (
              <SubjectCard
                key={subject.id}
                subject={subject}
                semester={semester}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
