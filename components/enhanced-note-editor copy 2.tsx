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

/* ======================
   🔑 SYSTEM DATA CONTRACT
====================== */
export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string
  images: string[]
}

/* ======================
   🔑 EDITOR PROPS
====================== */
interface EnhancedNoteEditorProps {
  note?: Note
  onSave: (note: Note) => void
  onClose: () => void
}

export function EnhancedNoteEditor({ note, onSave, onClose }: EnhancedNoteEditorProps) {
  const [markdown, setMarkdown] = useState(
    note?.content ||
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

  const [title, setTitle] = useState(note?.title || "")
  const [category, setCategory] = useState(note?.category || "")
  const [tags, setTags] = useState(note?.tags || "")
  const [images] = useState<string[]>(note?.images || [])

  const [showPreview, setShowPreview] = useState(true)
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  const insertMarkdown = useCallback(
    (before: string, after = "") => {
      if (!textareaRef) return

      const start = textareaRef.selectionStart
      const end = textareaRef.selectionEnd
      const selectedText = markdown.substring(start, end) || "text"
      const newMarkdown =
        markdown.substring(0, start) + before + selectedText + after + markdown.substring(end)

      setMarkdown(newMarkdown)

      setTimeout(() => {
        const newCursorPos = start + before.length + selectedText.length
        textareaRef.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.focus()
      }, 0)
    },
    [markdown, textareaRef]
  )

  /* ======================
     🔥 SAVE LOGIC (FIXED)
  ====================== */
  const handleSave = useCallback(() => {
    if (!title.trim()) {
      setAlertMessage("Note title is required.")
      setShowAlert(true)
      return
    }

    const savedNote: Note = {
      id: note?.id || crypto.randomUUID(),
      title,
      content: markdown,
      category,
      tags,
      images,
    }

    onSave(savedNote)
  }, [title, markdown, category, tags, images, onSave, note?.id])

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950">
      {/* Alert Dialog */}
      {showAlert && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 rounded-lg shadow-lg max-w-sm w-full p-6 border border-gray-200 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Validation Error</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{alertMessage}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowAlert(false)} size="sm">
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="text-2xl font-bold border-0 focus-visible:ring-0 p-0 h-auto"
          />

          <div className="flex gap-2">
            {!isMobile && (
              <Button onClick={() => setShowPreview(!showPreview)} variant="ghost" size="sm" className="gap-2">
                {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
            )}
            <Button onClick={handleSave}>Save Note</Button>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="px-4 md:px-6 py-3 border-t border-gray-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-gray-500" />
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="border-0 focus-visible:ring-0 p-0 h-auto text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="border-0 focus-visible:ring-0 p-0 h-auto text-sm"
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 md:px-6 py-3 border-t border-gray-200 dark:border-slate-800 flex flex-wrap gap-2">
          <button onClick={() => insertMarkdown("**", "**")} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md">
            <Bold className="h-4 w-4" />
          </button>
          <button onClick={() => insertMarkdown("*", "*")} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md">
            <Italic className="h-4 w-4" />
          </button>
          <button onClick={() => insertMarkdown("`", "`")} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md">
            <Code className="h-4 w-4" />
          </button>
          <button onClick={() => insertMarkdown("# ")} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md">
            <Heading1 className="h-4 w-4" />
          </button>
          <button onClick={() => insertMarkdown("## ")} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md">
            <Heading2 className="h-4 w-4" />
          </button>
          <button onClick={() => insertMarkdown("- ")} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md">
            <List className="h-4 w-4" />
          </button>
          <button onClick={() => insertMarkdown("[Link](https://)")} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md">
            <Link className="h-4 w-4" />
          </button>
          <button onClick={() => insertMarkdown("![Alt](https://)")} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md">
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex h-[calc(100vh-280px)] md:h-[calc(100vh-240px)]">
        {(!isMobile || activeTab === "editor") && (
          <textarea
            ref={setTextareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 p-6 resize-none font-mono text-sm"
          />
        )}

        {(!isMobile || activeTab === "preview") && (showPreview || isMobile) && (
          <div className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-slate-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
