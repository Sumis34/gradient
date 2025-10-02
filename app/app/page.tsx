// app/app/page.tsx
"use client";

import { useLiveQuery } from "@tanstack/react-db";
import { useCollections } from "@/lib/local-database/context";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function AppPage() {
  const { grades, subjects, semesters, relSubjectsSemesters } = useCollections();
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

  const { data: allSemesters = [] } = useLiveQuery((q) =>
    q.from({
      semesters: semesters,
    })
  );

  const { data: allRelSubjectsSemesters = [] } = useLiveQuery((q) =>
    q.from({
      relSubjectsSemesters: relSubjectsSemesters,
    })
  );

  return (
    <div>
      <h1>Rel Subjects Semesters</h1>
      {allRelSubjectsSemesters.map((r) => (
        <div key={r.id}>
          <p>ID: {r.id}</p>
          <p>Subject ID: {r.subject_id}</p>
          <p>Semester ID: {r.semester_id}</p>
        </div>
      ))}
      <h1>Semesters</h1>
      {allSemesters.map((s) => (
        <div key={s.id}>
          <p>ID: {s.id}</p>
          <p>Name: {s.name}</p>
          <p>Description: {s.description}</p>
        </div>
      ))}
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
            user_id: user?.id,
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
            user_id: user?.id,
            name: "Gugus",
          });
        }}
      >
        Subject
      </Button>
      <Button
        onClick={() => {
          semesters.insert({
            id: crypto.randomUUID(),
            user_id: user?.id,
            name: "Semester " + (allSemesters.length + 1),
          });
        }}
      >
        Semester
      </Button>
      <Button
        onClick={() => {
          if (allSubjects.length === 0 || allSemesters.length === 0) {
            alert("Please create subjects and semesters first.");
            return;
          }
          relSubjectsSemesters.insert({
            id: crypto.randomUUID(),
            subject_id: allSubjects[0].id,
            semester_id: allSemesters[0].id,
          });
        }}
      >
        Rel Subjects Semesters
      </Button>
    </div>
  );
}
