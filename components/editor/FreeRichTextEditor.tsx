"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
};

export type FreeRichTextEditorHandle = {
  getHTML: () => string;
};

/** Free, self-hosted rich text (TipTap/ProseMirror). No API key, no cloud. */
const FreeRichTextEditor = forwardRef<FreeRichTextEditorHandle, Props>(
  function FreeRichTextEditor({ value, onChange, className = "" }, ref) {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer" },
        }),
        Image,
        Placeholder.configure({ placeholder: "Write the essay…" }),
      ],
      content: value || "",
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            "prose-article min-h-[28rem] max-w-none px-4 py-3 focus:outline-none text-foreground",
        },
      },
      onUpdate: ({ editor: ed }) => {
        onChange(ed.getHTML());
      },
    });

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() || "",
    }));

    if (!editor) return null;

    return (
      <div
        className={[
          "rounded-lg border border-border bg-card overflow-hidden flex flex-col",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className='flex flex-wrap gap-1 border-b border-border bg-secondary/40 p-2'>
          <ToolbarBtn
            label='Bold'
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarBtn
            label='Italic'
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarBtn
            label='H2'
            active={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          />
          <ToolbarBtn
            label='H3'
            active={editor.isActive("heading", { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          />
          <ToolbarBtn
            label='List'
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarBtn
            label='Ordered'
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarBtn
            label='Quote'
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarBtn
            label='Code'
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
          <ToolbarBtn
            label='Link'
            active={editor.isActive("link")}
            onClick={() => {
              const prev = editor.getAttributes("link").href as
                | string
                | undefined;
              const url = window.prompt("URL", prev || "https://");
              if (url === null) return;
              if (url === "") {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                return;
              }
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }}
          />
          <ToolbarBtn
            label='Image'
            onClick={() => {
              const url = window.prompt("Image URL");
              if (!url) return;
              editor.chain().focus().setImage({ src: url }).run();
            }}
          />
        </div>
        <EditorContent editor={editor} />
      </div>
    );
  }
);

export default FreeRichTextEditor;

function ToolbarBtn({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <Button
      type='button'
      variant={active ? "default" : "outline"}
      size='sm'
      className='h-8 px-2 text-xs'
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
