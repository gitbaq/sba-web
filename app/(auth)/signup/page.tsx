"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldPath, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { signup_url } from "@/utils/endpoints/endpoints";
import { Suspense, useState } from "react";
import FormMessages from "@/components/FormMessages";
import { readJson } from "@/lib/http";
import { useRouter, useSearchParams } from "next/navigation";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z
  .object({
    email: z.string().email({ error: "Enter a valid email." }),
    password: z
      .string()
      .min(8, { error: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
      .regex(/[0-9]/, { error: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Contain at least one special character.",
      })
      .trim(),
    confirm_password: z.string().trim(),
    username: z.string().trim().min(2, { error: "Choose a username." }),
    firstName: z.string().trim().min(1, { error: "Enter your first name." }),
    lastName: z.string().trim().min(1, { error: "Enter your last name." }),
    phone: z
      .string()
      .optional()
      .refine((v) => !v || !v.trim() || phoneRegex.test(v), "Invalid number"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    error: "Passwords do not match",
  });

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      username: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  async function doSignup(formData: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(signup_url, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await readJson<{
        errors?: unknown;
        firstName?: string;
      }>(response, {});
      if (!response.ok) {
        throw new Error("" + (data.errors ?? `HTTP ${response.status}`));
      }
      if (data.errors) {
        setError("Error: " + data.errors);
        return;
      }
      setSuccess(`Welcome${data.firstName ? `, ${data.firstName}` : ""}.`);
      toast("Account created. Log in to comment.");
      const login = new URL("/login", window.location.origin);
      if (callbackUrl && callbackUrl.startsWith("/")) {
        login.searchParams.set("callbackUrl", callbackUrl);
      }
      router.push(login.pathname + login.search);
    } catch (err) {
      setError("" + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  const loginHref =
    callbackUrl && callbackUrl.startsWith("/")
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login";

  return (
    <div className='w-full'>
      <div className='life-hero'>
        <header className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pt-6 pb-12 md:pt-8 md:pb-16'>
          <p className='accent-label'>Account</p>
          <h1 className='display-title text-4xl text-foreground md:text-5xl'>
            Sign up to comment
          </h1>
          <p className='max-w-xl text-lg leading-relaxed text-foreground/80'>
            Create a free reader account. Comments are moderated before they
            appear.
          </p>
        </header>
      </div>

      <main className='mx-auto flex w-full max-w-md flex-col gap-8 px-4 py-10 md:py-14'>
        <FormMessages error={error} success={success} />
        <Form {...form}>
          <form
            className='flex flex-col gap-5'
            onSubmit={form.handleSubmit(doSignup)}
          >
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
              <SignupFormField
                name='firstName'
                label='First name'
                placeholder='First name'
                formControl={form.control}
                required
              />
              <SignupFormField
                name='lastName'
                label='Last name'
                placeholder='Last name'
                formControl={form.control}
                required
              />
            </div>
            <SignupFormField
              name='username'
              label='Username'
              placeholder='Username'
              formControl={form.control}
              required
            />
            <SignupFormField
              name='email'
              label='Email'
              placeholder='you@example.com'
              inputType='email'
              formControl={form.control}
              required
            />
            <SignupFormField
              name='phone'
              label='Phone (optional)'
              placeholder='Optional'
              formControl={form.control}
            />
            <SignupFormField
              name='password'
              label='Password'
              placeholder='Password'
              inputType='password'
              formControl={form.control}
              required
            />
            <SignupFormField
              name='confirm_password'
              label='Confirm password'
              placeholder='Confirm password'
              inputType='password'
              formControl={form.control}
              required
            />
            <Button
              type='submit'
              className='craft-cta-primary border-0 w-full h-11'
              disabled={isLoading}
            >
              {isLoading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </Form>

        <p className='text-sm text-muted-foreground'>
          Already have an account?{" "}
          <Link
            href={loginHref}
            className='font-semibold text-brand underline-offset-4 hover:underline'
          >
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<p className='p-8 text-muted-foreground'>Loading…</p>}>
      <SignupForm />
    </Suspense>
  );
}

interface SignupFormFieldProps {
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  inputType?: string;
  required?: boolean;
  formControl: Control<z.infer<typeof formSchema>, unknown>;
}

function SignupFormField({
  name,
  label,
  placeholder,
  inputType,
  formControl,
  required,
}: SignupFormFieldProps) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel className='font-semibold'>
            {label}
            {required ? <span className='text-destructive'> *</span> : null}
          </FormLabel>
          <FormControl>
            <Input
              className='input-field h-11'
              placeholder={placeholder}
              type={inputType || "text"}
              autoComplete={
                inputType === "password"
                  ? name === "confirm_password"
                    ? "new-password"
                    : "new-password"
                  : inputType === "email"
                    ? "email"
                    : name === "username"
                      ? "username"
                      : "on"
              }
              required={required}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
