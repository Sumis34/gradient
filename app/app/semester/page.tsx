"use client"

import { AddSemesterDialog } from "@/components/semester-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="">Semesters</h1>
        <AddSemesterDialog>
          <Button>Add Semester</Button>
        </AddSemesterDialog>
      </div>
      <ul className="space-y-4">
        {allSemesters.map((semester) => (
          <Link href={`/app/semester/${semester.id}`} key={semester.id}>
            <Card>
              <CardHeader>
                <h2>{semester.name}</h2>
              </CardHeader>
              <CardContent>
                <p>{semester.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </ul>
    </div>
  );
}
