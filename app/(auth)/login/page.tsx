"use client";

import {
  Form,
  FormControl,
  FormDescription,
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
import Icons from "@/components/Icons";
import Link from "next/link";
import { Suspense, useState } from "react";
import { login_url } from "@/utils/endpoints/endpoints";
import { useSearchParams } from "next/navigation";
import FormMessages from "@/components/FormMessages";
import { useAuth } from "@/utils/AuthContext";

const formSchema = z.object({
  usernameOrEmail: z.string().trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const nextUrl = callbackUrl === null ? "/" : callbackUrl;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

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
      const data = await response.json();
      login(data?.res.token, data?.res.username, data?.res.email);
      toast("Logged In!");
      setIsLoading(false);

      document.location.href = nextUrl;
    } else if (response.status === 401) {
      const message: string = "Username or password is incorrect";
      toast(message);
      setError(message);
      setIsLoading(false);
    } else {
      const data = await response.json();
      const error: string = "" + JSON.stringify(data);
      setError(error);
      setIsLoading(false);
      throw new Error(error);
    }
  }

  return (
    <div className='w-full max-w-lg rounded-2xl border-2 border-stone-200 dark:border-gray-800 p-5'>
      <section className='flex flex-col w-full justify-start gap-1 p-2 bg-accent rounded-t-2xl'>
        <div className='text-lg font-semibold '>Login</div>
      </section>
      <section className='border border-accent border-t-slate-200'>
        <FormMessages error={error} success={success} />
        <Form {...form}>
          <form
            className='space-y-4 w-full p-3'
            onSubmit={form.handleSubmit(dologin)}
          >
            <LoginFormField
              name='usernameOrEmail'
              label='Username Or Email'
              placeholder='Username Or Email'
              formControl={form.control}
              required={true}
            />
            <LoginFormField
              name='password'
              label='Password'
              placeholder='Password'
              inputType='password'
              formControl={form.control}
              required={true}
            />
            {/* <div className='flex flex-col justify-end items-end gap-3 p-2 rounded-sm'> */}
            <Button type='submit' className='bg-amber-500 w-full'>
              {!isLoading ? (
                <span className='flex flex-row items-baseline gap-2'>
                  <Icons.User /> Login
                </span>
              ) : (
                <span className='flex flex-row items-baseline gap-2'>
                  <Icons.Bot /> Logging In
                </span>
              )}
            </Button>
            {/* </div> */}
          </form>
        </Form>
      </section>
      <section className='flex flex-row w-full py-3 gap-2 justify-between'>
        <div className='text-xs'>
          <Link href='/forgotpassword' className='icons text-sky-400'>
            Forgot Password?
          </Link>
        </div>
        <div className='text-xs'>
          Don&apos;t have an account?{" "}
          <Link href='/signup' className='icons text-sky-400'>
            Signup
          </Link>
        </div>
      </section>
      <div className='space-y-0 w-full p-3'>
        <section className='flex flex-row w-full justify-center text-center items-center gap-2 text-slate-400 relative'>
          <span className='border-t border-accent w-full absolute -z-10'></span>
          <h3 className='flex bg-accent text-primary h-full rounded-full p-3 aspect-square items-center justify-center'>
            or
          </h3>
        </section>
        <section className='flex flex-row w-full py-5 justify-center gap-2'>
          <Button className='w-full' variant='secondary'>
            <Icons.FaGoogle />
            Continue With Google
          </Button>
        </section>
        <section className='flex flex-row w-full justify-around gap-2'>
          <Button className='w-full' variant='secondary'>
            <Icons.FaLinkedin />
            LinkedIn
          </Button>
          <Button className='w-full' variant='secondary'>
            <Icons.FaGithub />
            Github
          </Button>
          <Button className='w-full' variant='secondary'>
            <Icons.FaFacebook />
            Facebook
          </Button>
        </section>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <main className='flex flex-col w-full items-center h-full py-3 px-2'>
      <Suspense fallback='Loading..'>
        <LoginForm />
      </Suspense>
    </main>
  );
}

interface LoginFormFieldProps {
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  readonly?: boolean;
  defaultValue?: string | number | readonly string[] | undefined;
  formControl: Control<z.infer<typeof formSchema>, unknown>;
  required?: boolean;
}

const LoginFormField: React.FC<LoginFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  readonly,
  formControl,
  required,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className=' w-full'>
          {inputType != "hidden" && (
            <FormLabel className='ml-1 font-semibold'>
              {label}
              {required && <span className='text-red-500'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
              className='input-field w-full focus-visible:ring-0'
              placeholder={placeholder}
              type={inputType || "text"}
              readOnly={readonly}
              required={required}
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
