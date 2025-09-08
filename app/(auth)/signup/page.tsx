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
// import { redirect } from "next/navigation";
import Link from "next/link";
import { signup_url } from "@/utils/endpoints/endpoints";
import { useState } from "react";
import FormMessages from "@/components/FormMessages";
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const formSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirm_password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().regex(phoneRegex, "Invalid Number!"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

export default function Signup() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      const data = await response.json();
      if (!response.ok) {
        throw new Error("" + data.errors);
      } else if (data.errors) {
        setError("Error: " + data.errors);
      } else {
        setSuccess(`Welcome! ${data.firstName}`);
        toast(`Welcome! ${data.firstName}`);
      }
    } catch (error) {
      setError("" + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className='flex flex-col w-full items-center h-full py-3 px-2'>
      <div className='w-full max-w-lg'>
        <section className='flex flex-col w-full justify-start gap-1 p-2 bg-accent rounded-t-lg'>
          <div className='text-lg font-semibold'>Signup</div>
        </section>
        <FormMessages error={error} success={success} />
        <Form {...form}>
          <form
            className='space-y-4 w-full p-3'
            onSubmit={form.handleSubmit(doSignup)}
          >
            <div className='flex flex-row items-center gap-2'>
              <SignupFormField
                name='firstName'
                label='First Name'
                placeholder='First Name'
                formControl={form.control}
                required={true}
              />
              <SignupFormField
                name='lastName'
                label='Last Name'
                placeholder='Last Name'
                required={true}
                formControl={form.control}
              />
            </div>
            <SignupFormField
              name='username'
              label='Username'
              placeholder='Username'
              formControl={form.control}
              suffix={<Icons.User className='icons-size' />}
              required={true}
            />
            <SignupFormField
              name='email'
              label='Email'
              placeholder='Email'
              inputType='email'
              formControl={form.control}
              suffix={<Icons.Mail className='icons-size' />}
              required={true}
            />
            <SignupFormField
              name='phone'
              label='Phone'
              placeholder='+**-***-***-****'
              formControl={form.control}
              suffix={<Icons.Phone className='icons-size' />}
            />
            <div className='flex flex-row items-center gap-2'>
              <SignupFormField
                name='password'
                label='Password'
                placeholder='Password'
                inputType='password'
                formControl={form.control}
                suffix={<Icons.EyeOffIcon className='icons-size' />}
                required={true}
              />
              <SignupFormField
                name='confirm_password'
                label='Confirm Password'
                placeholder='Confirm Password'
                inputType='password'
                formControl={form.control}
                suffix={<Icons.EyeOffIcon className='icons-size' />}
                required={true}
              />
            </div>
            <div className='flex flex-col justify-end items-end gap-3'>
              <Button type='submit' className='bg-amber-500'>
                {!isLoading ? <Icons.UserPlus /> : <Icons.Bot />} Signup
              </Button>
              <span className='text-xs'>
                Already have an account?{" "}
                <Link href='/login' className='icons text-sky-500'>
                  Login
                </Link>{" "}
                here
              </span>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

interface SignupFormFieldProps {
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  readonly?: boolean;
  required?: boolean;
  defaultValue?: string | number | readonly string[] | undefined;
  formControl: Control<z.infer<typeof formSchema>, unknown>;
  suffix?: React.ReactNode;
}

const SignupFormField: React.FC<SignupFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  readonly,
  formControl,
  suffix,
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
            <div className='flex gap-2 items-center input-field rounded-lg p-2'>
              <Input
                className='shadow-none border-accent border-b-slate-200 rounded-none w-full focus-visible:ring-0'
                placeholder={placeholder}
                type={inputType || "text"}
                readOnly={readonly}
                required={required}
                {...field}
              />
              <div className=' text-stone-300'>{suffix}</div>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
