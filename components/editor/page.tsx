"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Editor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Let's start a new blog</p>",
  });

  return (
    <div className='bg-gray-100 p-5 w-full h-full'>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
