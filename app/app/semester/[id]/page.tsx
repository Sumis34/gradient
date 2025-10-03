"use client";

import { Button } from "@/components/ui/button";
import { useCollections } from "@/context/collection-context";
import { use } from "react";

export default function SemesterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { semesters } = useCollections();

  return (
    <div>
      Semesters Page {id}
      <Button
        variant={"destructive"}
        onClick={async () => {
          try {
            const tx = semesters.delete(id);
            await tx.isPersisted.promise;
            console.log("Delete successful");
          } catch (error) {
            console.log("Delete failed:", error);
          }
        }}
      >
        Delete Semester
      </Button>
    </div>
  );
}
