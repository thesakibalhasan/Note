"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  List,
  Link,
  ImageIcon,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  Tag,
  Folder,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

/* ====================== 🔑 DATA CONTRACT ====================== */
export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string
  images: string[]
}

/* ====================== 🔑 PROPS ====================== */
interface EnhancedNoteEditorProps {
  note?: Note
  onSave: (note: Note) => void
  onClose: () => void
}

export function EnhancedNoteEditor({ note, onSave, onClose }: EnhancedNoteEditorProps) {
  const [markdown, setMarkdown] = useState(
    note?.content ??
      `# Welcome to Markdown Editor

## Features
- Write markdown syntax
- See live preview
- Format text with buttons

### Get Started
Start typing in the editor on the left side and see the preview on the right!

**Bold text** and *italic text* examples below:

\`\`\`javascript
// Code block example
const hello = "world";
\`\`\`

- Item 1
- Item 2
- Item 3

[Visit Example](https://example.com)`
  )

  const [title, setTitle] = useState(note?.title ?? "")
  const [category, setCategory] = useState(note?.category ?? "")
  const [tags, setTags] = useState(note?.tags ?? "")
  const [images] = useState<string[]>(note?.images ?? [])

  const [showPreview, setShowPreview] = useState(true)
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  /* ====================== ✍️ INSERT ====================== */
  const insertMarkdown = useCallback(
    (before: string, after = "") => {
      if (!textareaRef) return

      const start = textareaRef.selectionStart
      const end = textareaRef.selectionEnd
      const selected = markdown.slice(start, end) || "text"

      const updated =
        markdown.slice(0, start) + before + selected + after + markdown.slice(end)

      setMarkdown(updated)

      setTimeout(() => {
        const pos = start + before.length + selected.length
        textareaRef.setSelectionRange(pos, pos)
        textareaRef.focus()
      }, 0)
    },
    [markdown, textareaRef]
  )

  /* ====================== 💾 SAVE ====================== */
  const handleSave = useCallback(() => {
    if (!title.trim()) {
      setAlertMessage("Note title is required.")
      setShowAlert(true)
      return
    }

    onSave({
      id: note?.id ?? crypto.randomUUID(),
      title,
      content: markdown,
      category,
      tags,
      images,
    })
  }, [title, markdown, category, tags, images, note?.id, onSave])

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950">
      {/* Alert */}
      {showAlert && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-lg max-w-sm w-full">
            <div className="flex gap-3">
              <AlertCircle className="text-red-500" />
              <div>
                <h2 className="font-semibold mb-2">Validation Error</h2>
                <p className="text-sm">{alertMessage}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button size="sm" onClick={() => setShowAlert(false)}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white dark:bg-slate-950">
        <div className="px-6 py-4 flex justify-between items-center">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="text-2xl font-bold border-0 p-0"
          />
          <div className="flex gap-2">
            {!isMobile && (
              <Button variant="ghost" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? <Eye /> : <EyeOff />}
              </Button>
            )}
            <Button onClick={handleSave}>Save</Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X />
            </Button>
          </div>
        </div>

        <div className="px-6 py-3 grid md:grid-cols-2 gap-4 border-t">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags" />
          </div>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex h-[calc(100vh-240px)]">
        <textarea
          ref={setTextareaRef}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="flex-1 p-6 font-mono resize-none"
        />

        {showPreview && (
          <div className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-slate-900">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: (p) => <h1 className="text-4xl font-bold my-6" {...p} />,
                h2: (p) => <h2 className="text-3xl font-bold my-5" {...p} />,
                h3: (p) => <h3 className="text-2xl font-bold my-4" {...p} />,
                p: (p) => <p className="my-4 leading-relaxed" {...p} />,
                ul: (p) => <ul className="list-disc list-inside my-4" {...p} />,
                ol: (p) => <ol className="list-decimal list-inside my-4" {...p} />,
                li: (p) => <li className="ml-2 my-1" {...p} />,
                code: ({ inline, ...p }: any) =>
                  inline ? (
                    <code className="bg-gray-200 px-1 rounded" {...p} />
                  ) : (
                    <pre className="bg-gray-200 p-4 rounded my-4 overflow-auto">
                      <code {...p} />
                    </pre>
                  ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
