"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldPath, useForm } from "react-hook-form";
import { contact_url } from "@/utils/endpoints/endpoints";
import { toast } from "sonner";
import FormMessages from "@/components/FormMessages";
import Socials from "@/components/socials";
import Icons from "@/components/Icons";
import ObfuscatedEmail from "@/components/ObfuscatedEmail";
import TurnstileField, { isTurnstileConfigured } from "@/components/TurnstileField";
import { trackEvent } from "@/lib/analytics";
import { LINKEDIN_URL } from "@/lib/audience";

const REASONS = [
  "Project",
  "Role",
  "Question about writing",
  "Other",
] as const;

const formSchema = z.object({
  email: z.string().email({
    error: "Enter valid email.",
  }),
  reason: z.enum(REASONS),
  subject: z.string().max(255),
  message: z.string().min(1).max(2000),
  website: z.string().max(200).optional(),
});

export default function ContactClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const onTurnstile = useCallback((token: string) => setTurnstileToken(token), []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      reason: "Project",
      subject: "",
      message: "",
      website: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isTurnstileConfigured() && !turnstileToken) {
        throw new Error("Complete the spam check and try again.");
      }
      const payload = {
        email: values.email,
        reason: values.reason,
        subject: values.subject,
        message: values.message,
        website: values.website || "",
        turnstileToken: turnstileToken || undefined,
      };
      const res = await fetch(contact_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(
          data.error ||
            "Message could not be sent right now. Try LinkedIn or email below."
        );
      }
      setSuccess("Thank you. Your message was received.");
      toast("Thank you. Message received.");
      trackEvent("contact_submit", { status: "success", reason: values.reason });
      form.reset();
      setTurnstileToken("");
    } catch (err) {
      trackEvent("contact_submit", { status: "error" });
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='w-full'>
      <div className='life-hero'>
        <header className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pt-6 pb-12 md:pt-8 md:pb-16'>
          <p className='accent-label'>Get in touch</p>
          <h1 className='display-title text-4xl md:text-5xl text-foreground'>
            Contact
          </h1>
          <p className='text-lg leading-relaxed text-foreground/80 max-w-xl'>
            Questions about writing, work, or a possible engagement. Send a
            note. I read every message.
          </p>
        </header>
      </div>

      <main className='mx-auto flex w-full max-w-3xl flex-col gap-14 px-4 py-10 md:py-14'>
        <section aria-labelledby='contact-form-heading' className='flex flex-col gap-6'>
          <h2 id='contact-form-heading' className='sr-only'>
            Contact form
          </h2>
          <FormMessages error={error} success={success} />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-6'
            >
              <ProfileFormField
                name='email'
                label='Email'
                placeholder='you@company.com'
                inputType='email'
                formControl={form.control}
              />
              <FormField
                control={form.control}
                name='reason'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='font-semibold'>Reason</FormLabel>
                    <FormControl>
                      <select
                        className='input-field w-full bg-transparent'
                        {...field}
                      >
                        {REASONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ProfileFormField
                name='subject'
                label='Subject'
                placeholder='What is this about?'
                formControl={form.control}
              />
              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        className='input-field min-h-[10rem] bg-transparent'
                        placeholder='How can I help?'
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      I read every message and reply when I can.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='hidden' aria-hidden='true'>
                <label htmlFor='website'>Website</label>
                <input
                  id='website'
                  type='text'
                  tabIndex={-1}
                  autoComplete='off'
                  {...form.register("website")}
                />
              </div>
              <TurnstileField onToken={onTurnstile} />
              <div className='pt-1'>
                <Button
                  type='submit'
                  className='craft-cta-primary border-0'
                  disabled={isLoading}
                >
                  <Icons.Mails className='craft-cta-icon' aria-hidden />
                  {isLoading ? "Sending…" : "Send message"}
                </Button>
              </div>
            </form>
          </Form>
        </section>

        <section className='flex flex-col gap-3 border-t border-border/80 pt-10'>
          <p className='accent-label'>Elsewhere</p>
          <p className='text-sm text-muted-foreground max-w-md leading-relaxed'>
            Prefer a direct channel? Reach out on{" "}
            <a
              href={LINKEDIN_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='text-brand font-medium underline-offset-4 hover:underline'
            >
              LinkedIn
            </a>{" "}
            or email{" "}
            <ObfuscatedEmail
              user='hello'
              domain='syedbaqirali.com'
              className='text-brand font-medium underline-offset-4 hover:underline'
            />
            .
          </p>
          <Socials />
          <p className='text-sm text-muted-foreground'>
            Or browse{" "}
            <Link
              href='/writing'
              className='text-brand font-medium underline-offset-4 hover:underline'
            >
              Writing
            </Link>
            {" · "}
            <Link
              href='/work'
              className='text-brand font-medium underline-offset-4 hover:underline'
            >
              Work
            </Link>
            {" · "}
            <Link
              href='/work-with-me'
              className='text-brand font-medium underline-offset-4 hover:underline'
            >
              Work with me
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}

interface ProfileFormFieldsProps {
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  readonly?: boolean;
  formControl: Control<z.infer<typeof formSchema>, unknown>;
}

const ProfileFormField: React.FC<ProfileFormFieldsProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  readonly,
  formControl,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full'>
          {inputType != "hidden" && (
            <FormLabel className='font-semibold'>{label}</FormLabel>
          )}
          <FormControl>
            <Input
              className='input-field w-full bg-transparent'
              placeholder={placeholder}
              type={inputType || "text"}
              readOnly={readonly}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
