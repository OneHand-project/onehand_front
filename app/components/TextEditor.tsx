import "~/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "~/components/tiptap-node/image-node/image-node.scss";

import { forwardRef, HTMLAttributes, useState } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";
import { HeadingButton } from "./tiptap-ui/heading-button";

import { Image } from "@tiptap/extension-image";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Underline } from "@tiptap/extension-underline";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { MarkButton } from "./tiptap-ui/mark-button";
import { TextAlignButton } from "./tiptap-ui/text-align-button";
import { TextAlign } from "@tiptap/extension-text-align";
import { ImageUploadButton } from "~/components/tiptap-ui/image-upload-button";
import { ImageUploadNode } from "./tiptap-node/image-upload-node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "react-router";
import { Separator } from "./ui/separator";

interface TextEditorProps extends HTMLAttributes<HTMLDivElement> {
  onUpdate?: (html: string) => void; // or any other method signature
  token: string;
}

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>(
  ({ className, onUpdate, token, ...props }, ref) => {
    TextEditor.displayName = "Editor";
    const MAX_FILE_SIZE = 2048 * 2048;
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
        let url = "";
        for (let progress = 0; progress <= 100; progress += 10) {
          if (abortSignal?.aborted) {
            throw new Error("Upload cancelled");
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
          onProgress?.({ progress });
          const formdata = new FormData();
          formdata.append("list", file);

          const res = await fetch(
            `http://localhost:8080/api/campaigns/upload`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formdata,
            }
          );
          if (!res.ok) return "";
          url = await res.text();
        }
        return url;
      } catch (e) {
        console.error(e);
      }
      return "";
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
