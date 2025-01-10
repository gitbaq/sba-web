"use client";
import React, { useEffect, useState } from "react";
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
import { subtopics_url } from "@/utils/endpoints/endpoints";
import { toast } from "sonner";
import { SubTopic } from "@/types/types";
import { useParams } from "next/navigation";
import Icons from "../Icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "../ui/tooltip";

const formSchema = z.object({
  id: z.number(),
  heading: z.string(),
  subHeading: z.string(),
  slug: z.string(),
  content: z.string(),
  imageUrl: z.string(),
  // isPublished: z.boolean(),
});

export default function Editor() {
  const searchParams = useParams<{ subId: string }>();
  const subId = searchParams.subId;
  useEffect(() => {
    if (subId == null) {
      toast("No Article Selected");
      return;
    }
    const fetchData = async () => {
      const fetchURL = `${subtopics_url}/s/${subId}`;

      const response = await fetch(fetchURL);

      if (!response.ok) {
        toast(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
        return;
      }
      const result = await response.json();

      // form.setValue("id", result.id);
      // form.setValue("heading", result.heading);
      // form.setValue("subHeading", result.subHeading);
      // form.setValue("slug", result.slug);
      // form.setValue("imageUrl", result.imageUrl);
      // form.setValue("content", result.content);

      setSubTopic(result);
    };

    fetchData().catch((e) => {
      console.error("An error occurred while fetching data: ", e);
    });
  }, [subId]);

  const [subTopic, setSubTopic] = useState<SubTopic>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      id: 0,
      heading: "",
      subHeading: "",
      slug: "",
      content: "",
      imageUrl: "",
      // isPublished: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    debugger;
    try {
      const response = await fetch(subtopics_url, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        toast("No ");
        throw new Error("Error: " + data.errors);
      } else {
        setSuccess(`Changes are saved`);
        toast("Changes are saved");
      }
    } catch (error) {
      setError("" + error.message);
      toast("" + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className='flex flex-col items-center h-full w-full'>
      <section className='flex flex-row w-full justify-between items-center bg-slate-600 text-slate-100 text-sm font-semibold'>
        <div>
          <span className='w-2 h-2 bg-amber-400 mr-1'>&nbsp;</span>
          Blog Editor
        </div>
        <div className='flex flex-row items-center text-xs gap-1 px-1'>
          <div className='flex flex-row items-center gap-1'>
            Preview <Icons.ExternalLink className='h-3 w-3' />
          </div>
        </div>
      </section>
      <section className='flex flex-col w-full justify-center items-center shadow-inner p-1'>
        {success && <p className='text-green-600 font-semibold'>{success}</p>}
        {error && <p className='text-red-600 font-semibold'>{error}</p>}
        {subTopic && (
          <div className='flex text-green-600 font-semibold justify-start w-full p-1 text-xs'>
            <Tooltip>
              <TooltipTrigger>
                <Icons.Info className='w-4 h-4' />
              </TooltipTrigger>
              <TooltipContent>
                <div className='bg-white text-slate-800 text-xs max-w-sm max-h-48 overflow-auto'>
                  {JSON.stringify(subTopic)}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        {!subTopic && (
          <p className='text-green-600 font-semibold'>Select Article to Edit</p>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 w-full'
          >
            {/* <Select onValueChange={field.onChange} defaultValue={field.value}> */}
            <Select>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select a verified email to display' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='m@example.com'>m@example.com</SelectItem>
                <SelectItem value='m@google.com'>m@google.com</SelectItem>
                <SelectItem value='m@support.com'>m@support.com</SelectItem>
              </SelectContent>
            </Select>

            <ProfileFormField
              name='id'
              inputType='text'
              label='ID'
              placeholder='Article ID'
              formControl={form.control}
            />

            <div className='flex flex-row w-full justify-evenly gap-2'>
              <ProfileFormField
                name='heading'
                label='Heading'
                placeholder='Heading'
                formControl={form.control}
              />
              <ProfileFormField
                name='slug'
                label='Slug'
                placeholder='Slug'
                formControl={form.control}
              />
            </div>
            <ProfileFormField
              name='subHeading'
              label='Sub Heading'
              placeholder='Sub Heading'
              formControl={form.control}
            />
            <div className='flex flex-row w-full items-end gap-2'>
              <ProfileFormField
                name='imageUrl'
                label='Image URL'
                placeholder='Image URL'
                formControl={form.control}
              />
              {subTopic?.imageUrl && (
                <span
                  style={{
                    backgroundImage: `url(${
                      subTopic.imageUrl === null
                        ? "/ai4.png"
                        : subTopic.imageUrl
                    })`,
                  }}
                  className={`flex justify-center items-center
              bg-center bg-cover self-center 
              w-20 h-20 mx-1 rounded`}
                >
                  &nbsp;
                </span>
              )}
            </div>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={20}
                      className='input-field'
                      placeholder='Content'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button type='submit' className='bg-amber-500'>
                {isLoading ? "Loading..." : "Submit"}
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
  label?: string;
  placeholder?: string;
  description?: string;
  inputType?: string;
  readonly?: boolean;
  value?: unknown;

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
