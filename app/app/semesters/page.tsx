import { AddSemesterDialog } from "@/components/semester-dialog";
import { Button } from "@/components/ui/button";

export default function SemestersPage() {
  return <div>Semesters Page

    <AddSemesterDialog>
      <Button>Add Semester</Button>
    </AddSemesterDialog>
  </div>;
}
