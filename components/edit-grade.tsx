"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  grade: z.number().min(0).max(1000),
  description: z.string().max(500).min(1),
  weight: z.number().min(0),
  date: z.date(),
});

export function EditGradeForm({
  children,
  subjectRelId,
  afterSubmit,
}: {
  children: React.ReactNode;
  subjectRelId: string;
  afterSubmit?: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      weight: 100,
      date: new Date(),
      grade: 5,
    },
  });

  const { grades } = useCollections();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const id = crypto.randomUUID();

    grades.insert({
      id,
      description: data.description,
      grade: data.grade,
      weight: data.weight,
      subject_id: subjectRelId,
      date: new Date().toISOString(),
    });

    afterSubmit?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Calculus Test 1" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-6 gap-3">
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel className="capitalize">{field.name}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="5.5"
                      step="0.01"
                      type="number"
                      inputMode="decimal"
                      {...field}
                      onChange={(e) =>
                        parseFloat(e.target.value)
                          ? field.onChange(parseFloat(e.target.value))
                          : field.onChange("")
                      }
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="capitalize">{field.name}</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        step="1"
                        type="number"
                        inputMode="numeric"
                        {...field}
                        onChange={(e) =>
                          parseFloat(e.target.value)
                            ? field.onChange(parseInt(e.target.value))
                            : field.onChange("")
                        }
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>%</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Test Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal active:scale-100",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
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
