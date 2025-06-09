"use client"

import React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { OptimizedNoteEditor } from "@/components/optimized-note-editor"
import { subscribeToNotes, addNote, updateNote, deleteNote, type FirebaseNote } from "@/lib/firebase-service"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Tag,
  Calendar,
  Moon,
  Sun,
  BookOpen,
  Star,
  Archive,
  Home,
  Menu,
  Trash,
  FileText,
  RotateCcw,
  Filter,
  ImageIcon,
  Loader2,
  Users,
  Globe,
} from "lucide-react"
import { useTheme } from "next-themes"

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  isPinned: boolean
  isArchived: boolean
  isTrashed: boolean
  images: string[]
}

const categories = ["Personal", "Work", "Study", "Ideas", "Projects", "Shopping", "Travel", "Health"]

// Convert Firebase note to local note format
const convertFirebaseNote = (firebaseNote: FirebaseNote): Note => ({
  id: firebaseNote.id || "",
  title: firebaseNote.title,
  content: firebaseNote.content,
  category: firebaseNote.category,
  tags: firebaseNote.tags,
  createdAt: firebaseNote.createdAt instanceof Date ? firebaseNote.createdAt.toISOString() : new Date().toISOString(),
  updatedAt: firebaseNote.updatedAt instanceof Date ? firebaseNote.updatedAt.toISOString() : new Date().toISOString(),
  isPinned: firebaseNote.isPinned,
  isArchived: firebaseNote.isArchived,
  isTrashed: firebaseNote.isTrashed,
  images: firebaseNote.images,
})

// Memoized Note Card Component for better performance
const MemoizedNoteCard = React.memo(
  ({
    note,
    onView,
    onEdit,
    onPin,
    onArchive,
    onTrash,
    onRestore,
    onDelete,
  }: {
    note: Note
    onView: (note: Note) => void
    onEdit: (note: Note) => void
    onPin: (id: string) => void
    onArchive: (id: string) => void
    onTrash: (id: string) => void
    onRestore: (id: string) => void
    onDelete: (id: string) => void
  }) => (
    <Card
      className={`relative cursor-pointer hover:shadow-lg transition-all duration-200 group ${
        note.isPinned ? "ring-2 ring-primary" : ""
      } ${note.isTrashed ? "opacity-75" : ""}`}
      onClick={() => onView(note)}
    >
      {note.isPinned && <Star className="absolute top-2 right-2 h-4 w-4 text-primary fill-primary" />}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base sm:text-lg line-clamp-2 pr-8">{note.title}</CardTitle>
          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!note.isTrashed && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPin(note.id)
                      }}
                    >
                      <Star className={`h-3 w-3 ${note.isPinned ? "fill-primary text-primary" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{note.isPinned ? "Unpin note" : "Pin note"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(note)
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit note</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        onArchive(note.id)
                      }}
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{note.isArchived ? "Unarchive note" : "Archive note"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        onTrash(note.id)
                      }}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Move to trash</TooltipContent>
                </Tooltip>
              </>
            )}

            {note.isTrashed && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-green-600 hover:text-green-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRestore(note.id)
                      }}
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Restore note</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(note.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete permanently</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs">
            {note.category}
          </Badge>
          <Calendar className="h-3 w-3" />
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{note.content || "No content"}</p>

        {note.images && note.images.length > 0 && (
          <div className="flex gap-1 mb-3">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{note.images.length} image(s)</span>
          </div>
        )}

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  ),
)

MemoizedNoteCard.displayName = "MemoizedNoteCard"

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"date" | "title" | "category">("date")
  const [activeSection, setActiveSection] = useState<"home" | "archive" | "trash">("home")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Subscribe to Firebase notes
  useEffect(() => {
    const unsubscribe = subscribeToNotes((firebaseNotes) => {
      const convertedNotes = firebaseNotes.map(convertFirebaseNote)
      setNotes(convertedNotes)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Authentication
  const getCurrentTimePassword = useCallback(() => {
    const now = new Date()
    let hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? "pm" : "am"
    hours = hours % 12
    hours = hours ? hours : 12
    const timeStr = `${hours}${minutes.toString().padStart(2, "0")}${ampm}`
    return timeStr
  }, [])

  const handlePasswordSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const correctPassword = getCurrentTimePassword()
      if (password === correctPassword) {
        setIsAuthenticated(true)
        setPasswordError("")
      } else {
        setPasswordError(`Wrong password!`)
        setPassword("")
      }
    },
    [password, getCurrentTimePassword],
  )

  // Note operations with Firebase
  const handleSaveNote = useCallback(
    async (noteData: { title: string; content: string; category: string; tags: string; images: string[] }) => {
      if (!noteData.title.trim()) return

      try {
        const noteToSave = {
          title: noteData.title,
          content: noteData.content,
          category: noteData.category,
          tags: noteData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          isPinned: editingNote?.isPinned || false,
          isArchived: editingNote?.isArchived || false,
          isTrashed: editingNote?.isTrashed || false,
          images: noteData.images,
        }

        if (editingNote) {
          await updateNote(editingNote.id, noteToSave)
        } else {
          await addNote(noteToSave)
        }

        setIsDialogOpen(false)
        setEditingNote(null)
      } catch (error) {
        console.error("Error saving note:", error)
        alert("Error saving note. Please try again.")
      }
    },
    [editingNote],
  )

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note)
    setIsDialogOpen(true)
    setIsViewDialogOpen(false)
  }, [])

  const handleViewNote = useCallback((note: Note) => {
    setViewingNote(note)
    setIsViewDialogOpen(true)
  }, [])

  const handleNewNote = useCallback(() => {
    setEditingNote(null)
    setIsDialogOpen(true)
  }, [])

  const handleCloseEditor = useCallback(() => {
    setIsDialogOpen(false)
    setEditingNote(null)
  }, [])

  const handleDeleteNote = useCallback(async (id: string) => {
    try {
      await deleteNote(id)
      setIsViewDialogOpen(false)
    } catch (error) {
      console.error("Error deleting note:", error)
      alert("Error deleting note. Please try again.")
    }
  }, [])

  const handlePinNote = useCallback(
    async (id: string) => {
      try {
        const note = notes.find((n) => n.id === id)
        if (note) {
          await updateNote(id, { isPinned: !note.isPinned })
        }
      } catch (error) {
        console.error("Error updating note:", error)
      }
    },
    [notes],
  )

  const handleArchiveNote = useCallback(
    async (id: string) => {
      try {
        const note = notes.find((n) => n.id === id)
        if (note) {
          await updateNote(id, {
            isArchived: !note.isArchived,
            isTrashed: false,
            isPinned: false,
          })
        }
        setIsViewDialogOpen(false)
      } catch (error) {
        console.error("Error updating note:", error)
      }
    },
    [notes],
  )

  const handleTrashNote = useCallback(
    async (id: string) => {
      try {
        const note = notes.find((n) => n.id === id)
        if (note) {
          await updateNote(id, {
            isTrashed: !note.isTrashed,
            isArchived: false,
            isPinned: false,
          })
        }
        setIsViewDialogOpen(false)
      } catch (error) {
        console.error("Error updating note:", error)
      }
    },
    [notes],
  )

  const handleRestoreNote = useCallback(async (id: string) => {
    try {
      await updateNote(id, { isTrashed: false, isArchived: false })
    } catch (error) {
      console.error("Error restoring note:", error)
    }
  }, [])

  // Optimized filtered notes with useMemo
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesSearch =
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesCategory = selectedCategory === "all" || note.category === selectedCategory

        if (activeSection === "home") {
          return matchesSearch && matchesCategory && !note.isArchived && !note.isTrashed
        } else if (activeSection === "archive") {
          return matchesSearch && matchesCategory && note.isArchived && !note.isTrashed
        } else {
          return matchesSearch && matchesCategory && note.isTrashed
        }
      })
      .sort((a, b) => {
        if (activeSection === "home") {
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
        }

        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title)
          case "category":
            return a.category.localeCompare(b.category)
          default:
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        }
      })
  }, [notes, searchTerm, selectedCategory, activeSection, sortBy])

  // Render note content with markdown - memoized for performance
  const renderNoteContent = useMemo(() => {
    return (content: string) => {
      let processedContent = content
        // Bold text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Italic text
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        // Strikethrough
        .replace(/~~(.*?)~~/g, "<del>$1</del>")
        // Links
        .replace(
          /\[(.*?)\]$$(.*?)$$/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">$1</a>',
        )
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
    }
  }, [])

  const getSectionTitle = useCallback(() => {
    switch (activeSection) {
      case "home":
        return "Shared Notes"
      case "archive":
        return "Archived Notes"
      case "trash":
        return "Trash"
    }
  }, [activeSection])

  const getEmptyStateMessage = useCallback(() => {
    if (searchTerm || selectedCategory !== "all") {
      return "Try adjusting your search or filters"
    }

    switch (activeSection) {
      case "home":
        return "Create your first note to get started"
      case "archive":
        return "No archived notes found"
      case "trash":
        return "Trash is empty"
    }
  }, [searchTerm, selectedCategory, activeSection])

  const handleSectionChange = useCallback((section: "home" | "archive" | "trash") => {
    setActiveSection(section)
    setIsSheetOpen(false)
  }, [])

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setActiveSection("home")
    setIsSheetOpen(false)
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    )
  }

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-background border rounded-lg p-8 w-full max-w-md mx-4 shadow-2xl">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="h-8 w-8 text-primary" />
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Shared Notes Access</h1>
            <p className="text-muted-foreground">Enter the current password to continue</p>

            <div className="flex items-center justify-center gap-1 mt-3 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>All notes are shared with everyone</span>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter current Password"
                className="text-center"
                autoFocus
              />
            </div>

            {passwordError && (
              <div className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">{passwordError}</div>
            )}

            <Button type="submit" className="w-full">
              Access Shared Notes
            </Button>
          </form>


        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background overflow-x-hidden flex">
        {/* Sidebar for larger screens */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-sm h-screen sticky top-0">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold">Shared Notes</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Everyone can see and edit</p>
          </div>

          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              <li>
                <Button
                  variant={activeSection === "home" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("home")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                  <Badge variant="outline" className="ml-auto">
                    {notes.filter((n) => !n.isArchived && !n.isTrashed).length}
                  </Badge>
                </Button>
              </li>
              <li>
                <Button
                  variant={activeSection === "archive" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("archive")}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                  <Badge variant="outline" className="ml-auto">
                    {notes.filter((n) => n.isArchived && !n.isTrashed).length}
                  </Badge>
                </Button>
              </li>
              <li>
                <Button
                  variant={activeSection === "trash" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("trash")}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Trash
                  <Badge variant="outline" className="ml-auto">
                    {notes.filter((n) => n.isTrashed).length}
                  </Badge>
                </Button>
              </li>
            </ul>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h3 className="text-sm font-medium px-4 text-muted-foreground">Categories</h3>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category}>
                    <Button
                      variant={selectedCategory === category ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedCategory(category)
                        setActiveSection("home")
                      }}
                    >
                      <FileText className="h-3.5 w-3.5 mr-2 opacity-70" />
                      {category}
                      <Badge variant="outline" className="ml-auto text-xs">
                        {notes.filter((n) => n.category === category && !n.isArchived && !n.isTrashed).length}
                      </Badge>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <BookOpen className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-bold">Shared Notes</h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Everyone can see and edit</p>
            </div>

            <nav className="flex-1 p-2">
              <ul className="space-y-1">
                <li>
                  <Button
                    variant={activeSection === "home" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSectionChange("home")}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                    <Badge variant="outline" className="ml-auto">
                      {notes.filter((n) => !n.isArchived && !n.isTrashed).length}
                    </Badge>
                  </Button>
                </li>
                <li>
                  <Button
                    variant={activeSection === "archive" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSectionChange("archive")}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                    <Badge variant="outline" className="ml-auto">
                      {notes.filter((n) => n.isArchived && !n.isTrashed).length}
                    </Badge>
                  </Button>
                </li>
                <li>
                  <Button
                    variant={activeSection === "trash" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSectionChange("trash")}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Trash
                    <Badge variant="outline" className="ml-auto">
                      {notes.filter((n) => n.isTrashed).length}
                    </Badge>
                  </Button>
                </li>
              </ul>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium px-4 text-muted-foreground">Categories</h3>
                <ul className="space-y-1">
                  {categories.map((category) => (
                    <li key={category}>
                      <Button
                        variant={selectedCategory === category ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange(category)}
                      >
                        <FileText className="h-3.5 w-3.5 mr-2 opacity-70" />
                        {category}
                        <Badge variant="outline" className="ml-auto text-xs">
                          {notes.filter((n) => n.category === category && !n.isArchived && !n.isTrashed).length}
                        </Badge>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 max-w-7xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:hidden">
                  <h1 className="text-xl font-bold ml-12">{getSectionTitle()}</h1>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{getSectionTitle()}</h1>
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Shared
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="hidden md:flex"
                      >
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle theme</TooltipContent>
                  </Tooltip>

                  {activeSection !== "trash" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleNewNote} className="text-sm">
                          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">New Note</span>
                          <span className="sm:hidden">New</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Create new note</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Optimized Note Editor Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-full max-h-full h-screen w-screen m-0 rounded-none border-0 p-0">
              <OptimizedNoteEditor
                note={{
                  id: editingNote?.id || "",
                  title: editingNote?.title || "",
                  content: editingNote?.content || "",
                  category: editingNote?.category || "Personal",
                  tags: editingNote?.tags.join(", ") || "",
                  images: editingNote?.images || [],
                }}
                onSave={handleSaveNote}
                onClose={handleCloseEditor}
                categories={categories}
              />
            </DialogContent>
          </Dialog>

          {/* Note View Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-full max-h-full h-screen w-screen m-0 rounded-none border-0 p-0">
              <div className="flex flex-col h-full overflow-y-scroll">
                <div className="border-b p-4 flex-shrink-0 bg-background">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{viewingNote?.title}</h2>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleEditNote(viewingNote!)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit note</TooltipContent>
                      </Tooltip>

                      {!viewingNote?.isTrashed && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleArchiveNote(viewingNote!.id)}>
                                <Archive className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {viewingNote?.isArchived ? "Unarchive note" : "Archive note"}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleTrashNote(viewingNote!.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Move to trash</TooltipContent>
                          </Tooltip>
                        </>
                      )}

                      {viewingNote?.isTrashed && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRestoreNote(viewingNote!.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Restore note</TooltipContent>
                        </Tooltip>
                      )}

                      <Button variant="ghost" onClick={() => setIsViewDialogOpen(false)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  {viewingNote && (
                    <div className="max-w-4xl mx-auto p-6">
                      <div className="flex flex-wrap gap-2 mb-6">
                        <Badge className="bg-primary/10 text-primary">{viewingNote.category}</Badge>
                        {viewingNote.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-sm text-muted-foreground mb-6 flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Created: {new Date(viewingNote.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Updated: {new Date(viewingNote.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div
                        className="prose prose-lg dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: renderNoteContent(viewingNote.content || "No content"),
                        }}
                      />

                      {viewingNote.images && viewingNote.images.length > 0 && (
                        <div className="mt-8 space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Images</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {viewingNote.images.map((image, index) => (
                              <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`Image ${index + 1}`}
                                className="w-full h-auto rounded-lg border shadow-sm"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notes by title, content, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value: "date" | "title" | "category") => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Sort by Date</SelectItem>
                      <SelectItem value="title">Sort by Title</SelectItem>
                      <SelectItem value="category">Sort by Category</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="flex-1 sm:flex-none"
                    >
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="flex-1 sm:flex-none"
                    >
                      List
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredNotes.length} notes found
                  <span className="ml-2 text-xs">
                    <Users className="h-3 w-3 inline mr-1" />
                    Shared with everyone
                  </span>
                </p>
              </div>
            </div>

            {/* Trash Section Actions */}
            {activeSection === "trash" && filteredNotes.length > 0 && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">Trash</h3>
                    <p className="text-sm text-muted-foreground">
                      Notes in trash will be automatically deleted after 30 days
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        filteredNotes.forEach((note) => handleRestoreNote(note.id))
                      }}
                      disabled={filteredNotes.length === 0}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore All
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        filteredNotes.forEach((note) => handleDeleteNote(note.id))
                      }}
                      disabled={filteredNotes.length === 0}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Empty Trash
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Grid/List */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Globe className="h-8 w-8 text-muted-foreground" />
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                <p className="text-muted-foreground mb-4">{getEmptyStateMessage()}</p>
                {activeSection === "home" && (
                  <Button onClick={handleNewNote}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Note
                  </Button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "space-y-4"
                }
              >
                {filteredNotes.map((note) => (
                  <MemoizedNoteCard
                    key={note.id}
                    note={note}
                    onView={handleViewNote}
                    onEdit={handleEditNote}
                    onPin={handlePinNote}
                    onArchive={handleArchiveNote}
                    onTrash={handleTrashNote}
                    onRestore={handleRestoreNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
