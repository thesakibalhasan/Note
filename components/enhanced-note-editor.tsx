"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  AlertCircle,
  Tag,
  Folder,
} from "lucide-react"
import * as Icons from "lucide-react"
import { MarkdownPreview } from "@/components/markdown-preview"
import { CategoryManager } from "@/lib/category-manager"

import hljs from "highlight.js"
import { marked } from "marked"
import "highlight.js/styles/github-dark.css"

/* ================= MARKDOWN + HIGHLIGHT CONFIG ================= */

marked.setOptions({
  highlight: (code: string, lang: string | undefined) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
} as any)

/* ================= TYPES ================= */

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface Note {
  title: string
  content: string
  category: string
  tags: string
  images: string[]
}

interface EditorProps {
  note?: Note
  onSave: (note: Note) => void
  onClose: () => void
}

/* ================= ICON LOADER ================= */

const getIconComponent = (iconName: string, className = "h-4 w-4") => {
  const Icon = (Icons as any)[iconName] || Folder
  return <Icon className={className} />
}

/* ================= COMPONENT ================= */

export function EnhancedNoteEditor({ note, onClose, onSave }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const categoryManager = CategoryManager.getInstance()

  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState(note?.title ?? "")
  const [markdown, setMarkdown] = useState(note?.content ?? "")
  const [currentCategory, setCurrentCategory] = useState("")
  const [tags, setTags] = useState("")
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [images] = useState<string[]>(note?.images ?? [])

  /* ================= LOAD CATEGORIES ================= */

  useEffect(() => {
    const loaded = categoryManager.getAllCategories()
    setCategories(Array.isArray(loaded) ? loaded : [])
    if (loaded?.length) setCurrentCategory(loaded[0].name)
  }, [categoryManager])

  /* ================= INSERT MARKDOWN ================= */

  const insertMarkdown = useCallback(
    (before: string, after = "") => {
      if (!textareaRef.current) return
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = markdown.slice(start, end) || "text"

      const updated =
        markdown.slice(0, start) +
        before +
        selected +
        after +
        markdown.slice(end)

      setMarkdown(updated)

      requestAnimationFrame(() => {
        const pos = start + before.length + selected.length
        textarea.setSelectionRange(pos, pos)
        textarea.focus()
      })
    },
    [markdown],
  )

  /* ================= SAVE ================= */

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      setAlertMessage("Note title is required.")
      setShowAlert(true)
      return
    }

    onSave({
      title,
      content: markdown,
      category: currentCategory,
      tags,
      images,
    })
  }, [title, markdown, currentCategory, tags, images, onSave])

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950">
      {/* ALERT */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
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

      {/* HEADER */}
      <div className="sticky top-0 border-b bg-white dark:bg-slate-950">
        <div className="px-6 py-4 flex justify-between items-center">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="text-2xl font-bold border-0 p-0"
          />

          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X />
            </Button>
          </div>
        </div>

        {/* CATEGORY + TAGS */}
        <div className="px-6 py-3 grid md:grid-cols-2 gap-4 border-t">
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Folder className="h-4 w-4" /> Category
            </label>

            <Select value={currentCategory} onValueChange={setCurrentCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: cat.color }}>
                        {getIconComponent(cat.icon)}
                      </span>
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4" /> Tags
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2"
            />
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="px-6 py-3 border-t flex gap-2">
          <button onClick={() => insertMarkdown("**", "**")}><Bold /></button>
          <button onClick={() => insertMarkdown("*", "*")}><Italic /></button>
          <button onClick={() => insertMarkdown("`", "`")}><Code /></button>
          <button onClick={() => insertMarkdown("# ")}><Heading1 /></button>
          <button onClick={() => insertMarkdown("## ")}><Heading2 /></button>
          <button onClick={() => insertMarkdown("- ")}><List /></button>
          <button onClick={() => insertMarkdown("[text](https://)")}><Link /></button>
          <button onClick={() => insertMarkdown("![alt](https://)")}><ImageIcon /></button>
        </div>

        {/* TABS */}
        <div className="flex border-t">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 py-3 ${activeTab === "editor" ? "border-b-2 border-blue-500" : ""}`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-3 ${activeTab === "preview" ? "border-b-2 border-blue-500" : ""}`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex h-[calc(100vh-320px)]">
        {activeTab === "editor" && (
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 p-6 font-mono resize-none"
          />
        )}

        {activeTab === "preview" && (
          <div className="flex-1 p-6 overflow-auto bg-white dark:bg-slate-950">
            <MarkdownPreview content={markdown} />
          </div>
        )}
      </div>
    </div>
  )
}
