"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { InputMultiSelect, InputMultiSelectTrigger } from "./ui/multi-select";
import { useLiveQuery } from "@tanstack/react-db";
import { useCollections } from "@/context/collection-context";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2).max(100),
  subjects: z.array(z.string()),
  description: z.string().max(500).optional(),
});

export function AddSemesterDialog({ children }: { children: React.ReactNode }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      subjects: [],
    },
  });

  const router = useRouter();

  const { subjects, semesters, relSubjectsSemesters } = useCollections();

  const { data: allSubjects = [] } = useLiveQuery((q) =>
    q.from({ subject: subjects }).select(({ subject }) => ({
      value: subject.id,
      label: subject.name,
    }))
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const semesterId = crypto.randomUUID();

    semesters.insert({
      id: semesterId,
      description: data.description,
      name: data.name,
    });

    relSubjectsSemesters.insert(
      data.subjects.map((subjectId) => ({
        subject_id: subjectId,
        semester_id: semesterId,
        id: crypto.randomUUID(),
      }))
    );

    router.push(`/app/semester/${semesterId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Semester</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <Input placeholder="Semester 1" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <InputMultiSelect
                        options={allSubjects}
                        value={field.value || []}
                        onValueChange={field.onChange}
                      >
                        {(provided) => (
                          <InputMultiSelectTrigger {...provided} />
                        )}
                      </InputMultiSelect>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Semester</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
