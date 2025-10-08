"use client";

import { EditGradeForm } from "@/components/edit-grade";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GradesDocType } from "@/lib/local-database/rxdb";
import React, { useState } from "react";

type Props = {
  grade: GradesDocType;
  subjectId: string;
  decodeGrade?(value: number): React.ReactNode;
};

export default function GradeRow({ grade, subjectId, decodeGrade }: Props) {
  const [isEditGradeOpen, setIsEditGradeOpen] = useState(false);

  const multiplier = Math.round(((grade.weight ?? 0) as number) / 100);

  return (
    <Dialog open={isEditGradeOpen} onOpenChange={setIsEditGradeOpen}>
      <DialogTrigger asChild>
        <tr className="border-b last:border-b-0 hover:bg-accent cursor-pointer">
          <td className="align-middle w-4 pl-5 h-14">
            <Tooltip>
              <TooltipTrigger>
                <div className="h-9 pt-1">
                  <Progress dir="vertical" value={grade.weight} />
                  {multiplier > 1 && (
                    <span className="text-muted-foreground text-xs">x{multiplier}</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{grade.weight}%</p>
              </TooltipContent>
            </Tooltip>
          </td>
          <td className="align-middle w-32 pl-5 h-14">
            <span className="text-3xl">{decodeGrade ? decodeGrade(grade.value) : grade.value}</span>
          </td>
          <td className="align-middle pl-5 h-14">
            <div className="font-medium">{grade.name}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(grade.date).toLocaleDateString()}
            </div>
          </td>
        </tr>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {grade.name}</DialogTitle>
        </DialogHeader>
        <EditGradeForm afterSubmit={() => setIsEditGradeOpen(false)} subjectId={subjectId} grade={grade}>
          <DialogFooter className="justify-between">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </EditGradeForm>
      </DialogContent>
    </Dialog>
  );
}
