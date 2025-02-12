"use client";

import { Button } from "../ui/button";
import {
  subtopics_secure_url,
  subtopics_url,
} from "@/utils/endpoints/endpoints";
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
import FormMessages from "../FormMessages";

const formSchema = z.object({
  id: z.number(),
  topicId: z.number(),
  heading: z.string().min(1).max(255),
  subHeading: z.string().min(1).max(255),
  slug: z.string(),
  imageUrl: z.string(),
  isPublished: z.number(),
  content: z.string(),
});

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts?.pop()?.split(";").shift();
  }
  return "ERROR " + value;
}

type Params = { subId: string | undefined };

export default function Editor({ params }: { params?: Params }) {
  const subId = "" + params?.subId;

  const [subtopic, setSubtopic] = useState<SubTopic>();
  const [mode, setMode] = useState<string>("POST");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: -1,
      topicId: -1,
      heading: "",
      slug: "",
      subHeading: "",
      imageUrl: "",
      isPublished: 0,
      content: "",
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      const fetchURL = `${subtopics_url}/s/${subId}`;

      const response = await fetch(fetchURL);

      if (!response.ok) {
        toast(`HTTP error! status: ${response.status}`);
        return;
      }
      const result = await response.json();
      setSubtopic(result);
      setMode("PATCH");
      form.setValue("id", result.id);
      form.setValue("topicId", result.topicId);
      form.setValue("heading", result.heading);
      form.setValue("subHeading", result.subHeading);
      form.setValue("slug", result.slug);
      form.setValue("imageUrl", result.imageUrl);
      form.setValue("content", result.content);
      form.setValue("isPublished", result.isPublished ? 1 : 0);
    };

    fetchData().catch((e) => {
      console.error("An error occurred while fetching data: ", e);
    });
  }, [subId, form]);

  async function createUpdatePost(formData: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const token = getCookie("token");
    if (token === null || token?.indexOf("ERROR") === 0) {
      setError(`Token Error: ${token}`);
      return;
    }

    await fetch(subtopics_secure_url, {
      method: mode,
      body: JSON.stringify(formData),

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        res.json().then((data) => {
          console.log("Data: " + data);
          if (!res.ok) {
            throw new Error(data.errors);
          } else {
            setSuccess("Changes are saved");
            toast("Changes are saved");
          }
        });
      })
      .catch((error) => {
        setError(`Error: ${error}`);
        toast(`${error}`);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <main className='flex flex-col w-full items-center h-full py-3'>
      <section className='flex flex-col w-full justify-start gap-1 py-1 px-2 bg-stone-100 dark:bg-stone-700 rounded-t-lg'>
        <div className='text-2xl font-semibold'>Blog Editor</div>
      </section>

      <section className='flex flex-col w-full justify-center items-center shadow-inner p-2'>
        <FormMessages error={error} success={success} />

        <Form {...form}>
          <form
            className='space-y-4 w-full'
            onSubmit={form.handleSubmit(createUpdatePost)}
          >
            <div className='flex justify-end'>
              <Button type='submit' className='bg-amber-500 w-full'>
                <Icons.Save /> {isLoading ? "Saving..." : "Save"}
                Changes
              </Button>
            </div>
            <EditorFormField
              name='id'
              label='Id'
              placeholder='Id'
              inputType='number'
              formControl={form.control}
              readonly
            />
            <EditorFormField
              name='isPublished'
              label='Published?'
              placeholder='Published?'
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
              <Button type='submit' className='bg-amber-500 w-full'>
                <Icons.Save /> {isLoading ? "Saving..." : "Save"}
                Changes
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
  defaultValue?: string | number | boolean | readonly string[] | undefined;
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
              type={inputType ? inputType : "text"}
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
