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
import { CategoryManager } from "@/lib/category-manager"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Save,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Strikethrough,
  X,
  AlertTriangle,
  Calendar,
  Undo,
  Redo,
  Copy,
  Scissors,
  ClipboardPaste,
  Search,
  Maximize,
  Minimize,
  User,
  Briefcase,
  BookOpen,
  Lightbulb,
  FolderOpen,
  ShoppingCart,
  Plane,
  Heart,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Star,
  Home,
  Clock,
  MapPin,
  Phone,
  Mail,
  Camera,
  Music,
  Video,
  Coffee,
  Utensils,
  Car,
  Bike,
  Train,
  Bus,
  Ship,
  Rocket,
  Gamepad2,
  Monitor,
  Smartphone,
  Laptop,
  Keyboard,
  Mouse,
  Headphones,
  Speaker,
  Wifi,
  Battery,
  Zap,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  TreePine,
  Flower,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Turtle,
  Apple,
  Pizza,
  IceCream,
  Cookie,
  Cake,
  Gift,
  Crown,
  Diamond,
  Gem,
  Key,
  Lock,
  Shield,
  Tag,
  Bell,
  AlarmClock,
  Timer,
  Calculator,
  Ruler,
  Compass,
  Microscope,
  Telescope,
  Globe,
  Map,
  Mountain,
  Waves,
  Flame,
  Leaf,
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

interface EnhancedNoteEditorProps {
  note: Note
  onSave: (note: { title: string; content: string; category: string; tags: string; images: string[] }) => void
  onClose: () => void
}

// Icon mapping function
const getIconComponent = (iconName: string, className = "h-4 w-4") => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    User,
    Briefcase,
    BookOpen,
    Lightbulb,
    FolderOpen,
    ShoppingCart,
    Plane,
    Heart,
    Circle,
    Square,
    Triangle,
    Hexagon,
    Star,
    Home,
    Calendar,
    Clock,
    MapPin,
    Phone,
    Mail,
    Camera,
    Music,
    Video,
    Coffee,
    Utensils,
    Car,
    Bike,
    Train,
    Bus,
    Ship,
    Rocket,
    Gamepad2,
    Monitor,
    Smartphone,
    Laptop,
    Keyboard,
    Mouse,
    Headphones,
    Speaker,
    Wifi,
    Battery,
    Zap,
    Sun,
    Moon,
    Cloud,
    CloudRain,
    Snowflake,
    TreePine,
    Flower,
    Bug,
    Fish,
    Bird,
    Cat,
    Dog,
    Rabbit,
    Turtle,
    Apple,
    Pizza,
    IceCream,
    Cookie,
    Cake,
    Gift,
    Crown,
    Diamond,
    Gem,
    Key,
    Lock,
    Shield,
    Tag,
    Bell,
    AlarmClock,
    Timer,
    Calculator,
    Ruler,
    Compass,
    Microscope,
    Telescope,
    Globe,
    Map,
    Mountain,
    Waves,
    Flame,
    Leaf,
  }

  const IconComponent = iconMap[iconName] || Circle
  return <IconComponent className={className} />
}

// Enhanced note editor with comprehensive text editing features
export function EnhancedNoteEditor({ note, onSave, onClose }: EnhancedNoteEditorProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const categoryManager = CategoryManager.getInstance()

  const [currentTitle, setCurrentTitle] = useState(note.title)
  const [currentContent, setCurrentContent] = useState(note.content)
  const [currentCategory, setCurrentCategory] = useState(note.category)
  const [currentTags, setCurrentTags] = useState(note.tags)
  const [images, setImages] = useState<string[]>(note.images || [])
  const [categories, setCategories] = useState(categoryManager.getAllCategories())

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [lineCount, setLineCount] = useState(1)
  const [selectedText, setSelectedText] = useState("")
  const [showTitleAlert, setShowTitleAlert] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showLineNumbers, setShowLineNumbers] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [fontFamily, setFontFamily] = useState("Inter")
  const [editorTheme, setEditorTheme] = useState("light")

  // Undo/Redo functionality
  const [history, setHistory] = useState<string[]>([note.content])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Find & Replace
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [findText, setFindText] = useState("")
  const [replaceText, setReplaceText] = useState("")

  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  // Update categories when component mounts
  useEffect(() => {
    setCategories(categoryManager.getAllCategories())
  }, [])

  // Word, character, and line count
  useEffect(() => {
    const words = currentContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const chars = currentContent.length
    const lines = currentContent.split("\n").length
    setWordCount(words)
    setCharCount(chars)
    setLineCount(lines)
  }, [currentContent])

  // Auto-save functionality
  const triggerAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (!currentTitle.trim()) return
      setIsSaving(true)
      setLastSaved(new Date())
      setTimeout(() => setIsSaving(false), 500)
    }, 2000)
  }, [currentTitle])

  // Add to history for undo/redo
  const addToHistory = useCallback(
    (content: string) => {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(content)
      if (newHistory.length > 50) {
        // Limit history to 50 items
        newHistory.shift()
      } else {
        setHistoryIndex(historyIndex + 1)
      }
      setHistory(newHistory)
    },
    [history, historyIndex],
  )

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const previousContent = history[newIndex]
      setCurrentContent(previousContent)
      if (contentRef.current) {
        contentRef.current.value = previousContent
      }
    }
  }, [history, historyIndex])

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const nextContent = history[newIndex]
      setCurrentContent(nextContent)
      if (contentRef.current) {
        contentRef.current.value = nextContent
      }
    }
  }, [history, historyIndex])

  // Enhanced text formatting functions
  const formatText = useCallback(
    (format: string, value?: string) => {
      const textarea = contentRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = textarea.value.substring(start, end)

      let formattedText = ""
      let newCursorPos = start

      switch (format) {
        case "bold":
          formattedText = `**${selectedText || "bold text"}**`
          newCursorPos = start + (selectedText ? formattedText.length : 2)
          break
        case "italic":
          formattedText = `*${selectedText || "italic text"}*`
          newCursorPos = start + (selectedText ? formattedText.length : 1)
          break
        case "underline":
          formattedText = `<u>${selectedText || "underlined text"}</u>`
          break
        case "strikethrough":
          formattedText = `~~${selectedText || "strikethrough text"}~~`
          break
        case "highlight":
          formattedText = `<mark style="background-color: ${value || "#ffff00"}">${selectedText || "highlighted text"}</mark>`
          break
        case "textColor":
          formattedText = `<span style="color: ${value || "#ff0000"}">${selectedText || "colored text"}</span>`
          break
        case "fontSize":
          formattedText = `<span style="font-size: ${value || "18px"}">${selectedText || "sized text"}</span>`
          break
        case "fontFamily":
          formattedText = `<span style="font-family: ${value || "Arial"}">${selectedText || "font text"}</span>`
          break
        case "code":
          formattedText = `\`${selectedText || "code"}\``
          break
        case "codeblock":
          formattedText = `\n\`\`\`${value || ""}\n${selectedText || "code block"}\n\`\`\`\n`
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
        case "h4":
          formattedText = `\n#### ${selectedText || "Heading 4"}\n`
          break
        case "h5":
          formattedText = `\n##### ${selectedText || "Heading 5"}\n`
          break
        case "h6":
          formattedText = `\n###### ${selectedText || "Heading 6"}\n`
          break
        case "quote":
          formattedText = `\n> ${selectedText || "Blockquote"}\n`
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
        case "checkbox-checked":
          formattedText = `\n- [x] ${selectedText || "completed task"}`
          break
        case "link":
          formattedText = `[${selectedText || "link text"}](${value || "url"})`
          break
        case "table":
          formattedText = `\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n`
          break
        case "hr":
          formattedText = `\n---\n`
          break
        case "date":
          formattedText = new Date().toLocaleDateString()
          break
        case "time":
          formattedText = new Date().toLocaleTimeString()
          break
        case "datetime":
          formattedText = new Date().toLocaleString()
          break
        case "superscript":
          formattedText = `<sup>${selectedText || "superscript"}</sup>`
          break
        case "subscript":
          formattedText = `<sub>${selectedText || "subscript"}</sub>`
          break
        case "indent":
          const lines = selectedText.split("\n")
          formattedText = lines.map((line) => `    ${line}`).join("\n")
          break
        case "outdent":
          const outdentLines = selectedText.split("\n")
          formattedText = outdentLines.map((line) => line.replace(/^ {4}/, "")).join("\n")
          break
        case "alignLeft":
          formattedText = `<div style="text-align: left;">${selectedText || "Left aligned text"}</div>`
          break
        case "alignCenter":
          formattedText = `<div style="text-align: center;">${selectedText || "Center aligned text"}</div>`
          break
        case "alignRight":
          formattedText = `<div style="text-align: right;">${selectedText || "Right aligned text"}</div>`
          break
        case "alignJustify":
          formattedText = `<div style="text-align: justify;">${selectedText || "Justified text"}</div>`
          break
        case "uppercase":
          formattedText = selectedText.toUpperCase()
          break
        case "lowercase":
          formattedText = selectedText.toLowerCase()
          break
        case "capitalize":
          formattedText = selectedText.replace(/\b\w/g, (l) => l.toUpperCase())
          break
        case "clearFormat":
          formattedText = selectedText.replace(/\*\*|__|\*|_|~~|`|<[^>]*>/g, "")
          break
        default:
          return
      }

      // Insert formatted text
      const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end)
      textarea.value = newValue
      setCurrentContent(newValue)
      addToHistory(newValue)

      // Set cursor position
      const finalCursorPos = newCursorPos || start + formattedText.length
      textarea.setSelectionRange(finalCursorPos, finalCursorPos)
      textarea.focus()

      triggerAutoSave()
    },
    [triggerAutoSave, addToHistory],
  )

  // Handle text selection
  const handleTextSelection = useCallback(() => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textarea.value.substring(start, end)
    setSelectedText(selected)
  }, [])

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

  // Copy, Cut, Paste functions
  const handleCopy = useCallback(() => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    if (selectedText) {
      navigator.clipboard.writeText(selectedText)
    }
  }, [])

  const handleCut = useCallback(() => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    if (selectedText) {
      navigator.clipboard.writeText(selectedText)
      const newValue = textarea.value.substring(0, start) + textarea.value.substring(end)
      textarea.value = newValue
      setCurrentContent(newValue)
      addToHistory(newValue)
      textarea.setSelectionRange(start, start)
    }
  }, [addToHistory])

  const handlePaste = useCallback(async () => {
    const textarea = contentRef.current
    if (!textarea) return

    try {
      const clipboardText = await navigator.clipboard.readText()
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = textarea.value.substring(0, start) + clipboardText + textarea.value.substring(end)
      textarea.value = newValue
      setCurrentContent(newValue)
      addToHistory(newValue)
      textarea.setSelectionRange(start + clipboardText.length, start + clipboardText.length)
    } catch (error) {
      console.error("Failed to paste:", error)
    }
  }, [addToHistory])

  // Find and Replace functionality
  const handleFind = useCallback(() => {
    if (!findText) return

    const textarea = contentRef.current
    if (!textarea) return

    const content = textarea.value
    const index = content.toLowerCase().indexOf(findText.toLowerCase())

    if (index !== -1) {
      textarea.setSelectionRange(index, index + findText.length)
      textarea.focus()
    }
  }, [findText])

  const handleReplace = useCallback(() => {
    if (!findText || !replaceText) return

    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    if (selectedText.toLowerCase() === findText.toLowerCase()) {
      const newValue = textarea.value.substring(0, start) + replaceText + textarea.value.substring(end)
      textarea.value = newValue
      setCurrentContent(newValue)
      addToHistory(newValue)
      textarea.setSelectionRange(start + replaceText.length, start + replaceText.length)
    }
  }, [findText, replaceText, addToHistory])

  const handleReplaceAll = useCallback(() => {
    if (!findText || !replaceText) return

    const textarea = contentRef.current
    if (!textarea) return

    const newValue = textarea.value.replace(new RegExp(findText, "gi"), replaceText)
    textarea.value = newValue
    setCurrentContent(newValue)
    addToHistory(newValue)
  }, [findText, replaceText, addToHistory])

  // Handle save
  const handleSave = useCallback(() => {
    if (!currentTitle.trim()) {
      setShowTitleAlert(true)
      return
    }

    const updatedNote = {
      title: currentTitle,
      content: currentContent,
      category: currentCategory,
      tags: currentTags,
      images: images,
    }

    onSave(updatedNote)
    setLastSaved(new Date())
  }, [currentTitle, currentContent, currentCategory, currentTags, images, onSave])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault()
            handleSave()
            break
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              handleRedo()
            } else {
              handleUndo()
            }
            break
          case "y":
            e.preventDefault()
            handleRedo()
            break
          case "f":
            e.preventDefault()
            setShowFindReplace(true)
            break
          case "b":
            e.preventDefault()
            formatText("bold")
            break
          case "i":
            e.preventDefault()
            formatText("italic")
            break
          case "u":
            e.preventDefault()
            formatText("underline")
            break
          case "k":
            e.preventDefault()
            const url = prompt("Enter URL:")
            if (url) formatText("link", url)
            break
          case "c":
            if (!e.shiftKey) break
            e.preventDefault()
            handleCopy()
            break
          case "x":
            e.preventDefault()
            handleCut()
            break
          case "v":
            e.preventDefault()
            handlePaste()
            break
        }
      }

      if (e.key === "F11") {
        e.preventDefault()
        setIsFullscreen(!isFullscreen)
      }

      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false)
        }
        if (showFindReplace) {
          setShowFindReplace(false)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [
    handleSave,
    handleUndo,
    handleRedo,
    formatText,
    handleCopy,
    handleCut,
    handlePaste,
    isFullscreen,
    showFindReplace,
  ])

  // Render markdown preview
  const renderPreview = useCallback((content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
      .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
      .replace(/^#### (.*?)$/gm, "<h4>$1</h4>")
      .replace(/^##### (.*?)$/gm, "<h5>$1</h5>")
      .replace(/^###### (.*?)$/gm, "<h6>$1</h6>")
      .replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>")
      .replace(/^- (.*?)$/gm, "<li>$1</li>")
      .replace(/^\d+\. (.*?)$/gm, "<li>$1</li>")
      .replace(/^- \[ \] (.*?)$/gm, "<input type='checkbox' disabled> $1")
      .replace(/^- \[x\] (.*?)$/gm, "<input type='checkbox' checked disabled> $1")
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, "<a href='$2' target='_blank'>$1</a>")
      .replace(/^---$/gm, "<hr>")
      .replace(/\n/g, "<br>")
  }, [])

  const editorStyle = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
    backgroundColor: editorTheme === "dark" ? "#1a1a1a" : editorTheme === "sepia" ? "#f4f1ea" : "#ffffff",
    color: editorTheme === "dark" ? "#ffffff" : editorTheme === "sepia" ? "#5c4b37" : "#000000",
  }

  return (
    <TooltipProvider>
      <div className={`flex flex-col h-full ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
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

        {/* Find & Replace Dialog */}
        <Dialog open={showFindReplace} onOpenChange={setShowFindReplace}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Find & Replace</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="findText">Find</Label>
                <Input
                  id="findText"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder="Enter text to find..."
                />
              </div>
              <div>
                <Label htmlFor="replaceText">Replace with</Label>
                <Input
                  id="replaceText"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Enter replacement text..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleFind} variant="outline" className="flex-1 bg-transparent">
                  Find Next
                </Button>
                <Button onClick={handleReplace} variant="outline" className="flex-1 bg-transparent">
                  Replace
                </Button>
                <Button onClick={handleReplaceAll} variant="outline" className="flex-1 bg-transparent">
                  Replace All
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <div className="border-b p-2 md:p-4 flex-shrink-0 bg-background">
          <div className="flex items-center justify-between mb-2 md:mb-4 gap-2">
            <h2 className="text-base md:text-xl font-semibold truncate">{note.id ? "Edit Note" : "Create New Note"}</h2>
            <div className="flex items-center gap-1">
              {isSaving && <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">Saving...</span>}
              {lastSaved && !isSaving && (
                <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                variant="ghost"
                size="icon"
                className="h-7 w-7 md:h-9 md:w-9"
              >
                {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
              </Button>
              <Button onClick={handleSave} size="sm" className="h-7 md:h-9 px-2 md:px-3">
                <Save className="h-3.5 w-3.5 md:mr-1" />
                <span className="hidden sm:inline text-xs md:text-sm">Save</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 md:h-9 md:w-9">
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <div>
              <Label htmlFor="title" className="text-xs md:text-sm">
                Title
              </Label>
              <Input
                ref={titleRef}
                id="title"
                value={currentTitle}
                placeholder="Enter note title..."
                className="text-sm md:text-base font-semibold h-9 md:h-10"
                onChange={handleTitleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="category" className="text-xs md:text-sm">
                  Category
                </Label>
                <Select value={currentCategory} onValueChange={setCurrentCategory}>
                  <SelectTrigger className="h-9 md:h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center gap-2">
                          <div style={{ color: category.color }}>{getIconComponent(category.icon, "h-4 w-4")}</div>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags" className="text-xs md:text-sm">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={currentTags}
                  onChange={(e) => setCurrentTags(e.target.value)}
                  placeholder="tag1, tag2"
                  className="h-9 md:h-10 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground flex-wrap">
            <span>Words: {wordCount}</span>
            <span>Chars: {charCount}</span>
            <span className="hidden sm:inline">Lines: {lineCount}</span>
            {selectedText && <span className="hidden md:inline text-xs">Sel: {selectedText.length}</span>}
            <span className="hidden sm:inline">~{Math.ceil(wordCount / 200)}m</span>
          </div>
        </div>

        {/* Content Editor with Tabs */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="edit" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mx-1 md:mx-4 mt-1 md:mt-3 h-9 md:h-10 text-xs md:text-base">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="flex-1 overflow-hidden m-0">
              <div className="h-full flex flex-col">
                <ScrollArea className="border-b flex-shrink-0" orientation="horizontal">
                  <div className="p-1 bg-card">
                    <div className="flex gap-0.5 min-w-max">
                      {/* File Operations */}
                      <div className="flex gap-0.5 pr-1 border-r">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleUndo}
                              className="h-8 w-8 p-0"
                              disabled={historyIndex <= 0}
                            >
                              <Undo className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Undo</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleRedo}
                              className="h-8 w-8 p-0"
                              disabled={historyIndex >= history.length - 1}
                            >
                              <Redo className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Redo</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowFindReplace(true)}
                              className="h-8 w-8 p-0"
                            >
                              <Search className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Find</TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Clipboard Operations */}
                      <div className="flex gap-0.5 pr-1 border-r">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Copy</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={handleCut} className="h-8 w-8 p-0">
                              <Scissors className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Cut</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={handlePaste} className="h-8 w-8 p-0">
                              <ClipboardPaste className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Paste</TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Text Formatting */}
                      <div className="flex gap-0.5 pr-1 border-r">
                        {[
                          { format: "bold", icon: Bold, tooltip: "Bold" },
                          { format: "italic", icon: Italic, tooltip: "Italic" },
                          { format: "underline", icon: Underline, tooltip: "Underline" },
                          { format: "strikethrough", icon: Strikethrough, tooltip: "Strike" },
                        ].map(({ format, icon: Icon, tooltip }) => (
                          <Tooltip key={format}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText(format)}
                                className="h-8 w-8 p-0"
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">{tooltip}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>

                      {/* Headings */}
                      <div className="flex gap-0.5 pr-1 border-r">
                        {[
                          { format: "h1", icon: Heading1, tooltip: "H1" },
                          { format: "h2", icon: Heading2, tooltip: "H2" },
                          { format: "h3", icon: Heading3, tooltip: "H3" },
                        ].map(({ format, icon: Icon, tooltip }) => (
                          <Tooltip key={format}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText(format)}
                                className="h-8 w-8 p-0"
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">{tooltip}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>

                      {/* Lists */}
                      <div className="flex gap-0.5 pr-1 border-r">
                        {[
                          { format: "list", icon: List, tooltip: "List" },
                          { format: "numbered", icon: ListOrdered, tooltip: "Numbered" },
                          { format: "checkbox", icon: CheckSquare, tooltip: "Checkbox" },
                        ].map(({ format, icon: Icon, tooltip }) => (
                          <Tooltip key={format}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText(format)}
                                className="h-8 w-8 p-0"
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">{tooltip}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>

                      {/* More Options - Hidden on very small screens */}
                      <div className="hidden sm:flex gap-0.5 pr-1 border-r">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => formatText("code")}
                              className="h-8 w-8 p-0"
                            >
                              <Code className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Code</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => formatText("quote")}
                              className="h-8 w-8 p-0"
                            >
                              <Quote className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Quote</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const url = prompt("Enter URL:")
                                if (url) formatText("link", url)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Link className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Link</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                {/* Text Editor */}
                <ScrollArea className="flex-1">
                  <textarea
                    ref={contentRef}
                    value={currentContent}
                    onChange={handleContentChange}
                    onSelect={handleTextSelection}
                    placeholder="Start writing your note..."
                    className="w-full h-full min-h-[300px] md:min-h-[400px] p-4 md:p-6 resize-none focus:outline-none text-sm"
                    style={editorStyle}
                  />
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-4 md:p-6">
                  <div className="max-w-none">
                    <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-gray-100">
                      {currentTitle || "Untitled"}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                      <Badge className="bg-primary/10 text-primary text-xs md:text-sm">{currentCategory}</Badge>
                      {currentTags.split(",").map(
                        (tag, index) =>
                          tag.trim() && (
                            <Badge key={index} variant="outline" className="text-xs md:text-sm">
                              {tag.trim()}
                            </Badge>
                          ),
                      )}
                    </div>
                    <div
                      className="prose prose-lg dark:prose-invert max-w-none text-sm md:text-base"
                      dangerouslySetInnerHTML={{
                        __html: renderPreview(currentContent || "No content"),
                      }}
                    />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  )
}
