"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Icons from "./Icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { subs_url } from "@/utils/endpoints/endpoints";
import { toast } from "sonner";
import FormMessages from "./FormMessages";
const formSchema = z.object({
  firstName: z.string().min(1).max(255),
  email: z.string().email({
    message: "Enter valid email.",
  }),
});

export default function Subscribe() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
    },
  });

  async function onSubscribe(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // console.log("Starting...");
    try {
      const response = await fetch(subs_url, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        toast("Error: " + data.errors);
        throw new Error("Error: " + data.errors);
      } else {
        setSuccess("All changes are saved");
        router.push(`/profile/${data.data.id}`);
      }
    } catch (error) {
      setError("" + error.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          className='rounded-lg w-full p-5 bg-indigo-100 border border-indigo-300 text-slate-500'
        >
          Subscribe to Mailing List <Icons.Mails className='text-indigo-900' />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className='flex flex-row gap-3'>
              Join Now! <Icons.Mails className='text-amber-500' />
            </div>
          </SheetTitle>
          <SheetDescription className='text-start text-xs'>
            Periodically, I send an email about what&apos;s new and exciting -
            about AI, AWS, Java, React, Python, Docker and other things.
          </SheetDescription>
        </SheetHeader>
        <FormMessages error={error} success={success} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubscribe)}>
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        className='input-field'
                        type='text'
                        id='firstName'
                        placeholder='First Name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className='input-field'
                        type='email'
                        id='email'
                        placeholder='Email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end'>
                <Button type='submit' className='min-w-24 bg-amber-500'>
                  {isLoading ? "Loading..." : "Join"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
