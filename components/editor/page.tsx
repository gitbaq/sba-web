"use client";
import { Editor } from "@tinymce/tinymce-react";
import { toolbars } from "./toolbars";
// import { useState } from "react";

type Params = { subId: string | undefined };

function Ed({ subId }: { subId: string }) {
  // const [text, setText] = useState<string | undefined>("");
  // const [value, setValue] = useState("");
  // const onEditorInputChange = (newValue: string, editor: Editor) => {
  //   setValue(newValue);
  //   setText(editor.editor?.getContent({ format: "text" }));
  // };
  return (
    <div>
      {subId}
      {/* - {text} - {value} */}

      <Editor
        init={{
          toolbar: toolbars,
          branding: false,

          menu: {
            edit: { title: "Edit", items: "undo, redo, selectall" },
          },
        }}
        apiKey='tqchffhdimppm96ah4hancfg4cl7om9zq89s18mxpgjcd9q1' // your api key here
        initialValue={"Write your thoughts here..."}
        // onInit={(editor: Editor) =>
        //   setText(editor.editor?.getContent({ format: "text" }))
        // }
        // onEditorChange={(newValue: string, editor: Editor) =>
        //   onEditorInputChange(newValue, editor)
        // }
      />
    </div>
  );
}

export default function XEditor({ params }: { params?: Params }) {
  const subId = "" + params?.subId;

  return (
    <div>
      <Ed subId={subId} />
    </div>
  );
}
