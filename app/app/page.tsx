// app/app/page.tsx
"use client";

import { useLiveQuery } from "@tanstack/react-db";
import { useCollections } from "@/lib/local-database/context";
import type { GradeDoc } from "@/lib/local-database/rxdb";
import { Button } from "@/components/ui/button";

export default function AppPage() {
  const { grades } = useCollections();

  const { data: allGrades = [] } = useLiveQuery((q) =>
    q.from({
      grades: grades,
    })
  );

  return (
    <div>
      <h1>Grades</h1>
      {allGrades.map((g) => (
        <div key={g.id}>
          <p>ID: {g.id}</p>
          <p>User: {g.user_id}</p>
          <p>Subject: {g.subject_id}</p>
          <p>Grade: {g.grade}</p>
          <p>Date: {g.date}</p>
          <hr />
        </div>
      ))}
      <Button
        onClick={() => {
          grades.insert({
            id: crypto.randomUUID(),
            user_id: "user1",
            subject_id: "math",
            grade: Math.floor(Math.random() * 100),
            date: new Date().toISOString(),
          });
        }}
      >
        Add
      </Button>
    </div>
  );
}
