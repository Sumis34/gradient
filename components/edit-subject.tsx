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
import { useCollections } from "@/context/collection-context";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

export function EditSubjectForm({
  children,
  semesterId,
  subjectId,
  defaultName,
  defaultDescription,
}: {
  children: React.ReactNode;
  semesterId: string;
  subjectId?: string;
  defaultName?: string;
  defaultDescription?: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName ?? "",
      description: defaultDescription ?? "",
    },
  });

  const router = useRouter();

  const { subjects, relSubjectsSemesters } = useCollections();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const id = subjectId ?? crypto.randomUUID();

    subjects.insert({
      id,
      description: data.description,
      name: data.name,
    });

    relSubjectsSemesters.insert({
      id: crypto.randomUUID(),
      semester_id: semesterId,
      subject_id: id,
    });

    router.push(`/app/semester/${semesterId}/subject/${id}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{field.name}</FormLabel>
                <FormControl>
                  <Input placeholder="Math" {...field} />
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
                  <Textarea placeholder="Advanced Mathematics with Mr. Friedman" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>{children}</div>
      </form>
    </Form>
  );
}
