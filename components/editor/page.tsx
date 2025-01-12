"use client";
// import Form from "next/form";

import { Button } from "../ui/button";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import { SubTopic } from "@/types/types";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FieldPath, Control, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Icons from "../Icons";

const formSchema = z.object({
  id: z.number(),
  topicId: z.number(),
  heading: z.string().min(1).max(255),
  subHeading: z.string().min(1).max(255),
  slug: z.string(),
  imageUrl: z.string(),
  isPublished: z.string(),
  content: z.string(),
});

async function createPostLocal(formData: z.infer<typeof formSchema>) {
  try {
    const response = await fetch(subtopics_url, {
      method: "PATCH",
      body: JSON.stringify(formData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error("Error: " + data.errors);
    } else {
      toast("Thank You! we have received your message");
    }
  } catch (error) {
    toast(`Error: ${error}`);
  }
}

type Params = { subId: string | undefined };

export default function Editor({ params }: { params?: Params }) {
  const subId = "" + params?.subId;

  const [subtopic, setSubtopic] = useState<SubTopic>();
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: -1,
      topicId: -1,
      heading: "",
      slug: "",
      subHeading: "",
      imageUrl: "",
      isPublished: "",
      content: "",
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      const fetchURL = `${subtopics_url}/s/${subId}`;

      const response = await fetch(fetchURL);

      if (!response.ok) {
        toast(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setSubtopic(result);
      form.setValue("id", result.id);
      form.setValue("topicId", result.topicId);
      form.setValue("heading", result.heading);
      form.setValue("subHeading", result.subHeading);
      form.setValue("slug", result.slug);
      form.setValue("imageUrl", result.imageUrl);
      form.setValue("content", result.content);
    };

    fetchData().catch((e) => {
      console.error("An error occurred while fetching data: ", e);
    });
  }, [subId, form]);

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //     setIsLoading(true);
  //     setError(null);
  //     setSuccess(null);

  //     try {
  //       const response = await fetch(subtopics_url, {
  //         method: "PATCH",
  //         body: JSON.stringify(values),
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const data = await response.json();
  //       if (!response.ok) {
  //         throw new Error("Error: " + data.errors);
  //       } else {
  //         setSuccess(`Thank you, we have received your message`);
  //         toast("Thank You! we have received your message");
  //       }
  //     } catch (error) {
  //       setError("" + error.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  return (
    <main className='flex flex-col w-full items-center h-full py-3'>
      <section className='flex flex-col w-full justify-start gap-1 py-1 bg-stone-100 rounded-t-lg'>
        <div className='text-2xl font-semibold'>Blog Editor</div>
      </section>
      <section className='flex flex-col w-full justify-center items-center shadow-inner p-2'>
        {/* {success && <p className='text-green-600 font-semibold'>{success}</p>}
        {error && <p className='text-red-600 font-semibold'>{error}</p>} */}

        <Form {...form}>
          <form
            className='space-y-4 w-full'
            onSubmit={form.handleSubmit(createPostLocal)}
          >
            <EditorFormField
              name='id'
              label='Id'
              placeholder='Id'
              inputType='text'
              formControl={form.control}
              readonly
            />
            <EditorFormField
              name='topicId'
              label='Topic Id'
              placeholder='Topic'
              inputType='number'
              formControl={form.control}
            />
            <EditorFormField
              name='heading'
              label='Heading'
              placeholder='Heading'
              formControl={form.control}
            />
            <EditorFormField
              name='subHeading'
              label='Sub Heading'
              placeholder='Sub Heading'
              formControl={form.control}
            />
            <EditorFormField
              name='slug'
              label='Slug'
              placeholder='Slug'
              formControl={form.control}
            />
            <div className='flex flex-row items-end p-1 gap-2 rounded w-full hover:bg-slate-100 dark:hover:bg-slate-700'>
              <EditorFormField
                name='imageUrl'
                label='Image Url'
                placeholder='Image Url'
                formControl={form.control}
              />
              <div
                style={{
                  backgroundImage: `url(${
                    subtopic?.imageUrl === null
                      ? "/ai4.png"
                      : subtopic?.imageUrl
                  })`,
                }}
                className={`flex justify-center items-center
              bg-center bg-cover self-center 
              max-w-16 min-w-16 w-16 aspect-square rounded-lg`}
              >
                &nbsp;
              </div>
            </div>
            <FormField
              control={form.control}
              name={"content"}
              render={({ field }) => (
                <FormItem className=' w-full'>
                  <FormLabel className='ml-1 font-semibold'>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      className='input-field w-full h-fit'
                      placeholder={"Content"}
                      rows={40}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end'>
              <Button type='submit' className='bg-amber-500'>
                {/* {isLoading ? "Loading..." : "Submit"} */} <Icons.Save />{" "}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </main>
  );
}

interface EditorFormFieldProps {
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  readonly?: boolean;
  defaultValue?: string | number | readonly string[] | undefined;
  formControl: Control<z.infer<typeof formSchema>, unknown>;
}

const EditorFormField: React.FC<EditorFormFieldProps> = ({
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
        <FormItem className=' w-full'>
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
