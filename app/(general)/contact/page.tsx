"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
// import Socials from "@/components/socials";
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

const formSchema = z.object({
  email: z.string().email({
    message: "Enter valid email.",
  }),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  subject: z.string().max(255),
  message: z.string().min(1).max(2000),
});

export default function Contact() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(contact_url, {
        method: "POST",
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
        setSuccess(`Thank you, we have received your message`);
        toast("Thank You! we have received your message");
      }
    } catch (error) {
      setError("" + error.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <main className='flex flex-col items-center h-full py-3 rounded-lg px-2'>
      <section className='flex flex-col w-full justify-start gap-1 p-2 rounded-t-lg bg-stone-100'>
        <div className='text-2xl font-semibold'>Contact</div>
        <div className='font-normal'>Looking forward to hearing from you!</div>
      </section>
      <section className='flex flex-col w-full justify-center items-center shadow-inner py-5'>
        {success && <p className='text-green-600 font-semibold'>{success}</p>}
        {error && <p className='text-red-600 font-semibold'>{error}</p>}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 w-full px-5'
          >
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
            <ProfileFormField
              name='email'
              label='Email'
              placeholder='Email'
              inputType='email'
              formControl={form.control}
            />
            <ProfileFormField
              name='subject'
              label='Subject'
              placeholder='Subject'
              formControl={form.control}
            />
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className='input-field'
                      placeholder='Message'
                      rows={10}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription className='text-sky-600'>
                    * Your suggestions and comments are important to me.
                    I&apos;ll (try to) get back shortly.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button type='submit' className='bg-amber-500'>
                {isLoading ? "Loading..." : "🚀 Send Message"}
              </Button>
            </div>
          </form>
        </Form>
      </section>
      <section
        className='flex flex-col w-full justify-start items-center gap-5
       bg-slate-100 rounded-b-lg'
      ></section>
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
        <FormItem className='w-full'>
          {inputType != "hidden" && (
            <FormLabel className='ml-1 font-semibold'>{label}</FormLabel>
          )}
          <FormControl>
            <Input
              className='input-field w-full'
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
