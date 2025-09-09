"use client";
import { Editor } from "@tinymce/tinymce-react";
import { toolbars } from "./toolbars";
import { SubTopic } from "@/types/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/utils/AuthContext";
import { subtopics_secure_url } from "@/utils/endpoints/endpoints";
import { toast } from "sonner";
import Image from "next/image";

type Params = { subId: string | undefined; post: SubTopic };

export default function XEditor({ params }: { params?: Params }) {
  const post: SubTopic | undefined = params?.post;
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    id: post?.id || 0,
    topicId: post?.topicId,
    publishDate: post?.publishDate,
    publishedBy: post?.publishedBy,
    createdBy: post?.createdBy,
    updatedBy: post?.updatedBy,
    isPublished: post?.isPublished || false,
    heading: post?.heading,
    subHeading: post?.subHeading,
    slug: post?.slug,
    imageUrl: post?.imageUrl,
    content: post?.content,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!token || !formData.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${subtopics_secure_url}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Post updated successfully!");
      } else {
        toast.error("Failed to update post");
      }
    } catch (error) {
      toast.error("Error updating post");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='h-full flex flex-col gap-4 p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 border border-stone-200 bg-stone-100 dark:border-gray-800 dark:bg-gray-900 rounded-xl p-5'>
        <div>
          <Label htmlFor='heading'>Heading</Label>
          <Input
            id='heading'
            value={formData.heading}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, heading: e.target.value }))
            }
            placeholder='Enter heading'
          />
        </div>

        <div>
          <Label htmlFor='slug'>Slug</Label>
          <Input
            id='slug'
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            placeholder='Enter slug'
          />
        </div>
        <div className='md:col-span-2'>
          <Label htmlFor='subHeading'>Sub Heading</Label>
          <Input
            id='subHeading'
            value={formData.subHeading}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, subHeading: e.target.value }))
            }
            placeholder='Enter sub heading'
          />
        </div>
        <div className='md:col-span-2'>
          <Label htmlFor='imageUrl'>Image URL</Label>
          <div className='flex gap-2 items-end'>
            <Input
              id='imageUrl'
              value={formData.imageUrl || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
              placeholder='Enter image URL'
            />
            {formData.imageUrl && (
              <div className='w-12 h-12 relative rounded border'>
                <Image
                  src={formData.imageUrl}
                  alt='Thumbnail'
                  fill
                  className='object-cover rounded'
                  onError={() => {}}
                />
              </div>
            )}
          </div>
        </div>
        <div className='flex justify-end my-4 col-span-2'>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className='bg-green-600 hover:bg-green-700'
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className='flex-1'>
        <Label>Content</Label>
        <Editor
          init={{
            toolbar: toolbars,
            branding: false,
            height: "100%",
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
              "autosave",
            ],

            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            menu: {
              edit: { title: "Edit", items: "undo, redo, selectall" },
            },
          }}
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={formData.content}
          onEditorChange={(newContent) =>
            setFormData((prev) => ({ ...prev, content: newContent }))
          }
        />
      </div>

      <div className='flex justify-end my-4'>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className='bg-green-600 hover:bg-green-700'
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
