"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldPath, useForm } from "react-hook-form";
import { subs_url } from "@/utils/endpoints/endpoints";
import Link from "next/link";
import Icons from "@/components/Icons";
import FormMessages from "@/components/FormMessages";

const formSchema = z.object({
  id: z.number(),
  email: z.string().email({
    message: "Enter valid email.",
  }),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
});

type Params = Promise<{ id: number }>;

export default function Profile({ params }: { params: Params }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      id: -1,
      email: "",
      firstName: "",
      lastName: "",
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      const subId = (await params).id;
      console.log(`Sub Id: ${subId}`);

      const response = await fetch(`${subs_url}/${subId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // form.setFocus("email");
      form.setValue("id", result.id);
      form.setValue("email", result.email);
      if (result.firstName != null) {
        form.setValue("firstName", result?.firstName);
      }

      if (result.lastName != null) {
        form.setValue("lastName", result?.lastName);
      }
    };

    fetchData().catch((e) => {
      console.error("An error occurred while fetching the data: ", e);
    });
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(subs_url, {
        method: "PATCH",
        body: JSON.stringify(values),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Error: " + data.errors);
      } else {
        setSuccess(`Welcome! ${data.firstName}`);
      }
    } catch (error) {
      setError("" + error.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <main className='flex w-full min-h-screen bg-gray-50 flex-col items-center justify-between rounded-xl'>
      <section className='w-4/5 max-w-2xl py-5'>
        <div className='mb-8 flex flex-col gap-2'>
          <h1 className='text-2xl font-semibold'>Complete Signup</h1>
          <p className='text-sm text-neutral-500'>
            Already have an account?{" "}
            <Link href='/login' className='icons underline underline-offset-4'>
              Login
            </Link>
          </p>
          <FormMessages error={error} success={success} />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <ProfileFormField
              name='id'
              label='Id'
              placeholder='Id'
              inputType='hidden'
              formControl={form.control}
            />
            <ProfileFormField
              name='email'
              readonly={true}
              label='Email'
              placeholder='Email'
              inputType='email'
              formControl={form.control}
            />
            <div className='grid grid-cols-2 gap-3'>
              <ProfileFormField
                name='firstName'
                label='First Name'
                placeholder='First Name'
                formControl={form.control}
              />
              <ProfileFormField
                name='lastName'
                label='Last Name'
                placeholder='Last Name'
                formControl={form.control}
              />
            </div>
            <div className='flex justify-end'>
              <Button type='submit' className='bg-amber-500'>
                <Icons.UserPlus /> {isLoading ? "Loading..." : "Signup"}
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </main>
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
        <FormItem>
          {inputType != "hidden" && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              className='input-field'
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
