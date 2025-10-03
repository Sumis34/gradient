import { AddSemesterDialog } from "@/components/semester-dialog";
import { Button } from "@/components/ui/button";

export default function SemestersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Semesters</h1>
        <AddSemesterDialog>
          <Button>Add Semester</Button>
        </AddSemesterDialog>
      </div>
    </div>
  );
}
