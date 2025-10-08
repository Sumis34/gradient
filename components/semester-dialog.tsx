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
import { count, useLiveQuery } from "@tanstack/react-db";
import { useCollections } from "@/context/collection-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

export function AddSemesterDialog({
  children,
  semesterCount,
}: {
  children: React.ReactNode;
  semesterCount?: number;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const router = useRouter();

  const { semesters } = useCollections();

  useEffect(() => {
    form.setValue("name", `Semester ${semesterCount ? semesterCount + 1 : 1}`);
  }, [semesterCount]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const semesterId = crypto.randomUUID();

    semesters.insert({
      id: semesterId,
      description: data.description,
      name: data.name,
    });

    router.push(`/app/semester/${semesterId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
