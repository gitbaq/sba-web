"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { subs_url } from "@/utils/endpoints/endpoints";
import { toast } from "sonner";
import FormMessages from "@/components/FormMessages";
import { trackEvent } from "@/lib/analytics";

const formSchema = z.object({
  email: z.string().email({
    error: "Enter a valid email.",
  }),
});

function firstNameFromEmail(email: string): string {
  const local = email.split("@")[0] || "Reader";
  const cleaned = local.replace(/[._+-]+/g, " ").trim();
  const word = cleaned.split(/\s+/)[0] || "Reader";
  return word.charAt(0).toUpperCase() + word.slice(1).slice(0, 40);
}

export default function SubscribeForm({
  submitLabel = "Subscribe",
}: {
  submitLabel?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubscribe(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(subs_url, {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          firstName: firstNameFromEmail(values.email),
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        toast("Error: " + data.errors);
        throw new Error("Error: " + data.errors);
      }
      setSuccess("You are subscribed — thank you.");
      trackEvent("subscribe_submit", { status: "success" });
      router.push(`/profile/${data.data.id}`);
    } catch (err) {
      trackEvent("subscribe_submit", { status: "error" });
      setError("" + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='w-full max-w-md'>
      <FormMessages error={error} success={success} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubscribe)}
          className='flex flex-col gap-3 sm:flex-row sm:items-start'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='flex-1 w-full'>
                <FormLabel className='sr-only'>Email</FormLabel>
                <FormControl>
                  <Input
                    className='input-field'
                    type='email'
                    placeholder='you@company.com'
                    autoComplete='email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className='craft-cta-primary border-0 shrink-0 w-full sm:w-auto'
            disabled={isLoading}
          >
            {isLoading ? "Joining…" : submitLabel}
          </Button>
        </form>
      </Form>
    </div>
  );
}
