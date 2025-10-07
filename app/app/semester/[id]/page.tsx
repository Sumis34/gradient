"use client";

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
import { useCollections } from "@/context/collection-context";
import { eq, useLiveQuery } from "@tanstack/react-db";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function SemesterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const {
    semesters: semestersCollection,
    relSubjectsSemesters: relSubjectsSemestersCollection,
    subjects: subjectsCollection,
  } = useCollections();

  const { data: semesters } = useLiveQuery((q) =>
    q
      .from({ semesters: semestersCollection })
      .where(({ semesters }) => eq(semesters.id, id))
  );

  const { data: subjects } = useLiveQuery((q) =>
    q
      .from({ rel: relSubjectsSemestersCollection })
      .where(({ rel }) => eq(rel.semester_id, id))
      .innerJoin({ subject: subjectsCollection }, ({ rel, subject }) =>
        eq(rel.subject_id, subject.id)
      )
  );

  const semester = semesters?.at(0);

  if (!semester) {
    router.push("/app/semester");
    return <></>;
  }

  return (
    <div className="px-5 space-y-5">
      <div>
        <div className="flex justify-between items-center my-4">
          <h1 className="capitalize">{semester.name}</h1>
          <Button
            variant={"destructive"}
            onClick={async () => {
              semestersCollection.delete(id);
            }}
          >
            Delete Semester
          </Button>
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
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Subjects</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Subject</Button>
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
          </Dialog>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map(({ subject }) => {
            return (
              <Link
                href={`/app/semester/${semester.id}/subject/${subject.id}`}
                key={subject.id}
              >
                <Card className="overflow-hidden cursor-pointer group">
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {subject.name}
                        </h2>
                        <CardDescription>{subject.description}</CardDescription>
                      </div>
                      <div className="relative">
                        <div className="w-20 h-40 border border-dashed rounded-lg absolute top-6 -left-22 rotate-12 p-2 group-hover:top-4 transition-all">
                          <p className="text-border text-sm font-mono text-center">
                            Empty
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
