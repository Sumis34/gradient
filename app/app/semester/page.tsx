"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { useCollections } from "@/context/collection-context";
import { backgroundIndex } from "@/lib/utils";
import { useLiveQuery } from "@tanstack/react-db";

export default function SemestersPage() {
  const { semesters: semestersCollection } = useCollections();

  const { data: semesters } = useLiveQuery((q) =>
    q.from({ semester: semestersCollection }).select(({ semester }) => ({
      id: semester.id,
      name: semester.name,
      description: semester.description,
    }))
  );

  return (
    <div className="grid md:grid-cols-3">
      {semesters?.map((semester) => {

        return (
          <Card key={semester.id} className="p-0">
            <CardHeader></CardHeader>
            <div>
              <h2>{semester.name}</h2>
              <p>{semester.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
