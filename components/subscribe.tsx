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
const formSchema = z.object({
  email: z.string().email({
    message: "Enter valid email.",
  }),
});

export default function Subscribe() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "email@email.com",
    },
  });

  async function onSubscribe(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

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
              Subscribe to Mailing List{" "}
              <Icons.Mails className='text-indigo-900' />
            </div>
          </SheetTitle>
          <SheetDescription className='text-start text-xs text-slate-500'>
            Enter email to join mailing list.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubscribe)}>
            <div className='grid gap-4 py-4'>
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
                <Button type='submit' className='min-w-24 bg-indigo-500'>
                  {isLoading ? "Loading..." : "Join"}
                </Button>
              </div>
              {error && (
                <div className='cols-span-4' style={{ color: "red" }}>
                  {error}
                </div>
              )}
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
