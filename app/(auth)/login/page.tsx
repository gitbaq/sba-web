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
import { Suspense, useState } from "react";
import { login_url } from "@/utils/endpoints/endpoints";
import { useSearchParams } from "next/navigation";
import FormMessages from "@/components/FormMessages";
import { useAuth } from "@/utils/AuthContext";
import { readJson } from "@/lib/http";

const formSchema = z.object({
  usernameOrEmail: z.string().trim().min(1, { error: "Enter username or email." }),
  password: z.string().min(1, { error: "Enter your password." }),
});

/** Only allow same-origin relative paths (block open redirects). */
function safeReturnPath(url: string | null): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) return "/admin";
  if (url.startsWith("/login") || url.startsWith("/logout")) return "/admin";
  if (url === "/") return "/admin";
  return url;
}

function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const nextUrl = safeReturnPath(callbackUrl);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const isReaderReturn =
    !!callbackUrl &&
    callbackUrl.startsWith("/") &&
    !callbackUrl.startsWith("/admin") &&
    !callbackUrl.startsWith("/editor");

  async function dologin(formData: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(login_url, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await readJson<{
        res?: { token?: string; username?: string; email?: string };
      } | null>(response, null);
      if (!data?.res?.token) {
        const message =
          "Login succeeded but returned an empty response. Try again.";
        toast(message);
        setError(message);
        setIsLoading(false);
        return;
      }
      login(data.res.token, data.res.username || "", data.res.email || "");
      toast("Logged in");
      setIsLoading(false);
      document.location.href = nextUrl;
    } else if (response.status === 401) {
      const message = "Username or password is incorrect";
      toast(message);
      setError(message);
      setIsLoading(false);
    } else {
      const data = await readJson(response, null);
      const err = data ? JSON.stringify(data) : `HTTP ${response.status}`;
      setError(err);
      setIsLoading(false);
      throw new Error(err);
    }
  }

  const signupHref =
    callbackUrl && callbackUrl.startsWith("/")
      ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/signup";

  return (
    <div className='w-full'>
      <div className='life-hero'>
        <header className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pt-6 pb-12 md:pt-8 md:pb-16'>
          <p className='accent-label'>Account</p>
          <h1 className='display-title text-4xl text-foreground md:text-5xl'>
            {isReaderReturn ? "Log in to continue" : "Admin login"}
          </h1>
          <p className='max-w-xl text-lg leading-relaxed text-foreground/80'>
            {isReaderReturn
              ? "Use your reader account to comment on essays."
              : "Sign in to manage the site."}
          </p>
        </header>
      </div>

      <main className='mx-auto flex w-full max-w-md flex-col gap-8 px-4 py-10 md:py-14'>
        <FormMessages error={error} success={success} />
        <Form {...form}>
          <form
            className='flex flex-col gap-5'
            onSubmit={form.handleSubmit(dologin)}
          >
            <LoginFormField
              name='usernameOrEmail'
              label='Username or email'
              placeholder='you@example.com'
              formControl={form.control}
              required
            />
            <LoginFormField
              name='password'
              label='Password'
              placeholder='Password'
              inputType='password'
              formControl={form.control}
              required
            />
            <Button
              type='submit'
              className='craft-cta-primary border-0 w-full h-11'
              disabled={isLoading}
            >
              {isLoading ? "Signing in…" : "Log in"}
            </Button>
          </form>
        </Form>

        <div className='flex flex-col gap-2 text-sm text-muted-foreground'>
          <p>
            <Link
              href='/forgotpassword'
              className='font-semibold text-brand underline-offset-4 hover:underline'
            >
              Forgot password?
            </Link>
          </p>
          <p>
            Need an account?{" "}
            <Link
              href={signupHref}
              className='font-semibold text-brand underline-offset-4 hover:underline'
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={<p className='p-8 text-muted-foreground'>Loading…</p>}
    >
      <LoginForm />
    </Suspense>
  );
}

interface LoginFormFieldProps {
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  inputType?: string;
  formControl: Control<z.infer<typeof formSchema>, unknown>;
  required?: boolean;
}

function LoginFormField({
  name,
  label,
  placeholder,
  inputType,
  formControl,
  required,
}: LoginFormFieldProps) {
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
                inputType === "password" ? "current-password" : "username"
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
