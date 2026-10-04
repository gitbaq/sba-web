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
import { usePathname } from "next/navigation";
import { newsletter_subscribe_url } from "@/utils/endpoints/endpoints";
import { toast } from "sonner";
import FormMessages from "@/components/FormMessages";
import { trackEvent } from "@/lib/analytics";
import { readJson } from "@/lib/http";
import { SUBSCRIBE } from "@/lib/copy";
import { markNewsletterSubscribed } from "@/lib/newsletterPreference";

const formSchema = z.object({
  email: z.string().email({
    error: "Enter a valid email.",
  }),
  company_url: z.string().optional(),
});

export type SubscribeVariant = "hero" | "inline" | "end" | "footer";

const VARIANT_WRAP: Record<SubscribeVariant, string> = {
  hero: "subscribe-panel subscribe-panel-hero w-full max-w-lg",
  inline: "subscribe-panel subscribe-panel-inline w-full max-w-md",
  end: "subscribe-panel subscribe-panel-end w-full max-w-md",
  footer: "subscribe-panel subscribe-panel-footer w-full max-w-md",
};

export default function SubscribeForm({
  submitLabel = "Subscribe to Newsletter",
  variant = "hero",
  onSubscribed,
}: {
  submitLabel?: string;
  variant?: SubscribeVariant;
  /** Called after a successful subscribe or already-subscribed response. */
  onSubscribed?: () => void;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", company_url: "" },
  });

  async function onSubscribe(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(newsletter_subscribe_url, {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          // Backend honeypot field name remains `website`.
          website: values.company_url || "",
          sourcePath: pathname || "/",
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = (await readJson<{
        status?: string;
        message?: string;
      }>(response, {})) as {
        status?: string;
        message?: string;
      };
      const status = data.status || (response.ok ? "pending" : "error");
      const message =
        data.message ||
        (response.ok
          ? SUBSCRIBE.success
          : "Something went wrong. Try again.");

      if (response.status === 429) {
        trackEvent("subscribe_submit", { status: "rate_limited" });
        setError(message);
        toast(message);
        return;
      }
      if (!response.ok && status === "invalid") {
        trackEvent("subscribe_submit", { status: "error" });
        setError(message);
        return;
      }

      if (status === "already_subscribed") {
        trackEvent("subscribe_submit", { status: "already_subscribed" });
        setSuccess(message);
        toast(message);
        form.reset({ email: "", company_url: "" });
        markNewsletterSubscribed();
        onSubscribed?.();
        return;
      }

      if (status === "pending_email_failed") {
        trackEvent("subscribe_submit", { status: "email_failed" });
        setError(message);
        toast(message);
        return;
      }

      trackEvent("subscribe_submit", { status: "success" });
      setSuccess(message || SUBSCRIBE.success);
      toast(SUBSCRIBE.success);
      form.reset({ email: "", company_url: "" });
      markNewsletterSubscribed();
      onSubscribed?.();
    } catch (err) {
      trackEvent("subscribe_submit", { status: "error" });
      setError("" + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={VARIANT_WRAP[variant]}>
      <FormMessages error={error} success={success} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubscribe)}
          className='flex flex-col gap-3 sm:flex-row sm:items-center'
        >
          {/* Honeypot: off-screen, no visible label text, ignored by AT */}
          <FormField
            control={form.control}
            name='company_url'
            render={({ field }) => (
              <FormItem
                className='absolute -left-[9999px] h-px w-px overflow-hidden opacity-0'
                aria-hidden='true'
              >
                <FormControl>
                  <Input
                    type='text'
                    tabIndex={-1}
                    autoComplete='off'
                    aria-hidden='true'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='flex-1 w-full space-y-0'>
                <FormLabel className='sr-only'>Email</FormLabel>
                <FormControl>
                  <Input
                    className='input-field h-11 min-h-11 py-0 text-sm md:text-sm'
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
            className='craft-cta-primary border-0 shrink-0 w-full sm:w-auto h-11 min-h-11 py-0'
            disabled={isLoading}
          >
            {isLoading ? "Joining…" : submitLabel}
          </Button>
        </form>
      </Form>
    </div>
  );
}
