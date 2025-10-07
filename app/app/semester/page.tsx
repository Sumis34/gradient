"use client";

import { AddSemesterDialog } from "@/components/semester-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useCollections } from "@/context/collection-context";
import { useLiveQuery } from "@tanstack/react-db";
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
      <ul className="flex flex-col gap-3">
        {allSemesters.map((semester) => (
          <Link href={`/app/semester/${semester.id}`} key={semester.id}>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold capitalize">{semester.name}</h2>
                <CardDescription>{semester.description || "-"}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </ul>
    </div>
  );
}
