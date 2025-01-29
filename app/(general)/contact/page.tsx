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
import { contact_secure_url } from "@/utils/endpoints/endpoints";
import { toast } from "sonner";
import FormMessages from "@/components/FormMessages";

const formSchema = z.object({
  email: z.string().email({
    message: "Enter valid email.",
  }),
  // firstName: z.string().min(1).max(255),
  // lastName: z.string().min(1).max(255),
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
      // firstName: "",
      // lastName: "",
      subject: "",
      message: "",
    },
  });
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts?.pop()?.split(";").shift();
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    const token = getCookie("token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      accept: "*/*",
      authorization: "Bearer " + token,
    };
    const fetchOption = {
      method: "POST",

      headers: headers,

      body: JSON.stringify(values),
    };
    await fetch(contact_secure_url, fetchOption)
      .then((res) => {
        console.log(token);
        console.log(res);
        if (!res.ok) {
          throw new Error("Error: " + res.status + ": " + res.statusText);
        }
        setSuccess(`Thank you, we have received your message`);
        toast("Thank You! we have received your message");
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setIsLoading(false));
  }
  return (
    <main className='flex flex-col items-center h-full py-3 rounded-lg px-2'>
      <section className='flex flex-col w-full justify-start gap-1 p-2 rounded-t-lg bg-accent'>
        <div className='text-2xl font-semibold'>Contact me</div>
        <div className='font-normal'>Looking forward to hearing from you</div>
      </section>
      <section className='flex flex-col w-full justify-center items-center shadow-inner py-5'>
        <FormMessages error={error} success={success} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 w-full px-5'
          >
            {/* <ProfileFormField
              name='firstName'
              label='First Name'
              placeholder='First Name'
              readonly
              formControl={form.control}
            />
            <ProfileFormField
              name='lastName'
              label='Last Name'
              placeholder='Last Name'
              readonly
              formControl={form.control}
            />*/}
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
              className='input-field w-full focus-visible:ring-0'
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
