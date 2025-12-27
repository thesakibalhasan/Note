"use client"

import type React from "react"
import { useRef, useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { uploadImage } from "@/lib/firebase-service"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  ImageIcon,
  Link,
  Save,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Strikethrough,
  Superscript,
  Subscript,
  Table,
  X,
  Loader2,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  Highlighter,
  Eraser,
  AlertTriangle,
} from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string
  images: string[]
  password?: string
  isPasswordProtected?: boolean
}

interface OptimizedNoteEditorProps {
  note: Note
  onSave: (note: Note) => void
  onClose: () => void
  categories: string[]
}

// Ultra-optimized note editor with zero lag typing
export function OptimizedNoteEditor({ note, onSave, onClose, categories }: OptimizedNoteEditorProps) {
  // Use both refs AND state to prevent data loss
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const categoryRef = useRef(note.category)
  const tagsRef = useRef(note.tags)
  const imagesRef = useRef<string[]>(note.images || [])

  // Add state to backup the content
  const [currentTitle, setCurrentTitle] = useState(note.title)
  const [currentContent, setCurrentContent] = useState(note.content)
  const [currentCategory, setCurrentCategory] = useState(note.category)
  const [currentTags, setCurrentTags] = useState(note.tags)

  // Only track save state, not content
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [images, setImages] = useState<string[]>(note.images || [])
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false) // Disable auto-save initially
  const [isInitialized, setIsInitialized] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Custom alert dialog state
  const [showTitleAlert, setShowTitleAlert] = useState(false)

  // Auto-save timer
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form values ONLY ONCE
  useEffect(() => {
    if (!isInitialized) {
      if (titleRef.current) {
        titleRef.current.value = note.title
        setCurrentTitle(note.title)
      }
      if (contentRef.current) {
        contentRef.current.value = note.content
        setCurrentContent(note.content)
      }
      categoryRef.current = note.category
      tagsRef.current = note.tags
      imagesRef.current = note.images || []
      setCurrentCategory(note.category)
      setCurrentTags(note.tags)
      setImages(note.images || [])
      setIsInitialized(true)

      // Enable auto-save after 5 seconds of opening the editor
      const timer = setTimeout(() => {
        setIsAutoSaveEnabled(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [note, isInitialized])

  // Sync ref values with state when switching tabs
  const syncValues = useCallback(() => {
    if (titleRef.current) {
      setCurrentTitle(titleRef.current.value)
    }
    if (contentRef.current) {
      setCurrentContent(contentRef.current.value)
    }
  }, [])

  // Update refs when state changes (for preview)
  useEffect(() => {
    if (titleRef.current && titleRef.current.value !== currentTitle) {
      titleRef.current.value = currentTitle
    }
  }, [currentTitle])

  useEffect(() => {
    if (contentRef.current && contentRef.current.value !== currentContent) {
      contentRef.current.value = currentContent
    }
  }, [currentContent])

  // Ultra-fast auto-save with debouncing
  const triggerAutoSave = useCallback(() => {
    // Skip auto-save if it's not enabled yet
    if (!isAutoSaveEnabled) return

    // Sync current values
    syncValues()

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      // Don't save if title is empty
      if (!currentTitle.trim()) return

      const currentNote: Note = {
        ...note,
        title: currentTitle,
        content: currentContent,
        category: categoryRef.current,
        tags: tagsRef.current,
        images: imagesRef.current,
      }

      setIsSaving(true)
      setLastSaved(new Date())

      // Reset saving state after a short delay
      setTimeout(() => setIsSaving(false), 500)
    }, 2000) // Auto-save after 2 seconds of inactivity
  }, [note, isAutoSaveEnabled, currentTitle, currentContent, syncValues])

  // Handle content change
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value
      setCurrentContent(newContent)
      triggerAutoSave()
    },
    [triggerAutoSave],
  )

  // Handle title change
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value
      setCurrentTitle(newTitle)
      triggerAutoSave()
    },
    [triggerAutoSave],
  )

  // Ultra-fast text formatting with direct DOM manipulation
  const formatText = useCallback(
    (format: string) => {
      const textarea = contentRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = textarea.value.substring(start, end)

      let formattedText = ""

      switch (format) {
        case "bold":
          formattedText = `**${selectedText || "bold text"}**`
          break
        case "italic":
          formattedText = `*${selectedText || "italic text"}*`
          break
        case "underline":
          formattedText = `<u>${selectedText || "underlined text"}</u>`
          break
        case "strikethrough":
          formattedText = `~~${selectedText || "strikethrough text"}~~`
          break
        case "list":
          formattedText = `\n- ${selectedText || "list item"}`
          break
        case "numbered":
          formattedText = `\n1. ${selectedText || "numbered item"}`
          break
        case "checkbox":
          formattedText = `\n- [ ] ${selectedText || "task item"}`
          break
        case "link":
          formattedText = `[${selectedText || "link text"}](https://example.com)`
          break
        case "h1":
          formattedText = `\n# ${selectedText || "Heading 1"}\n`
          break
        case "h2":
          formattedText = `\n## ${selectedText || "Heading 2"}\n`
          break
        case "h3":
          formattedText = `\n### ${selectedText || "Heading 3"}\n`
          break
        case "quote":
          formattedText = `\n> ${selectedText || "Blockquote"}\n`
          break
        case "code":
          formattedText = `\`${selectedText || "code"}\``
          break
        case "codeblock":
          formattedText = `\n\`\`\`\n${selectedText || "code block"}\n\`\`\`\n`
          break
        case "table":
          formattedText = `\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n`
          break
        case "superscript":
          formattedText = `<sup>${selectedText || "superscript"}</sup>`
          break
        case "subscript":
          formattedText = `<sub>${selectedText || "subscript"}</sub>`
          break
        case "hr":
          formattedText = `\n---\n`
          break
        case "alignLeft":
          formattedText = `\n<div style="text-align: left;">${selectedText || "Left aligned text"}</div>\n`
          break
        case "alignCenter":
          formattedText = `\n<div style="text-align: center;">${selectedText || "Center aligned text"}</div>\n`
          break
        case "alignRight":
          formattedText = `\n<div style="text-align: right;">${selectedText || "Right aligned text"}</div>\n`
          break
        case "fontSize":
          formattedText = `<span style="font-size: 18px;">${selectedText || "sized text"}</span>`
          break
        case "textColor":
          formattedText = `<span style="color: #ff0000;">${selectedText || "colored text"}</span>`
          break
        case "highlight":
          formattedText = `<mark style="background-color: #ffff00;">${selectedText || "highlighted text"}</mark>`
          break
        case "clearFormat":
          // Remove common formatting from selected text
          formattedText = selectedText.replace(/\*\*|__|\*|_|~~|`|<[^>]*>/g, "")
          break
      }

      // Direct DOM manipulation for instant response
      const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end)
      textarea.value = newValue
      setCurrentContent(newValue)

      // Set cursor position
      const newPosition = start + formattedText.length
      textarea.setSelectionRange(newPosition, newPosition)
      textarea.focus()

      // Trigger auto-save
      triggerAutoSave()
    },
    [triggerAutoSave],
  )

  // Handle image upload with Firebase Storage
  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files) return

      setIsUploadingImage(true)

      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          try {
            const imageUrl = await uploadImage(file)
            return imageUrl
          } catch (error) {
            console.error("Error uploading image:", error)
            return null
          }
        })

        const uploadedUrls = await Promise.all(uploadPromises)
        const validUrls = uploadedUrls.filter((url) => url !== null) as string[]

        if (validUrls.length > 0) {
          imagesRef.current = [...imagesRef.current, ...validUrls]
          setImages([...imagesRef.current])
          triggerAutoSave()
        }
      } catch (error) {
        console.error("Error uploading images:", error)
      } finally {
        setIsUploadingImage(false)
        // Reset file input
        if (event.target) {
          event.target.value = ""
        }
      }
    },
    [triggerAutoSave],
  )

  // Remove image
  const removeImage = useCallback(
    (index: number) => {
      imagesRef.current = imagesRef.current.filter((_, i) => i !== index)
      setImages([...imagesRef.current])
      triggerAutoSave()
    },
    [triggerAutoSave],
  )

  // Manual save - only this should close the editor
  const handleSave = useCallback(() => {
    // Sync current values before saving
    syncValues()

    // Don't save if title is empty - show custom dialog instead of alert
    if (!currentTitle.trim()) {
      setShowTitleAlert(true)
      return
    }

    const currentNote: Note = {
      ...note,
      title: currentTitle,
      content: currentContent,
      category: categoryRef.current,
      tags: tagsRef.current,
      images: imagesRef.current,
      password: note.password || "",
      isPasswordProtected: note.isPasswordProtected || false,
    }

    onSave(currentNote)
    setLastSaved(new Date())
  }, [note, onSave, currentTitle, currentContent, syncValues])

  // Handle category change
  const handleCategoryChange = useCallback(
    (value: string) => {
      categoryRef.current = value
      setCurrentCategory(value)
      triggerAutoSave()
    },
    [triggerAutoSave],
  )

  // Handle tags change
  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTags = e.target.value
      tagsRef.current = newTags
      setCurrentTags(newTags)
      triggerAutoSave()
    },
    [triggerAutoSave],
  )

  // Render note content with markdown
  const renderNoteContent = useCallback((content: string) => {
    let processedContent = content
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic text
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Strikethrough
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      // Links - Fixed regex
      .replace(
        /\[(.*?)\]$$(.*?)$$/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">$1</a>',
      )
      // Horizontal rule
      .replace(/^\s*---\s*$/gm, "<hr class='my-4 border-t-2 border-gray-300 dark:border-gray-700' />")
      // Headings
      .replace(/^# (.*?)$/gm, "<h1 class='text-3xl font-bold my-6 text-gray-900 dark:text-gray-100'>$1</h1>")
      .replace(/^## (.*?)$/gm, "<h2 class='text-2xl font-bold my-5 text-gray-900 dark:text-gray-100'>$1</h2>")
      .replace(/^### (.*?)$/gm, "<h3 class='text-xl font-bold my-4 text-gray-900 dark:text-gray-100'>$1</h3>")
      // Blockquotes
      .replace(
        /^> (.*?)$/gm,
        "<blockquote class='border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 py-2 rounded-r'>$1</blockquote>",
      )
      // Inline code
      .replace(
        /`([^`]+)`/g,
        "<code class='bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400'>$1</code>",
      )
      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        "<pre class='bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto my-4 border border-gray-200 dark:border-gray-700'><code class='text-sm font-mono text-gray-800 dark:text-gray-200'>$1</code></pre>",
      )
      // Checkboxes
      .replace(
        /^- \[ \] (.*?)$/gm,
        "<div class='flex items-start gap-2 my-2'><input type='checkbox' disabled class='mt-1' /><span class='text-gray-700 dark:text-gray-300'>$1</span></div>",
      )
      .replace(
        /^- \[x\] (.*?)$/gm,
        "<div class='flex items-start gap-2 my-2'><input type='checkbox' checked disabled class='mt-1' /><span class='text-gray-700 dark:text-gray-300 line-through'>$1</span></div>",
      )
      // Bullet lists
      .replace(/^- (.*?)$/gm, "<li class='ml-6 list-disc my-1 text-gray-700 dark:text-gray-300'>$1</li>")
      // Numbered lists
      .replace(/^[0-9]+\. (.*?)$/gm, "<li class='ml-6 list-decimal my-1 text-gray-700 dark:text-gray-300'>$1</li>")

    // Handle tables
    const tableRegex = /\|(.+)\|\n\|(.+)\|\n((?:\|.+\|\n?)*)/g
    processedContent = processedContent.replace(tableRegex, (match, header, separator, rows) => {
      const headerCells = header
        .split("|")
        .map((cell: string) => cell.trim())
        .filter((cell: string) => cell)
        .map(
          (cell: string) =>
            `<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100">${cell}</th>`,
        )
        .join("")

      const rowCells = rows
        .trim()
        .split("\n")
        .map((row: string) => {
          const cells = row
            .split("|")
            .map((cell: string) => cell.trim())
            .filter((cell: string) => cell)
            .map(
              (cell: string) =>
                `<td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">${cell}</td>`,
            )
            .join("")
          return `<tr>${cells}</tr>`
        })
        .join("")

      return `<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"><thead><tr>${headerCells}</tr></thead><tbody>${rowCells}</tbody></table></div>`
    })

    // Convert line breaks
    processedContent = processedContent.replace(/\n/g, "<br>")

    return processedContent
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Custom Title Alert Dialog */}
        <Dialog open={showTitleAlert} onOpenChange={setShowTitleAlert}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Title Required
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">
                Please enter a title for your note before saving. The title helps you identify and organize your notes.
              </p>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setShowTitleAlert(false)
                  titleRef.current?.focus()
                }}
                className="w-full"
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <div className="border-b p-4 flex-shrink-0 bg-background sticky top-0 z-40">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{note.id ? "Edit Note" : "Create New Note"}</h2>
            <div className="flex items-center gap-2">
              {isSaving && <span className="text-sm text-muted-foreground">Saving...</span>}
              {lastSaved && !isSaving && (
                <span className="text-sm text-muted-foreground">Saved {lastSaved.toLocaleTimeString()}</span>
              )}
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="w-full lg:col-span-2 ">
  <div className="w-full">
  <Label
    htmlFor="title"
    className="text-xs sm:text-sm md:text-base"
  >
    Title
  </Label>

  <Input
    ref={titleRef}
    id="title"
    value={currentTitle}
    placeholder="Enter note title..."
    onChange={handleTitleChange}
    className="
      w-full
      text-sm sm:text-base md:text-lg
      font-semibold
      h-8 sm:h-9 md:h-11
      px-2 sm:px-3
    "
  />
</div>

            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="category">Categorys</Label>
                <Select value={currentCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" value={currentTags} onChange={handleTagsChange} placeholder="tag1, tag2" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Editor with Tabs */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="edit" className="h-full flex flex-col" onValueChange={syncValues}>
            <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="flex-1 overflow-hidden m-0">
              <div className="h-full flex flex-col">
                {/* Toolbar */}
                <div className="border-b p-2 bg-card flex-shrink-0">
                  <div className="flex flex-wrap gap-1">
                    {[
                      { format: "bold", icon: Bold, tooltip: "Bold" },
                      { format: "italic", icon: Italic, tooltip: "Italic" },
                      { format: "underline", icon: Underline, tooltip: "Underline" },
                      { format: "strikethrough", icon: Strikethrough, tooltip: "Strikethrough" },
                      { format: "h1", icon: Heading1, tooltip: "Heading 1" },
                      { format: "h2", icon: Heading2, tooltip: "Heading 2" },
                      { format: "h3", icon: Heading3, tooltip: "Heading 3" },
                      { format: "list", icon: List, tooltip: "Bullet List" },
                      { format: "numbered", icon: ListOrdered, tooltip: "Numbered List" },
                      { format: "checkbox", icon: CheckSquare, tooltip: "Checkbox" },
                      { format: "quote", icon: Quote, tooltip: "Quote" },
                      { format: "code", icon: Code, tooltip: "Inline Code" },
                      { format: "link", icon: Link, tooltip: "Link" },
                      { format: "table", icon: Table, tooltip: "Table" },
                      { format: "superscript", icon: Superscript, tooltip: "Superscript" },
                      { format: "subscript", icon: Subscript, tooltip: "Subscript" },
                      // { format: "hr", icon: Minus, tooltip: "Horizontal Line" },
                      { format: "alignLeft", icon: AlignLeft, tooltip: "Align Left" },
                      { format: "alignCenter", icon: AlignCenter, tooltip: "Align Center" },
                      { format: "alignRight", icon: AlignRight, tooltip: "Align Right" },
                      { format: "fontSize", icon: Type, tooltip: "Font Size" },
                      { format: "textColor", icon: Palette, tooltip: "Text Color" },
                      { format: "highlight", icon: Highlighter, tooltip: "Highlight" },
                      { format: "clearFormat", icon: Eraser, tooltip: "Clear Formatting" },
                    ].map(({ format, icon: Icon, tooltip }) => (
                      <Tooltip key={format}>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => formatText(format)} className="h-8 w-8 p-0">
                            <Icon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{tooltip}</TooltipContent>
                      </Tooltip>
                    ))}

                    {/* <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-8 w-8 p-0"
                          disabled={isUploadingImage}
                        >
                          {isUploadingImage ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ImageIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{isUploadingImage ? "Uploading..." : "Add Image"}</TooltipContent>
                    </Tooltip> */}
                  </div>
                </div>

                {/* Content Editor */}
                <div className="flex-1 p-4">
                  <textarea
                    ref={contentRef}
                    value={currentContent}
                    onChange={handleContentChange}
                    placeholder="Write your note here... Use **bold**, *italic*, ## headings, - lists, [link text](url)"
                    className="w-full h-full resize-none border-0 outline-none bg-transparent text-foreground placeholder:text-muted-foreground font-mono text-sm leading-relaxed"
                    style={
                      {
                        // Maximum performance settings
                      }
                    }
                    autoCorrect="off"
                    autoCapitalize="off"
                    autoComplete="off"
                    spellCheck={false}
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                  />
                </div>

                {/* Display uploaded images */}
                {images.length > 0 && (
                  <div className="p-4 border-t">
                    <Label className="mb-2 block">Images</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <div className="max-w-none">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                      {currentTitle || "Untitled"}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge className="bg-primary/10 text-primary">{currentCategory}</Badge>
                      {currentTags.split(",").map(
                        (tag, index) =>
                          tag.trim() && (
                            <Badge key={index} variant="outline">
                              {tag.trim()}
                            </Badge>
                          ),
                      )}
                    </div>
                    <div
                      className="prose prose-lg dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: renderNoteContent(currentContent || "No content"),
                      }}
                    />
                    {images.length > 0 && (
                      <div className="mt-8 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Images</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {images.map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`Image ${index + 1}`}
                              className="max-w-full h-auto rounded-lg border shadow-sm"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </TooltipProvider>
  )
}
