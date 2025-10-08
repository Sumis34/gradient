"use client";

import { AddSemesterDialog } from "@/components/semester-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
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
import { useLiveQuery } from "@tanstack/react-db";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function SemestersPage() {
  const { semesters } = useCollections();

  const { data: allSemesters = [] } = useLiveQuery((q) =>
    q.from({
      semesters: semesters,
    })
  );

  return (
    <div className="px-5">
      <div className="flex justify-between items-center my-4">
        <h1>Semesters</h1>
        <AddSemesterDialog>
          <Button>Add Semester</Button>
        </AddSemesterDialog>
      </div>
      {allSemesters.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allSemesters.map((semester) => (
            <Link href={`/app/semester/${semester.id}`} key={semester.id}>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold capitalize">
                    {semester.name}
                  </h2>
                  <CardDescription>
                    {semester.description || "-"}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {allSemesters.length === 0 && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconBook2 />
            </EmptyMedia>
            <EmptyTitle>No Semesters Yet</EmptyTitle>
            <EmptyDescription>
              Add semesters to start tracking your grades.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <AddSemesterDialog>
              <Button size={"sm"}>
                <PlusIcon />
                Add Semester
              </Button>
            </AddSemesterDialog>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
