// app/app/page.tsx
"use client";

import { useLiveQuery } from "@tanstack/react-db";
import { useCollections } from "@/lib/local-database/context";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function AppPage() {
  const { grades, subjects } = useCollections();
  const { user } = useAuth();

  const { data: allGrades = [] } = useLiveQuery((q) =>
    q.from({
      grades: grades,
    })
  );

  const { data: allSubjects = [] } = useLiveQuery((q) =>
    q.from({
      subjects: subjects,
    })
  );

  return (
    <div>
      <h1>Subjects</h1>
      {allSubjects.map((s) => (
        <div key={s.id}>
          <p>ID: {s.id}</p>
          <p>Name: {s.name}</p>
        </div>
      ))}
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
            user_id: user!.id,
            subject_id: "496128eb-a35d-4400-b05a-aaea97bb2cfc",
            grade: Math.floor(Math.random() * 100),
            date: new Date().toISOString(),
          });
        }}
      >
        Add
      </Button>
      <Button
        onClick={() => {
          subjects.insert({
            id: crypto.randomUUID(),
            user_id: user!.id,
            name: "Gugus",
          });
        }}
      >
        Subject
      </Button>
    </div>
  );
}
