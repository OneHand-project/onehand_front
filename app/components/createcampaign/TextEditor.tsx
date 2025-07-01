import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";

import { forwardRef, HTMLAttributes } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";

import { Image } from "@tiptap/extension-image";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Underline } from "@tiptap/extension-underline";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Separator } from "~/components/ui/separator";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { HeadingButton } from "@/components/tiptap-ui/heading-button";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";

interface TextEditorProps extends HTMLAttributes<HTMLDivElement> {
  onUpdate?: (html: string) => void; // or any other method signature
  token: string;
}

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>(
  ({ className, onUpdate, token, ...props }, ref) => {
    TextEditor.displayName = "Editor";
    const MAX_FILE_SIZE = 2048 * 2048;
    const API_URL = import.meta.env.VITE_API_URL;

    const handleImageUpload = async (
      file: File,
      onProgress?: (event: { progress: number }) => void,
      abortSignal?: AbortSignal
    ): Promise<string> => {
      if (!file) {
        throw new Error("No file provided");
      }
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          `File size exceeds maximum allowed (${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB)`
        );
      }

      try {
        onProgress?.({ progress: 0 });

        if (abortSignal?.aborted) {
          throw new Error("Upload cancelled");
        }

        const formdata = new FormData();
        formdata.append("list", file);

        const res = await fetch(`${API_URL}/api/campaigns/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formdata,
        });

        onProgress?.({ progress: 100 });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Upload failed: ${res.status} ${res.statusText} - ${errorText}`
          );
        }

        return await res.text();
      } catch (e) {
        console.error("Upload error:", e);
        throw e; // Re-throw the error instead of swallowing it
      }
    };

    const editor: Editor | null = useEditor({
      extensions: [
        StarterKit,
        Image,
        ImageUploadNode.configure({
          accept: "image/*",
          maxSize: MAX_FILE_SIZE,
          limit: 3,
          upload: handleImageUpload,
          onError: (error) => console.error("Upload failed:", error),
        }),
        Underline,
        Superscript,
        Subscript,
        Paragraph.configure({
          HTMLAttributes: {
            class: "fixspace",
          },
        }),
        TextAlign.configure({
          types: ["heading"],
        }),
      ],
      immediatelyRender: false,
      autofocus: true,
      onUpdate: ({ editor }) => {
        onUpdate?.(editor.getHTML());
      },
    });

    return (
      <EditorContext.Provider value={{ editor }}>
        <div
          className="tiptap-button-group border rounded-lg bg-slate-50/50 p-4"
          data-orientation="horizontal"
        >
          <HeadingButton level={1}></HeadingButton>
          <HeadingButton level={2}></HeadingButton>
          <HeadingButton level={3}></HeadingButton>
          <HeadingButton level={4}></HeadingButton>

          <Separator orientation="vertical" className="h-6 w-0.5" />
          <MarkButton type="bold" />
          <MarkButton type="italic" />
          <MarkButton type="strike" />
          <MarkButton type="underline" />
          <MarkButton type="superscript" />
          <MarkButton type="subscript" />

          <Separator orientation="vertical" className="h-6 w-0.5" />

          <TextAlignButton align="left" />
          <TextAlignButton align="center" />
          <TextAlignButton align="right" />
          <TextAlignButton align="justify" />
          <Separator orientation="vertical" className="h-6 w-0.5" />
          <ImageUploadButton text="Add" />
        </div>
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    );
  }
);

export { TextEditor as Editor };
