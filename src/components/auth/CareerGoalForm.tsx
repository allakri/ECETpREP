"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AppUser } from "@/hooks/use-auth";

const formSchema = z.object({
  careerGoal: z.string().min(3, "Please enter a valid career goal.").max(100, "That's a bit long! Try a shorter goal."),
});

type FormValues = z.infer<typeof formSchema>;

interface CareerGoalFormProps {
  user: AppUser;
  onSave: (goal: string) => Promise<void>;
}

export function CareerGoalForm({ user, onSave }: CareerGoalFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      careerGoal: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await onSave(data.careerGoal);
  };

  return (
    <Card className="shadow-2xl w-full max-w-md">
       <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Welcome, {user.displayName}!</CardTitle>
        <CardDescription>Just one more step. What is your career goal?</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="careerGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you want to become?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer, Doctor..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save and Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
