"use client";

import { useLiveQuery } from "@tanstack/react-db";
import { useCollections } from "@/context/collection-context";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { usePersistence } from "@/context/persistence-context";
import { useReplication } from "@/context/replication-context";
import { useEffect } from "react";

export default function AppPage() {
  const { grades, subjects, semesters } =
    useCollections();
  const { user } = useAuth();

  const db = usePersistence();

  const replications = useReplication();

  useEffect(() => {
    const sub = db.semesters.$.subscribe((ev) => {
      console.log("event", ev);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [db]);

  const analyzeReplications = () => {
    console.log("Analyzing Replications: " + replications.length);
    for (const r of replications) {
      console.log("Replication Info:");
      console.log("  Is Paused:", r.isPaused());
      console.log("  Collection:", r.collection.name);
      console.log("  Stopped:", r.isStopped());
    }
  };

  const fetchDirectlyFromDb = async () => {
    const allSemesters = await db.semesters.find().exec();
    console.log("All semesters from direct DB query:", allSemesters);
  };

  const updateLastSemesterName = async () => {
    const allSemesters = await db.semesters.find().exec();
    if (allSemesters.length === 0) return;
    const lastSemester = allSemesters[allSemesters.length - 1];
   
    await db.semesters.upsert({
      id: lastSemester.id,
      name: "Updated Name " + new Date().toISOString(),
    })

    console.log("Updated last semester:", lastSemester);
  }

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

  console.log("All semesters from live query:", allSemesters);

  return (
    <div>
      <Button onClick={fetchDirectlyFromDb}>Fetch Directly From DB</Button>
      <Button onClick={analyzeReplications}>Analyze Replications</Button>
      <Button onClick={updateLastSemesterName}>Update Last Semester Name</Button>
      <h1>Rel Subjects Semesters</h1>
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
          <p>Grade: {g.value}</p>
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
            value: Math.floor(Math.random() * 100),
            date: new Date().toISOString(),
          });
        }}
      >
        Add
      </Button>
      <Button
        onClick={() => {
          semesters.insert({
            id: crypto.randomUUID(),
            user_id: user?.id,
            name: "Semester " + (allSemesters.length + 1),
            description: "Description " + (allSemesters.length + 1),
          });
        }}
      >
        Semester
      </Button>
    </div>
  );
}
