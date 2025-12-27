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
import { ScrollArea } from "@/components/ui/scroll-area"
import Lottie from "lottie-react";
import colouredLoader from "./note loading.json"; // JSON ফাইল path ঠিক করে দাও

import {
  subscribeToNotes,
  addNote,
  updateNote,
  deleteNote,
  setNotePassword,
  removeNotePassword,
  getLockedNoteContent,
} from "@/lib/firebase-service"
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
  RotateCcw,
  Filter,
  ImageIcon,
  Loader2,
  Users,
  Globe,
  Lock,
  Shield,
  Download,
  Key,
  User,
  Briefcase,
  Lightbulb,
  FolderOpen,
  ShoppingCart,
  Plane,
  Heart,
  Circle,
  Square,
  Triangle,
  Hexagon,
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
  Clock,
  AlarmClock,
  Timer,
  Calculator,
  Ruler,
  Compass,
  Microscope,
  Telescope,
  Map,
  Mountain,
  Waves,
  Flame,
  Leaf,
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
  Bell,
  CloudRain,
  Snowflake,
  Icon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { CategoryManager } from "@/lib/category-manager"
import { CategoryManagerDialog } from "@/components/category-manager-dialog"
import { EnhancedNoteEditor } from "@/components/enhanced-note-editor"
import { link } from "fs"
import Head from "next/head"

<link rel="icon" href="public/favicon.ico" sizes="any" />

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
  password?: string
  isPasswordProtected: boolean
}

// Define the FirebaseNote interface (assuming it's defined elsewhere or should be defined here)
interface FirebaseNote {
  id?: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  isArchived: boolean
  isTrashed: boolean
  images: string[]
  password?: string
  isPasswordProtected: boolean
}

// Icon mapping function - moved outside component for better performance
const getIconComponent = (iconName: string, className = "h-3.5 w-3.5") => {
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
    Bell,
    CloudRain,
    Snowflake,
  }

  const IconComponent = iconMap[iconName] || Circle
  return <IconComponent className={className} />
}

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
  password: firebaseNote.password || "",
  isPasswordProtected: firebaseNote.isPasswordProtected || false,
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
    onDownload,
    onSetPassword,
    onRemovePassword,
  }: {
    note: Note
    onView: (note: Note) => void
    onEdit: (note: Note) => void
    onPin: (id: string) => void
    onArchive: (id: string) => void
    onTrash: (id: string) => void
    onRestore: (id: string) => void
    onDelete: (id: string) => void
    onDownload: (note: Note, format: string) => void
    onSetPassword: (note: Note) => void
    onRemovePassword: (note: Note) => void
  }) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [touchStartTime, setTouchStartTime] = useState(0)
    const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 })

    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStartTime(Date.now())
      setTouchStartPos({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
      const touchDuration = Date.now() - touchStartTime
      if (touchDuration > 500) {
        e.preventDefault()
        setShowMobileMenu(true)
      }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      const moveThreshold = 10
      const deltaX = Math.abs(e.touches[0].clientX - touchStartPos.x)
      const deltaY = Math.abs(e.touches[0].clientY - touchStartPos.y)
      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        setTouchStartTime(0)
      }
    }

    const displayContent = note.isPasswordProtected
      ? "•••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• ••••••"
      : note.content

    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              className={`group cursor-pointer hover:shadow-lg transition-all duration-200 relative ${
                note.isPinned ? "border-primary" : ""
              } ${note.isTrashed ? "opacity-75" : ""} ${note.isPasswordProtected ? "border-amber-200 dark:border-amber-800" : ""}`}
              onClick={() => onView(note)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
            >
              {note.isPinned && <Star className="absolute top-2 right-2 h-4 w-4 text-primary fill-primary" />}
              {note.isPasswordProtected && (
                <Lock className="absolute top-2 right-8 h-4 w-4 text-amber-600 dark:text-amber-400" />
              )}

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base sm:text-lg line-clamp-2 pr-8">
                    {note.isPasswordProtected ? (
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        {note.title}
                      </div>
                    ) : (
                      note.title
                    )}
                  </CardTitle>

                  {/* Desktop hover menu */}
                  <div className="hidden md:flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                onDownload(note, "txt")
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download as TXT</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (note.isPasswordProtected) {
                                  onRemovePassword(note)
                                } else {
                                  onSetPassword(note)
                                }
                              }}
                            >
                              <Shield className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {note.isPasswordProtected ? "Remove Password" : "Set Password"}
                          </TooltipContent>
                        </Tooltip>

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
                <p
                  className={`text-sm text-muted-foreground line-clamp-3 ${note.isPasswordProtected ? "blur-sm select-none" : ""}`}
                >
                  {displayContent.slice(0, 150)}
                  {displayContent.length > 150 && "..."}
                </p>

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
          </TooltipTrigger>
          <TooltipContent>{note.isPasswordProtected ? "This note is locked" : note.title}</TooltipContent>
        </Tooltip>

        {/* Mobile Context Menu */}
        <Dialog open={showMobileMenu} onOpenChange={setShowMobileMenu}>
          <DialogContent className="sm:max-w-md">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">{note.title}</h3>
              <p className="text-sm text-muted-foreground">Choose an action</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {!note.isTrashed && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false)
                      onEdit(note)
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false)
                      onPin(note.id)
                    }}
                    className="flex items-center gap-2"
                  >
                    <Star className={`h-4 w-4 ${note.isPinned ? "fill-primary text-primary" : ""}`} />
                    {note.isPinned ? "Unpin" : "Pin"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false)
                      if (note.isPasswordProtected) {
                        onRemovePassword(note)
                      } else {
                        onSetPassword(note)
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    {note.isPasswordProtected ? "Remove Lock" : "Add Lock"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false)
                      onDownload(note, "txt")
                    }}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false)
                      onArchive(note.id)
                    }}
                    className="flex items-center gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    {note.isArchived ? "Unarchive" : "Archive"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false)
                      onTrash(note.id)
                    }}
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                    Trash
                  </Button>
                </>
              )}

              {note.isTrashed && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false)
                      onRestore(note.id)
                    }}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restore
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false)
                      onDelete(note.id)
                    }}
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Forever
                  </Button>
                </>
              )}
            </div>

            <Button variant="ghost" onClick={() => setShowMobileMenu(false)} className="w-full mt-4">
              Cancel
            </Button>
          </DialogContent>
        </Dialog>
      </>
    )
  },
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
  const [passwordDialog, setPasswordDialog] = useState<{
    isOpen: boolean
    noteId: string
    action:
      | "view"
      | "edit"
      | "pin"
      | "archive"
      | "trash"
      | "restore"
      | "delete"
      | "download"
      | "setPassword"
      | "removePassword"
    note?: Note
  }>({
    isOpen: false,
    noteId: "",
    action: "view",
  })
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError2, setPasswordError2] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [showCategoryManager, setShowCategoryManager] = useState(false)

  // Subscribe to Firebase notes
  useEffect(() => {
    const unsubscribe = subscribeToNotes((firebaseNotes: FirebaseNote[]) => {
      // Explicitly type firebaseNotes
      const convertedNotes = firebaseNotes.map(convertFirebaseNote)
      setNotes(convertedNotes)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Authentication check
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

  const handleViewNote = useCallback((note: Note) => {
    setViewingNote(note)
    setIsViewDialogOpen(true)
  }, [])

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note)
    setIsDialogOpen(true)
    setIsViewDialogOpen(false)
  }, [])

  const downloadNote = useCallback((note: Note, format: "txt" | "pdf" | "csv") => {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${timestamp}`

    switch (format) {
      case "txt":
        const txtContent = `Title: ${note.title}\nCategory: ${note.category}\nTags: ${note.tags.join(", ")}\nCreated: ${new Date(note.createdAt).toLocaleString()}\nUpdated: ${new Date(note.updatedAt).toLocaleString()}\n\nContent:\n${note.content}`
        const txtBlob = new Blob([txtContent], { type: "text/plain" })
        const txtUrl = URL.createObjectURL(txtBlob)
        const txtLink = document.createElement("a")
        txtLink.href = txtUrl
        txtLink.download = `${filename}.txt`
        txtLink.click()
        URL.revokeObjectURL(txtUrl)
        break

      case "csv":
        const csvContent = `Title,Category,Tags,Created,Updated,Content\n"${note.title}","${note.category}","${note.tags.join("; ")}","${new Date(note.createdAt).toLocaleString()}","${new Date(note.updatedAt).toLocaleString()}","${note.content.replace(/"/g, '""')}"`
        const csvBlob = new Blob([csvContent], { type: "text/csv" })
        const csvUrl = URL.createObjectURL(csvBlob)
        const csvLink = document.createElement("a")
        csvLink.href = csvUrl
        csvLink.download = `${filename}.csv`
        csvLink.click()
        URL.revokeObjectURL(csvUrl)
        break

      case "pdf":
        // Simple PDF generation using HTML to PDF approach
        const pdfContent = `
          <html>
            <head>
              <title>${note.title}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .meta { color: #666; font-size: 14px; }
                .content { white-space: pre-wrap; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="title">${note.title}</div>
                <div class="meta">
                  Category: ${note.category} | Tags: ${note.tags.join(", ")}<br>
                  Created: ${new Date(note.createdAt).toLocaleString()}<br>
                  Updated: ${new Date(note.updatedAt).toLocaleString()}
                </div>
              </div>
              <div class="content">${note.content}</div>
            </body>
          </html>
        `
        const pdfWindow = window.open("", "_blank")
        if (pdfWindow) {
          pdfWindow.document.write(pdfContent)
          pdfWindow.document.close()
          pdfWindow.print()
        }
        break
    }
  }, [])

  const verifyPassword = useCallback((note: Note, inputPassword: string): boolean => {
    if (!note.isPasswordProtected || !note.password) {
      return true
    }
    return note.password === inputPassword
  }, [])

  const handlePasswordSubmit2 = useCallback(async () => {
    const note = notes.find((n) => n.id === passwordDialog.noteId)
    if (!note) return

    if (passwordDialog.action === "setPassword") {
      if (!passwordInput.trim()) {
        setPasswordError2("Please enter a password")
        return
      }
      try {
        await setNotePassword(note.id, passwordInput)
        setPasswordDialog({ isOpen: false, noteId: "", action: "view" })
        setPasswordInput("")
        setPasswordError2("")
      } catch (error) {
        setPasswordError2("Failed to set password")
      }
      return
    }

    if (passwordDialog.action === "removePassword") {
      if (!verifyPassword(note, passwordInput)) {
        setPasswordError2("Incorrect password")
        return
      }
      try {
        await removeNotePassword(note.id)
        setPasswordDialog({ isOpen: false, noteId: "", action: "view" })
        setPasswordInput("")
        setPasswordError2("")
      } catch (error) {
        setPasswordError2("Failed to remove password")
      }
      return
    }

    if (!verifyPassword(note, passwordInput)) {
      setPasswordError2("Incorrect password")
      return
    }

    if (note.isPasswordProtected && passwordDialog.action === "view") {
      try {
        const fullContent = await getLockedNoteContent(note.id)
        // Update the note with full content
        const updatedNote = { ...note, content: fullContent }
        setViewingNote(updatedNote)
      } catch (error) {
        setPasswordError2("Failed to load note content")
        return
      }
    }

    // Execute the original action
    setPasswordDialog({ isOpen: false, noteId: "", action: "view" })
    setPasswordInput("")
    setPasswordError2("")

    switch (passwordDialog.action) {
      case "view":
        // Already handled above for locked notes
        if (!note.isPasswordProtected) {
          handleViewNote(note)
        }
        break
      case "edit":
        if (note.isPasswordProtected) {
          try {
            const fullContent = await getLockedNoteContent(note.id)
            const updatedNote = { ...note, content: fullContent }
            handleEditNote(updatedNote)
          } catch (error) {
            console.error("Failed to load note for editing")
          }
        } else {
          handleEditNote(note)
        }
        break
      case "pin":
        handlePinNote(note.id)
        break
      case "archive":
        handleArchiveNote(note.id)
        break
      case "trash":
        handleTrashNote(note.id)
        break
      case "restore":
        handleRestoreNote(note.id)
        break
      case "delete":
        handleDeleteNote(note.id)
        break
      case "download":
        if (passwordDialog.note) {
          if (note.isPasswordProtected) {
            getLockedNoteContent(note.id).then((fullContent) => {
              const updatedNote = { ...note, content: fullContent }
              const format = (passwordDialog.note as any).downloadFormat || "txt"
              downloadNote(updatedNote, format)
            })
          } else {
            const format = (passwordDialog.note as any).downloadFormat || "txt"
            downloadNote(passwordDialog.note, format)
          }
        }
        break
    }
  }, [
    passwordDialog,
    passwordInput,
    notes,
    verifyPassword,
    handleEditNote,
    handlePinNote,
    handleArchiveNote,
    handleTrashNote,
    handleRestoreNote,
    handleDeleteNote,
    handleViewNote, // Added handleViewNote here
    downloadNote, // Added downloadNote here
  ])

  const handleDownload = useCallback(
    (note: Note, format: "txt" | "pdf" | "csv") => {
      if (note.isPasswordProtected) {
        setPasswordDialog({
          isOpen: true,
          noteId: note.id,
          action: "download",
          note: { ...note, downloadFormat: format } as any,
        })
        setPasswordInput("")
        setPasswordError2("")
      } else {
        downloadNote(note, format)
      }
    },
    [downloadNote],
  )

  const executeProtectedAction = useCallback(
    (note: Note, action: typeof passwordDialog.action, additionalData?: any) => {
      if (note.isPasswordProtected && action !== "setPassword") {
        setPasswordDialog({
          isOpen: true,
          noteId: note.id,
          action,
          note: additionalData ? { ...note, ...additionalData } : note,
        })
        setPasswordInput("")
        setPasswordError2("")
      } else {
        // Execute action directly
        switch (action) {
          case "view":
            handleViewNote(note)
            break
          case "edit":
            handleEditNote(note)
            break
          case "pin":
            handlePinNote(note.id)
            break
          case "archive":
            handleArchiveNote(note.id)
            break
          case "trash":
            handleTrashNote(note.id)
            break
          case "restore":
            handleRestoreNote(note.id)
            break
          case "delete":
            handleDeleteNote(note.id)
            break
          case "setPassword":
            setPasswordDialog({ isOpen: true, noteId: note.id, action: "setPassword" })
            setPasswordInput("")
            setPasswordError2("")
            break
          case "removePassword":
            setPasswordDialog({ isOpen: true, noteId: note.id, action: "removePassword" })
            setPasswordInput("")
            setPasswordError2("")
            break
        }
      }
    },
    [
      handleViewNote,
      handleEditNote,
      handlePinNote,
      handleArchiveNote,
      handleTrashNote,
      handleRestoreNote,
      handleDeleteNote,
    ],
  )

  const handleSetPassword = useCallback(
    (note: Note) => {
      executeProtectedAction(note, "setPassword")
    },
    [executeProtectedAction],
  )

  const handleRemovePassword = useCallback(
    (note: Note) => {
      executeProtectedAction(note, "removePassword")
    },
    [executeProtectedAction],
  )

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
          /\[(.*?)\]$$(.*?)$$/g, // Corrected regex for links
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">$1</a>',
        )
        // Headings
        .replace(/^# (.*?)$/gm, "<h1 class='text-3xl font-bold my-6 text-gray-900 dark:text-gray-100'>$1</h1>")
        .replace(/^## (.*?)$/gm, "<h2 class='text-2xl font-bold my-5 text-gray-900 dark:text-gray-100'>$1</h2>")
        .replace(/^### (.*?)$/gm, "<h3 class='text-xl font-bold my-4 text-gray-900 dark:text-gray-100'>$1</h3>")
        // Blockquotes
        .replace(
          /^> (.*?)$/gm,
          "<blockquote class='border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300 bg-gray-gray-50 dark:bg-gray-800 py-2 rounded-r'>$1</blockquote>",
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
      const tableRegex = /\|(.+)\|\n\|:?-+:?\|(?:\s*:?-+:?\|)*\n((?:\|.+\|\n?)*)/g // Adjusted regex for better table detection
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
  useEffect(() => {
    const loadCategories = () => {
      const categoryManager = CategoryManager.getInstance()
      const allCategories = categoryManager.getAllCategories()
      setCategories(allCategories.map((cat) => cat.name))
    }

    loadCategories()

    // Listen for category updates
    const handleCategoryUpdate = () => loadCategories()
    window.addEventListener("categoriesUpdated", handleCategoryUpdate)

    return () => {
      window.removeEventListener("categoriesUpdated", handleCategoryUpdate)
    }
  }, [])


function Loader() {
  return (
    <div className="w-40 h-40 mx-auto mb-4">
      <Lottie animationData={colouredLoader} loop={true} />
    </div>
  );
}

if (loading) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader /> 
        <p className="text-muted-foreground">Loading notes...</p>
      </div>
    </div>
  );
}


  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        


      <div className="absolute top-4 right-4 w-32 h-32 opacity-80">
        <Lottie animationData={require("./password.json")} loop={true} />
        
      </div>
      
        <div className="bg-background border rounded-lg p-8 w-full max-w-md mx-4 shadow-2xl">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="h-8 w-8 text-primary" />
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Shared Notes Access</h1>
            <p className="text-muted-foreground">Enter the current password</p>

            <div className="flex items-center justify-center gap-1 mt-3 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>All notes are shared with everyone</span>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Password </Label>
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
              <div className="text-xs text-muted-foreground text-center mt-6 pt-4 border-t">
                Made by{" "}
                <a 
                  href="http://iamthesakibalhasan.netlify.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Sakib Al Hasan
                </a>
              </div>
            
          </form>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background overflow-hidden flex">
        {/* Sidebar for larger screens */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-sm h-screen fixed top-0 left-0 overflow-hidden">
          <div className="p-4 border-b flex-shrink-0">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold">Shared Notes</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Everyone can see and edit</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-2">
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
              <ScrollArea className="h-[calc(100vh-450px)]">
                <div className="pr-2">
                  <ul className="space-y-1">
                    {categories.map((category) => {
                      const categoryData = CategoryManager.getInstance().getCategoryByName(category)
                      return (
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
                            <div className="mr-2" style={{ color: categoryData?.color }}>
                              {getIconComponent(categoryData?.icon || "Circle", "h-3.5 w-3.5 opacity-70")}
                            </div>
                            {category}
                            <Badge variant="outline" className="ml-auto text-xs">
                              {notes.filter((n) => n.category === category && !n.isArchived && !n.isTrashed).length}
                            </Badge>
                          </Button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </ScrollArea>
            </div>

            <div className="mt-2 px-2 pb-4 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-primary/5 hover:bg-primary/10"
                onClick={() => setShowCategoryManager(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
            </div>
          </nav>

          <div className="p-4 border-t flex-shrink-0">
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
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <BookOpen className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-bold">Shared Notes</h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Everyone can see and edit</p>
            </div>

            <nav className="flex-1 p-2 overflow-y-auto">
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
                  {categories.map((category) => {
                    const categoryData = CategoryManager.getInstance().getCategoryByName(category)
                    return (
                      <li key={category}>
                        <Button
                          variant={selectedCategory === category ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleCategoryChange(category)}
                        >
                          <div className="mr-2" style={{ color: categoryData?.color }}>
                            {getIconComponent(categoryData?.icon || "Circle", "h-3.5 w-3.5 opacity-70")}
                          </div>
                          {category}
                          <Badge variant="outline" className="ml-auto text-xs">
                            {notes.filter((n) => n.category === category && !n.isArchived && !n.isTrashed).length}
                          </Badge>
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="mt-4 px-2">
                <Button
                  variant="outline"
                  size="default"
                  className="w-full justify-center gap-2 bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary font-medium"
                  onClick={() => {
                    setShowCategoryManager(true)
                    setIsSheetOpen(false)
                  }}
                >
                  <Plus className="h-5 w-5" />
                  Manage Categories
                </Button>
              </div>
            </nav>

            <div className="p-4 border-t flex-shrink-0">
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

        {/* Main Content */}
        <main className="flex-1 md:ml-64">
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

          {/* Enhanced Note Editor Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-full max-h-[100dvh] h-[100dvh] w-full m-0 p-0 rounded-none border-0 md:max-w-[95vw] md:max-h-[95vh] md:h-[95vh] md:rounded-lg md:border">
              <EnhancedNoteEditor
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
              />
            </DialogContent>
          </Dialog>

          {/* Note View Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-full max-h-full h-screen w-screen m-0 rounded-none border-0">
              <div className="flex flex-col h-full">
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
                    onView={(note) => executeProtectedAction(note, "view")}
                    onEdit={(note) => executeProtectedAction(note, "edit")}
                    onPin={(id) => {
                      const note = notes.find((n) => n.id === id)
                      if (note) executeProtectedAction(note, "pin")
                    }}
                    onArchive={(id) => {
                      const note = notes.find((n) => n.id === id)
                      if (note) executeProtectedAction(note, "archive")
                    }}
                    onTrash={(id) => {
                      const note = notes.find((n) => n.id === id)
                      if (note) executeProtectedAction(note, "trash")
                    }}
                    onRestore={(id) => {
                      const note = notes.find((n) => n.id === id)
                      if (note) executeProtectedAction(note, "restore")
                    }}
                    onDelete={(id) => {
                      const note = notes.find((n) => n.id === id)
                      if (note) executeProtectedAction(note, "delete")
                    }}
                    onSetPassword={(note) => executeProtectedAction(note, "setPassword")}
                    onRemovePassword={(note) => executeProtectedAction(note, "removePassword")}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Password Dialog */}
      <Dialog
        open={passwordDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPasswordDialog({ isOpen: false, noteId: "", action: "view" })
            setPasswordInput("")
            setPasswordError("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {passwordDialog.action === "setPassword" ? (
                <Key className="h-8 w-8 text-primary" />
              ) : (
                <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {passwordDialog.action === "setPassword"
                ? "Set Password"
                : passwordDialog.action === "removePassword"
                  ? "Remove Password"
                  : "Password Required"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {passwordDialog.action === "setPassword"
                ? "Enter a password to protect this note"
                : passwordDialog.action === "removePassword"
                  ? "Enter current password to remove protection"
                  : "This note is password protected"}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handlePasswordSubmit2()
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="notePassword">
                {passwordDialog.action === "setPassword" ? "New Password" : "Password"}
              </Label>
              <Input
                id="notePassword"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={passwordDialog.action === "setPassword" ? "Enter new password" : "Enter password"}
                className="text-center"
                autoFocus
              />
            </div>

            {passwordError2 && (
              <div className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">{passwordError2}</div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setPasswordDialog({ isOpen: false, noteId: "", action: "view" })
                  setPasswordInput("")
                  setPasswordError("")
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {passwordDialog.action === "setPassword"
                  ? "Set Password"
                  : passwordDialog.action === "removePassword"
                    ? "Remove Password"
                    : "Unlock"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Manager Dialog */}
      <CategoryManagerDialog
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        onCategoriesUpdate={() => {
          const categoryManager = CategoryManager.getInstance()
          const allCategories = categoryManager.getAllCategories()
          setCategories(allCategories.map((cat) => cat.name))
          window.dispatchEvent(new Event("categoriesUpdated"))
        }}
      />
    </TooltipProvider>
  )
}
