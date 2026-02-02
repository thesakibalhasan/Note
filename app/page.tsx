"use client";

import React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Lottie from "lottie-react";
import colouredLoader from "./note loading.json";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  subscribeToNotes,
  addNote,
  updateNote,
  deleteNote,
  setNotePassword,
  removeNotePassword,
  getLockedNoteContent,
} from "@/lib/firebase-service";
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
  MoreVertical,
  ChartBarStacked,
  LayoutGrid,
  Rows3,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import { CategoryManager } from "@/lib/category-manager";
import { CategoryManagerDialog } from "@/components/category-manager-dialog";
import { EnhancedNoteEditor } from "@/components/enhanced-note-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown components

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  images: string[];
  password?: string;
  isPasswordProtected: boolean;
}

// Define the FirebaseNote interface (assuming it's defined elsewhere or should be defined here)
interface FirebaseNote {
  id?: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  images: string[];
  password?: string;
  isPasswordProtected: boolean;
}

import type { SVGProps } from "react";
import { Icon } from "@iconify/react";

export function FluentMdl2EditCreate(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 2048 2048"
      {...props}
    >
      <path
        fill="white"
        d="M226 701q-48-48-73-109t-25-128q0-71 26-131t71-105t107-70t131-26q66 0 128 23t110 71l353 353l-91 91l-195-195l-293 293l195 195l-91 91zm238-443q-43 0-81 15t-66 44t-44 65t-17 82q0 38 10 66t29 53t41 47t48 47l293-293q-26-25-47-48t-46-40t-52-28t-68-10m1584 1790l-633-158l-293-293l91-91l217 218q16-52 44-98t67-85t84-66t99-45l-218-217l91-91l293 293zm-176-176l-82-329q-47 10-87 32t-73 55t-55 73t-32 87zM1728 192q53 0 99 20t82 55t55 81t20 100q0 51-19 98t-56 83L763 1775q-9 59-37 108t-70 87t-95 57t-113 21H0v-128q11 0 23-3t22-9q25-13 41-33t25-44t13-50t4-53q0-59 20-112t58-96t86-70t109-37L1547 267q36-36 83-55t98-20M448 1920q40 0 75-15t61-41t41-61t15-75t-15-75t-41-61t-61-41t-75-15t-75 15t-61 41t-41 61t-15 75q0 104-64 192zm518-529q-32-63-75-106t-106-75l-221 221q62 24 109 71t72 110zm852-853q37-37 37-90q0-26-10-49t-27-40t-41-28t-49-10q-53 0-90 37l-759 758q61 36 103 78t78 103z"
      ></path>
    </svg>
  );
}
export function GgWebsite(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="white">
        <path
          fillRule="evenodd"
          d="M14 7a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm3 2h-2v6h2z"
          clipRule="evenodd"
        ></path>
        <path d="M6 7a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2zm-1 5a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1"></path>
        <path
          fillRule="evenodd"
          d="M4 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zm16 2H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1"
          clipRule="evenodd"
        ></path>
      </g>
    </svg>
  );
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
    MoreVertical, // Added for the new menu icon
  };

  const IconComponent = iconMap[iconName] || Circle;
  return <IconComponent className={className} />;
};

// Convert Firebase note to local note format
const convertFirebaseNote = (firebaseNote: FirebaseNote): Note => ({
  id: firebaseNote.id || "",
  title: firebaseNote.title,
  content: firebaseNote.content,
  category: firebaseNote.category,
  tags: firebaseNote.tags,
  createdAt:
    firebaseNote.createdAt instanceof Date
      ? firebaseNote.createdAt.toISOString()
      : new Date().toISOString(),
  updatedAt:
    firebaseNote.updatedAt instanceof Date
      ? firebaseNote.updatedAt.toISOString()
      : new Date().toISOString(),
  isPinned: firebaseNote.isPinned,
  isArchived: firebaseNote.isArchived,
  isTrashed: firebaseNote.isTrashed,
  images: firebaseNote.images,
  password: firebaseNote.password || "",
  isPasswordProtected: firebaseNote.isPasswordProtected || false,
});

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
    note: Note;
    onView: (note: Note) => void;
    onEdit: (note: Note) => void;
    onPin: (id: string) => void;
    onArchive: (id: string) => void;
    onTrash: (id: string) => void;
    onRestore: (id: string) => void;
    onDelete: (id: string) => void;
    onDownload: (note: Note, format: string) => void;
    onSetPassword: (note: Note) => void;
    onRemovePassword: (note: Note) => void;
  }) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const displayContent = note.isPasswordProtected
      ? "•••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• ••••••"
      : note.content;

    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              className={`group cursor-pointer hover:shadow-lg transition-all duration-200 relative ${note.isPinned ? "border-primary" : ""
                } ${note.isTrashed ? "opacity-75" : ""} ${note.isPasswordProtected
                  ? "border-amber-200 dark:border-amber-800"
                  : ""
                }`}
              onClick={() => onView(note)}
            >
              {note.isPinned && (
                <Star className="absolute top-2 right-2 h-4 w-4 text-primary fill-primary" />
              )}
              {note.isPasswordProtected && (
                <Lock className="absolute top-2 right-8 h-4 w-4 text-amber-600 dark:text-amber-400" />
              )}

              <div className="absolute top-2 right-2 sm:right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 md:hidden"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!note.isTrashed && (
                      <>
                        <DropdownMenuItem onClick={() => onEdit(note)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPin(note.id)}>
                          <Star className="h-4 w-4 mr-2" />
                          {note.isPinned ? "Unpin" : "Pin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            if (note.isPasswordProtected) {
                              onRemovePassword(note);
                            } else {
                              onSetPassword(note);
                            }
                          }}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          {note.isPasswordProtected
                            ? "Remove Lock"
                            : "Add Lock"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDownload(note, "txt")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onArchive(note.id)}>
                          <Archive className="h-4 w-4 mr-2" />
                          {note.isArchived ? "Unarchive" : "Archive"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onTrash(note.id)}
                          className="text-destructive"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Trash
                        </DropdownMenuItem>
                      </>
                    )}
                    {note.isTrashed && (
                      <>
                        <DropdownMenuItem onClick={() => onRestore(note.id)}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restore
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(note.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Forever
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

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
                                e.stopPropagation();
                                onDownload(note, "txt");
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
                                e.stopPropagation();
                                if (note.isPasswordProtected) {
                                  onRemovePassword(note);
                                } else {
                                  onSetPassword(note);
                                }
                              }}
                            >
                              <Shield className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {note.isPasswordProtected
                              ? "Remove Password"
                              : "Set Password"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPin(note.id);
                              }}
                            >
                              <Star
                                className={`h-3 w-3 ${note.isPinned
                                    ? "fill-primary text-primary"
                                    : ""
                                  }`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {note.isPinned ? "Unpin note" : "Pin note"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(note);
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
                                e.stopPropagation();
                                onArchive(note.id);
                              }}
                            >
                              <Archive className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {note.isArchived
                              ? "Unarchive note"
                              : "Archive note"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTrash(note.id);
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
                                e.stopPropagation();
                                onRestore(note.id);
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
                                e.stopPropagation();
                                onDelete(note.id);
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
                  className={`text-sm text-muted-foreground line-clamp-3 ${note.isPasswordProtected ? "blur-sm select-none" : ""
                    }`}
                >
                  {displayContent.slice(0, 150)}
                  {displayContent.length > 150 && "..."}
                </p>

                {note.images && note.images.length > 0 && (
                  <div className="flex gap-1 mb-3">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {note.images.length} image(s)
                    </span>
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
          <TooltipContent>
            {note.isPasswordProtected ? "This note is locked" : note.title}
          </TooltipContent>
        </Tooltip>

        {/* Mobile Context Menu */}
        <Dialog open={showMobileMenu} onOpenChange={setShowMobileMenu}>
          <DialogContent className="sm:max-w-md">
            <div className="text-center mb-4">
              <DialogTitle className="text-lg font-semibold">
                {note.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">Choose an action</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {!note.isTrashed && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onEdit(note);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onPin(note.id);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Star
                      className={`h-4 w-4 ${note.isPinned ? "fill-primary text-primary" : ""
                        }`}
                    />
                    {note.isPinned ? "Unpin" : "Pin"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false);
                      if (note.isPasswordProtected) {
                        onRemovePassword(note);
                      } else {
                        onSetPassword(note);
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
                      setShowMobileMenu(false);
                      onDownload(note, "txt");
                    }}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onArchive(note.id);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    {note.isArchived ? "Unarchive" : "Archive"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onTrash(note.id);
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
                      setShowMobileMenu(false);
                      onRestore(note.id);
                    }}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restore
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onDelete(note.id);
                    }}
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Forever
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              onClick={() => setShowMobileMenu(false)}
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

MemoizedNoteCard.displayName = "MemoizedNoteCard";

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "title" | "category">("date");
  const [activeSection, setActiveSection] = useState<
    "home" | "archive" | "trash"
  >("home");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordDialog, setPasswordDialog] = useState<{
    isOpen: boolean;
    noteId: string;
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
      | "removePassword";
    note?: Note;
  }>({
    isOpen: false,
    noteId: "",
    action: "view",
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError2, setPasswordError2] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Subscribe to Firebase notes
  useEffect(() => {
    const unsubscribe = subscribeToNotes((firebaseNotes: FirebaseNote[]) => {
      // Explicitly type firebaseNotes
      const convertedNotes = firebaseNotes.map(convertFirebaseNote);
      setNotes(convertedNotes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Authentication check
  const getCurrentTimePassword = useCallback(() => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours}${minutes.toString().padStart(2, "0")}${ampm}`;
    return timeStr;
  }, []);

  const handlePasswordSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const correctPassword = getCurrentTimePassword();
      if (password === correctPassword) {
        setIsAuthenticated(true);
        setPasswordError("");
      } else {
        setPasswordError(`Wrong password!`);
        setPassword("");
      }
    },
    [password, getCurrentTimePassword]
  );

  // Note operations with Firebase
  const handleSaveNote = useCallback(
    async (noteData: {
      title: string;
      content: string;
      category: string;
      tags: string;
      images: string[];
    }) => {
      if (!noteData.title.trim()) return;

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
        };

        if (editingNote) {
          await updateNote(editingNote.id, noteToSave);
        } else {
          await addNote(noteToSave);
        }

        setIsDialogOpen(false);
        setEditingNote(null);
      } catch (error) {
        console.error("Error saving note:", error);
        alert("Error saving note. Please try again.");
      }
    },
    [editingNote]
  );

  const handleNewNote = useCallback(() => {
    setEditingNote(null);
    setIsDialogOpen(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setIsDialogOpen(false);
    setEditingNote(null);
  }, []);

  const handleDeleteNote = useCallback(async (id: string) => {
    try {
      await deleteNote(id);
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Error deleting note. Please try again.");
    }
  }, []);

  const handlePinNote = useCallback(
    async (id: string) => {
      try {
        const note = notes.find((n) => n.id === id);
        if (note) {
          await updateNote(id, { isPinned: !note.isPinned });
        }
      } catch (error) {
        console.error("Error updating note:", error);
      }
    },
    [notes]
  );

  const handleArchiveNote = useCallback(
    async (id: string) => {
      try {
        const note = notes.find((n) => n.id === id);
        if (note) {
          await updateNote(id, {
            isArchived: !note.isArchived,
            isTrashed: false,
            isPinned: false,
          });
        }
        setIsViewDialogOpen(false);
      } catch (error) {
        console.error("Error updating note:", error);
      }
    },
    [notes]
  );

  const handleTrashNote = useCallback(
    async (id: string) => {
      try {
        const note = notes.find((n) => n.id === id);
        if (note) {
          await updateNote(id, {
            isTrashed: !note.isTrashed,
            isArchived: false,
            isPinned: false,
          });
        }
        setIsViewDialogOpen(false);
      } catch (error) {
        console.error("Error updating note:", error);
      }
    },
    [notes]
  );

  const handleRestoreNote = useCallback(async (id: string) => {
    try {
      await updateNote(id, { isTrashed: false, isArchived: false });
    } catch (error) {
      console.error("Error restoring note:", error);
    }
  }, []);

  const handleViewNote = useCallback((note: Note) => {
    setViewingNote(note);
    setIsViewDialogOpen(true);
  }, []);

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note);
    setIsDialogOpen(true);
    setIsViewDialogOpen(false);
  }, []);

  const downloadNote = useCallback(
    (note: Note, format: "txt" | "pdf" | "csv") => {
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `${note.title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_${timestamp}`;

      switch (format) {
        case "txt":
          const txtContent = `Title: ${note.title}\nCategory: ${note.category
            }\nTags: ${note.tags.join(", ")}\nCreated: ${new Date(
              note.createdAt
            ).toLocaleString()}\nUpdated: ${new Date(
              note.updatedAt
            ).toLocaleString()}\n\nContent:\n${note.content}`;
          const txtBlob = new Blob([txtContent], { type: "text/plain" });
          const txtUrl = URL.createObjectURL(txtBlob);
          const txtLink = document.createElement("a");
          txtLink.href = txtUrl;
          txtLink.download = `${filename}.txt`;
          txtLink.click();
          URL.revokeObjectURL(txtUrl);
          break;

        case "csv":
          const csvContent = `Title,Category,Tags,Created,Updated,Content\n"${note.title
            }","${note.category}","${note.tags.join("; ")}","${new Date(
              note.createdAt
            ).toLocaleString()}","${new Date(
              note.updatedAt
            ).toLocaleString()}","${note.content.replace(/"/g, '""')}"`;
          const csvBlob = new Blob([csvContent], { type: "text/csv" });
          const csvUrl = URL.createObjectURL(csvBlob);
          const csvLink = document.createElement("a");
          csvLink.href = csvUrl;
          csvLink.download = `${filename}.csv`;
          csvLink.click();
          URL.revokeObjectURL(csvUrl);
          break;

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
        `;
          const pdfWindow = window.open("", "_blank");
          if (pdfWindow) {
            pdfWindow.document.write(pdfContent);
            pdfWindow.document.close();
            pdfWindow.print();
          }
          break;
      }
    },
    []
  );

  const verifyPassword = useCallback(
    (note: Note, inputPassword: string): boolean => {
      if (!note.isPasswordProtected || !note.password) {
        return true;
      }
      return note.password === inputPassword;
    },
    []
  );

  const handlePasswordSubmit2 = useCallback(async () => {
    const note = notes.find((n) => n.id === passwordDialog.noteId);
    if (!note) return;

    if (passwordDialog.action === "setPassword") {
      if (!passwordInput.trim()) {
        setPasswordError2("Please enter a password");
        return;
      }
      try {
        await setNotePassword(note.id, passwordInput);
        setPasswordDialog({ isOpen: false, noteId: "", action: "view" });
        setPasswordInput("");
        setPasswordError2("");
      } catch (error) {
        setPasswordError2("Failed to set password");
      }
      return;
    }

    if (passwordDialog.action === "removePassword") {
      if (!verifyPassword(note, passwordInput)) {
        setPasswordError2("Incorrect password");
        return;
      }
      try {
        await removeNotePassword(note.id);
        setPasswordDialog({ isOpen: false, noteId: "", action: "view" });
        setPasswordInput("");
        setPasswordError2("");
      } catch (error) {
        setPasswordError2("Failed to remove password");
      }
      return;
    }

    if (!verifyPassword(note, passwordInput)) {
      setPasswordError2("Incorrect password");
      return;
    }

    if (note.isPasswordProtected && passwordDialog.action === "view") {
      try {
        const fullContent = await getLockedNoteContent(note.id);
        // Update the note with full content
        const updatedNote = { ...note, content: fullContent };
        setViewingNote(updatedNote);
                setIsViewDialogOpen(true);
      } catch (error) {
        setPasswordError2("Failed to load note content");
        return;
      }
    }

    // Execute the original action
    setPasswordDialog({ isOpen: false, noteId: "", action: "view" });
    setPasswordInput("");
    setPasswordError2("");

    switch (passwordDialog.action) {
      case "view":
        // Already handled above for locked notes
        if (!note.isPasswordProtected) {
          handleViewNote(note);
        }
        break;
      case "edit":
        if (note.isPasswordProtected) {
          try {
            const fullContent = await getLockedNoteContent(note.id);
            const updatedNote = { ...note, content: fullContent };
            handleEditNote(updatedNote);
          } catch (error) {
            console.error("Failed to load note for editing");
          }
        } else {
          handleEditNote(note);
        }
        break;
      case "pin":
        handlePinNote(note.id);
        break;
      case "archive":
        handleArchiveNote(note.id);
        break;
      case "trash":
        handleTrashNote(note.id);
        break;
      case "restore":
        handleRestoreNote(note.id);
        break;
      case "delete":
        handleDeleteNote(note.id);
        break;
      case "download":
        if (passwordDialog.note) {
          if (note.isPasswordProtected) {
            getLockedNoteContent(note.id).then((fullContent) => {
              const updatedNote = { ...note, content: fullContent };
              const format =
                (passwordDialog.note as any).downloadFormat || "txt";
              downloadNote(updatedNote, format);
            });
          } else {
            const format = (passwordDialog.note as any).downloadFormat || "txt";
            downloadNote(passwordDialog.note, format);
          }
        }
        break;
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
  ]);

  const handleDownload = useCallback(
    (note: Note, format: "txt" | "pdf" | "csv") => {
      if (note.isPasswordProtected) {
        setPasswordDialog({
          isOpen: true,
          noteId: note.id,
          action: "download",
          note: { ...note, downloadFormat: format } as any,
        });
        setPasswordInput("");
        setPasswordError2("");
      } else {
        downloadNote(note, format);
      }
    },
    [downloadNote]
  );

  const executeProtectedAction = useCallback(
    (
      note: Note,
      action: typeof passwordDialog.action,
      additionalData?: any
    ) => {
      if (note.isPasswordProtected && action !== "setPassword") {
        setPasswordDialog({
          isOpen: true,
          noteId: note.id,
          action,
          note: additionalData ? { ...note, ...additionalData } : note,
        });
        setPasswordInput("");
        setPasswordError2("");
      } else {
        // Execute action directly
        switch (action) {
          case "view":
            handleViewNote(note);
            break;
          case "edit":
            handleEditNote(note);
            break;
          case "pin":
            handlePinNote(note.id);
            break;
          case "archive":
            handleArchiveNote(note.id);
            break;
          case "trash":
            handleTrashNote(note.id);
            break;
          case "restore":
            handleRestoreNote(note.id);
            break;
          case "delete":
            handleDeleteNote(note.id);
            break;
          case "setPassword":
            setPasswordDialog({
              isOpen: true,
              noteId: note.id,
              action: "setPassword",
            });
            setPasswordInput("");
            setPasswordError2("");
            break;
          case "removePassword":
            setPasswordDialog({
              isOpen: true,
              noteId: note.id,
              action: "removePassword",
            });
            setPasswordInput("");
            setPasswordError2("");
            break;
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
    ]
  );

  const handleSetPassword = useCallback(
    (note: Note) => {
      executeProtectedAction(note, "setPassword");
    },
    [executeProtectedAction]
  );

  const handleRemovePassword = useCallback(
    (note: Note) => {
      executeProtectedAction(note, "removePassword");
    },
    [executeProtectedAction]
  );

  // Optimized filtered notes with useMemo
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesSearch =
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          );

        const matchesCategory =
          selectedCategory === "all" || note.category === selectedCategory;

        if (activeSection === "home") {
          return (
            matchesSearch &&
            matchesCategory &&
            !note.isArchived &&
            !note.isTrashed
          );
        } else if (activeSection === "archive") {
          return (
            matchesSearch &&
            matchesCategory &&
            note.isArchived &&
            !note.isTrashed
          );
        } else {
          return matchesSearch && matchesCategory && note.isTrashed;
        }
      })
      .sort((a, b) => {
        if (activeSection === "home") {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
        }

        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "category":
            return a.category.localeCompare(b.category);
          default:
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
        }
      });
  }, [notes, searchTerm, selectedCategory, activeSection, sortBy]);



  // Render note content with markdown - memoized for performance
  const renderNoteContent = useMemo(() => {
    return (content: string) => {
      let processedContent = content
  /* ================= CODE BLOCKS (FIRST) ================= */
.replace(/```([\s\S]*?)```/g, (_, code) => {
  const trimmedCode = code.trim();
  let highlightedCode = trimmedCode;
  let language = 'javascript';
  
  // Try to detect language from first line comment
  const firstLine = trimmedCode.split('\n')[0];
  const langMatch = firstLine.match(/^(javascript|python|html|css|typescript|jsx|tsx|json|sql|bash|sh|xml|php|ruby|java|c|cpp)/i);
  
  if (langMatch) {
    language = langMatch[1].toLowerCase();
    // Remove language identifier from code
    highlightedCode = trimmedCode.split('\n').slice(1).join('\n').trim();
  }
  
  try {
    if (hljs.getLanguage(language)) {
      highlightedCode = hljs.highlight(highlightedCode, { language }).value;
    } else {
      highlightedCode = hljs.highlightAuto(highlightedCode).value;
    }
  } catch (e) {
    highlightedCode = trimmedCode.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  
  const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
  
  return `<div class="code-block-wrapper relative mb-4">
    <button class="copy-btn absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors" data-code-id="${codeId}">Copy</button>
    <pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto font-mono text-sm line-numbers pt-10"><code id="${codeId}" class="language-${language} hljs">${highlightedCode}</code></pre>
    
  </div>`;
})



  /* ================= HEADINGS ================= */
  .replace(
    /^### (.*?)$/gm,
    "<h3 class='text-xl font-bold my-4 text-gray-900 dark:text-gray-100'>$1</h3>"
  )
  .replace(
    /^## (.*?)$/gm,
    "<h2 class='text-2xl font-bold my-5 text-gray-900 dark:text-gray-100'>$1</h2>"
  )
  .replace(
    /^# (.*?)$/gm,
    "<h1 class='text-3xl font-bold my-6 text-gray-900 dark:text-gray-100'>$1</h1>"
  )

  /* ================= BLOCKQUOTES ================= */
  .replace(
    /^> (.*?)$/gm,
    "<blockquote class='border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 py-2 rounded-r'>$1</blockquote>"
  )

  /* ================= HORIZONTAL RULE ================= */
  .replace(
    /^(-{3,}|\*{3,}|={3,})$/gm,
    "<hr class='my-6 border-gray-300 dark:border-gray-600' />"
  )

  /* ================= CHECKBOXES ================= */
  .replace(
    /^- \[x\] (.*?)$/gim,
    "<div class='flex items-start gap-2 my-2'><input type='checkbox' checked disabled class='mt-1' /><span class='text-gray-700 dark:text-gray-300 line-through'>$1</span></div>"
  )
  .replace(
    /^- \[ \] (.*?)$/gm,
    "<div class='flex items-start gap-2 my-2'><input type='checkbox' disabled class='mt-1' /><span class='text-gray-700 dark:text-gray-300'>$1</span></div>"
  )

  /* ================= IMAGES ================= */
  .replace(
    /!\[(.*?)\]\((.*?)\)/g,
    "<img src='$2' alt='$1' class='rounded h-auto max-h-160' style='display:inline-block;' />"
  )

  /* ================= LINKS ================= */
  .replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 inline-block">$1</a>'
  )
  // Wrap consecutive badge/image links in a flex container for side-by-side display
  .replace(
    /(<a[^>]*>\s*<img[^>]*>\s*<\/a>\s*)+/g,
    (match) => `<div class='flex flex-wrap items-center gap-2 my-4'>${match.trim()}</div>`
  )

  /* ================= BOLD / ITALIC / STRIKE ================= */
  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  .replace(/~~(.*?)~~/g, "<del>$1</del>")
  .replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, "<em>$1</em>")

  /* ================= INLINE CODE ================= */
  .replace(
    /(?<!`)`([^`\n]+)`(?!`)/g,
    "<code class=\"bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400\">$1</code>"
  )

  /* ================= LIST ITEMS ================= */
  .replace(
    /^[0-9]+\. (.*?)$/gm,
    "<li class='ml-6 list-decimal my-1 text-gray-700 dark:text-gray-300'>$1</li>"
  )
  .replace(
    /^- (.*?)$/gm,
    "<li class='ml-6 list-disc my-1 text-gray-700 dark:text-gray-300'>$1</li>"
  )

      // Handle tables
      const tableRegex =
        /\|(.+)\|\n\|:?-+:?\|(?:\s*:?-+:?\|)*\n((?:\|.+\|\n?)*)/g; // Adjusted regex for better table detection
      processedContent = processedContent.replace(
        tableRegex,
        (match, header, rows) => {
          const headerCells = header
            .split("|")
            .map((cell: string) => cell.trim())
            .filter((cell: string) => cell)
            .map(
              (cell: string) =>
                `<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100">${cell}</th>`
            )
            .join("");

          const rowCells = (rows || "")
            .trim()
            .split("\n")
            .filter((row: string) => row.trim())
            .map((row: string) => {
              const cells = row
                .split("|")
                .map((cell: string) => cell.trim())
                .filter((cell: string) => cell)
                .map(
                  (cell: string) =>
                    `<td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">${cell}</td>`
                )
                .join("");
              return `<tr>${cells}</tr>`;
            })
            .join("");

          return `<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"><thead><tr>${headerCells}</tr></thead><tbody>${rowCells}</tbody></table></div>`;
        }
      );
      // Convert line breaks

      return processedContent;
    };
  }, []);


useEffect(() => {
  // Handle copy button clicks with event delegation
  const handleCopyClick = (e: Event) => {
    const button = e.target as HTMLElement;
    if (button.classList.contains('copy-btn')) {
      const codeId = button.getAttribute('data-code-id');
      const codeElement = document.getElementById(codeId!);
      
      if (codeElement) {
        const code = codeElement.textContent || '';
        
        navigator.clipboard.writeText(code).then(() => {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          button.classList.add('bg-green-600', 'hover:bg-green-700');
          button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
          
          setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-600', 'hover:bg-green-700');
            button.classList.add('bg-blue-600', 'hover:bg-blue-700');
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy code:', err);
        });
      }
    }
  };
  
  document.addEventListener('click', handleCopyClick);
  return () => document.removeEventListener('click', handleCopyClick);
}, []);


  const getSectionTitle = useCallback(() => {
    switch (activeSection) {
      case "home":
        return <>Shared Notes</>;
      case "archive":
        return (
          <>
            <Archive className="inline-block mr-2" /> Archived Notes
          </>
        );
      case "trash":
        return (
          <>
            <Trash className="inline-block mr-2" /> Trash
          </>
        );
      default:
        return null; // Always include a default case in React
    }
  }, [activeSection]);

  const getEmptyStateMessage = useCallback(() => {
    if (searchTerm || selectedCategory !== "all") {
      return "Try adjusting your search or filters";
    }

    switch (activeSection) {
      case "home":
        return "Create your first note to get started";
      case "archive":
        return "No archived notes found";
      case "trash":
        return "Trash is empty";
    }
  }, [searchTerm, selectedCategory, activeSection]);

  const handleSectionChange = useCallback(
    (section: "home" | "archive" | "trash") => {
      setActiveSection(section);
      setIsSheetOpen(false);
    },
    []
  );

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setActiveSection("home");
    setIsSheetOpen(false);
  }, []);

  // Loading state
  useEffect(() => {
    const loadCategories = async () => {
      const categoryManager = CategoryManager.getInstance();
      await categoryManager.loadCategoriesFromFirebase();
      const allCategories = categoryManager.getAllCategories();
      setCategories(allCategories.map((cat) => cat.name));
    };

    loadCategories();

    // Listen for category updates
    const handleCategoryUpdate = () => {
      loadCategories();
    };
    window.addEventListener("categoriesUpdated", handleCategoryUpdate);

    return () => {
      window.removeEventListener("categoriesUpdated", handleCategoryUpdate);
    };
  }, []);

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
        <style>{`
        @keyframes page-2{0%{transform:rotateY(180deg);opacity:0}20%{opacity:1}35%,to{opacity:0}50%,to{transform:rotateY(0deg)}}@keyframes page-3{15%{transform:rotateY(180deg);opacity:0}35%{opacity:1}50%,to{opacity:0}65%,to{transform:rotateY(0deg)}}@keyframes page-4{30%{transform:rotateY(180deg);opacity:0}50%{opacity:1}65%,to{opacity:0}80%,to{transform:rotateY(0deg)}}@keyframes page-5{45%{transform:rotateY(180deg);opacity:0}65%{opacity:1}80%,to{opacity:0}95%,to{transform:rotateY(0deg)}}.loader{--background:linear-gradient(135deg, #23C4F8, #275EFE);--shadow:rgba(39, 94, 254, 0.28);--text:#6C7486;--page:rgba(255, 255, 255, 0.36);--page-fold:rgba(255, 255, 255, 0.52);--duration:3s;width:200px;height:140px;position:relative}.loader:after,.loader:before{--r:-6deg;content:"";position:absolute;bottom:8px;width:120px;top:80%;box-shadow:0 16px 12px var(--shadow);transform:rotate(var(--r))}.loader:before{left:4px}.loader:after{--r:6deg;right:4px}.loader div{width:100%;height:100%;border-radius:13px;position:relative;z-index:1;perspective:600px;box-shadow:0 4px 6px var(--shadow);background-image:var(--background)}.loader div ul{margin:0;padding:0;list-style:none;position:relative}.loader div ul li{--r:180deg;--o:0;--c:var(--page);position:absolute;top:10px;left:10px;transform-origin:100% 50%;color:var(--c);opacity:var(--o);transform:rotateY(var(--r));animation:var(--duration) ease infinite}.loader div ul li:nth-child(2){--c:var(--page-fold);animation-name:page-2}.loader div ul li:nth-child(3){--c:var(--page-fold);animation-name:page-3}.loader div ul li:nth-child(4){--c:var(--page-fold);animation-name:page-4}.loader div ul li:nth-child(5){--c:var(--page-fold);animation-name:page-5}.loader div ul li svg{width:90px;height:120px;display:block}.loader div ul li:first-child{--r:0deg;--o:1}.loader div ul li:last-child{--o:1}.loader span{display:block;left:0;right:0;top:100%;margin-top:20px;text-align:center;color:var(--text)}
      `}</style>
        <div className="text-center">
          <div className="loader">
            <div>
              <ul>
                <li>
                  <svg fill="currentColor" viewBox="0 0 90 120">
                    <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
                  </svg>
                </li>
                <li>
                  <svg fill="currentColor" viewBox="0 0 90 120">
                    <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
                  </svg>
                </li>
                <li>
                  <svg fill="currentColor" viewBox="0 0 90 120">
                    <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
                  </svg>
                </li>
                <li>
                  <svg fill="currentColor" viewBox="0 0 90 120">
                    <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
                  </svg>
                </li>
                <li>
                  <svg fill="currentColor" viewBox="0 0 90 120">
                    <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
                  </svg>
                </li>
                <li>
                  <svg fill="currentColor" viewBox="0 0 90 120">
                    <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
                  </svg>
                </li>
              </ul>
            </div>
            <span>Loading...</span>
          </div>
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
              {/* <p className="text-center"><i>Only I know the Password</i></p> */}
            </div>

            {passwordError && (
              <div className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">
                {passwordError}
              </div>
            )}

            <style>{`
              @import url(https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap);@keyframes orbit{0%{transform:rotate(0deg) translateX(100px) rotate(0deg)}to{transform:rotate(360deg) translateX(100px) rotate(-360deg)}}@keyframes animStar{0%{transform:translateY(0)}to{transform:translateY(-135rem)}}@keyframes animStarRotate{0%{transform:rotate(360deg)}to{transform:rotate(0)}}@keyframes gradient_301{0%,to{background-position:0 50%}50%{background-position:100% 50%}}.btn-space,.btn-space strong{font-family:"Orbitron",sans-serif}#container-stars,.btn-space{overflow:hidden;transition:.5s;backdrop-filter:blur(1rem);border-radius:5rem}.btn-space{display:flex;justify-content:center;align-items:center;width:13rem;height:3rem;background-size:300% 300%;animation:gradient_301 5s ease infinite;border:double 4px transparent;background-image:linear-gradient(#161a25,#161a25),linear-gradient(137.48deg,#f5434f 10%,#631e29 45%,#000 67%,#161a25 87%);background-origin:border-box;background-clip:content-box,border-box;cursor:pointer}#container-stars{z-index:-1;width:100%;height:100%}.btn-space strong{z-index:2;font-size:12px;letter-spacing:5px;color:#fff;text-shadow:0 0 4px #fff}#container-stars,#glow,.circle{position:absolute}#glow{display:flex;width:12rem}.circle{width:30px;height:30px;border-radius:50%;filter:blur(2rem)}.circle:nth-of-type(1){background:rgba(245,67,79,.636);animation:orbit 8s linear infinite}.circle:nth-of-type(2){background:rgba(99,30,41,.704);animation:orbit 10s linear infinite}.btn-space:hover #container-stars{z-index:1;background-color:#161a25}.btn-space:hover{transform:scale(1.1)}.btn-space:active{border:double 4px #631e29;background-origin:border-box;background-clip:content-box,border-box;animation:none}.btn-space:active .circle{background:#631e29}#stars{position:relative;background:0 0;width:200rem;height:200rem}#stars::after,#stars::before{content:"";position:absolute;background-image:radial-gradient(#fff 1px,transparent 1%);background-size:50px 50px}#stars::after{top:-10rem;left:-100rem;width:100%;height:100%;animation:animStarRotate 90s linear infinite}#stars::before{top:0;left:-50%;width:170%;height:500%;animation:animStar 60s linear infinite;opacity:.5}
            `}</style>

            <div className="flex justify-center">
              <button type="submit" className="btn-space">
                <strong>Access Shared Notes</strong>
                <div id="container-stars">
                  <div id="stars" />
                </div>
                <div id="glow">
                  <div className="circle" />
                  <div className="circle" />
                </div>
              </button>
            </div>
            <div className="text-xs text-muted-foreground text-center mt-6 pt-4 border-t">
              <Icon icon="gg:website" className="inline mr-2" />
              Made by{" "}
              <a
                href="http://iamthesakibalhasan.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 "
              >
                <u className="text-blue">Sakib Al Hasan</u>
              </a>
            </div>
          </form>
        </div>
      </div>
    );
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
            <p className="text-xs text-muted-foreground mt-1">
              <Users className="h-4 w-4 mr-2 inline" />
              Everyone can see and edit
            </p>
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
              <h3 className="text-sm font-medium px-4 text-muted-foreground">
                <ChartBarStacked className="h-4 w-4 mr-2 inline" />
                Categories
              </h3>
              <ScrollArea className="h-[calc(100vh-450px)]">
                <div className="pr-2">
                  <ul className="space-y-1">
                    {categories.map((category) => {
                      const categoryData =
                        CategoryManager.getInstance().getCategoryByName(
                          category
                        );
                      return (
                        <li key={category}>
                          <Button
                            variant={
                              selectedCategory === category
                                ? "secondary"
                                : "ghost"
                            }
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setSelectedCategory(category);
                              setActiveSection("home");
                            }}
                          >
                            <div
                              className="mr-2"
                              style={{ color: categoryData?.color }}
                            >
                              {getIconComponent(
                                categoryData?.icon || "Circle",
                                "h-3.5 w-3.5 opacity-70"
                              )}
                            </div>
                            {category}
                            <Badge
                              variant="outline"
                              className="ml-auto text-xs"
                            >
                              {
                                notes.filter(
                                  (n) =>
                                    n.category === category &&
                                    !n.isArchived &&
                                    !n.isTrashed
                                ).length
                              }
                            </Badge>
                          </Button>
                        </li>
                      );
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
              {theme === "dark" ? (
                <Sun className="h-4 w-4 mr-2" />
              ) : (
                <Moon className="h-4 w-4 mr-2" />
              )}
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
              <p className="text-xs text-muted-foreground mt-1">
                <Users className="h-4 w-4 mr-2 inline" />
                Everyone can see and edit
              </p>
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
                      {
                        notes.filter((n) => !n.isArchived && !n.isTrashed)
                          .length
                      }
                    </Badge>
                  </Button>
                </li>
                <li>
                  <Button
                    variant={
                      activeSection === "archive" ? "secondary" : "ghost"
                    }
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
                <h3 className="text-sm font-medium px-4 text-muted-foreground">
                  Categories
                </h3>
                <ul className="space-y-1">
                  {categories.map((category) => {
                    const categoryData =
                      CategoryManager.getInstance().getCategoryByName(category);
                    return (
                      <li key={category}>
                        <Button
                          variant={
                            selectedCategory === category
                              ? "secondary"
                              : "ghost"
                          }
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleCategoryChange(category)}
                        >
                          <div
                            className="mr-2"
                            style={{ color: categoryData?.color }}
                          >
                            {getIconComponent(
                              categoryData?.icon || "Circle",
                              "h-3.5 w-3.5 opacity-70"
                            )}
                          </div>
                          {category}
                          <Badge variant="outline" className="ml-auto text-xs">
                            {
                              notes.filter(
                                (n) =>
                                  n.category === category &&
                                  !n.isArchived &&
                                  !n.isTrashed
                              ).length
                            }
                          </Badge>
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-4 px-2">
                <Button
                  variant="outline"
                  size="default"
                  className="w-full justify-center gap-2 bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary font-medium"
                  onClick={() => {
                    setShowCategoryManager(true);
                    setIsSheetOpen(false);
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
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}
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
                  <h1 className="text-xl font-bold ml-12">
                    {getSectionTitle()}
                  </h1>
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
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                        className="hidden md:flex"
                      >
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
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
            <DialogContent className="max-w-full max-h-[100dvh] h-[100dvh] w-full m-0 p-0 rounded-none border-0 md:rounded-lg md:border">
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
          {/* Save */}
          {/* Note View Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-full max-h-full h-screen w-screen m-0 rounded-none border-0 p-0">
              <div className="flex flex-col sm:size-auto h-[100%] size-auto min-h-[100%] relative">
                <div className="border-b p-4 flex-shrink-0 bg-background">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl font-semibold">
                      {viewingNote?.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditNote(viewingNote!)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit note</TooltipContent>
                      </Tooltip>

                      {!viewingNote?.isTrashed && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleArchiveNote(viewingNote!.id)
                                }
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {viewingNote?.isArchived
                                ? "Unarchive note"
                                : "Archive note"}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleTrashNote(viewingNote!.id)}
                              >
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

                      <Button
                        variant="ghost"
                        onClick={() => setIsViewDialogOpen(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto mb-[30px] sm:w-[100%] w-[100%]">
                  {viewingNote && (
                    <div className="max-w-4xl mx-auto p-6">
                      <div className="flex flex-wrap gap-2 mb-6">
                        <Badge className="bg-primary/10 text-primary">
                          {viewingNote.category}
                        </Badge>
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
                          Created:{" "}
                          {new Date(viewingNote.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Updated:{" "}
                          {new Date(viewingNote.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div
                        className="prose prose-lg dark:prose-invert max-w-100 max-h-0"
                        dangerouslySetInnerHTML={{
                          __html: renderNoteContent(
                            viewingNote.content || "No content"
                          ),
                        }}
                      />

                      {viewingNote.images && viewingNote.images.length > 0 && (
                        <div className="mt-8 space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Images
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {viewingNote.images.map((image, index) => (
                              <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`Image ${index + 1}`}
                                className="w-auto h-auto rounded-lg border shadow-sm"
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
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
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

                  <Select
                    value={sortBy}
                    onValueChange={(value: "date" | "title" | "category") =>
                      setSortBy(value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Sort by Date</SelectItem>
                      <SelectItem value="title">Sort by Title</SelectItem>
                      <SelectItem value="category">Sort by Category</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="hidden sm:flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="flex-1 sm:flex-none"
                    >
                      <LayoutGrid className="h-4 w-4 mr-2 inline" />
                      Grid
                    </Button>

                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="flex-1 sm:flex-none"
                    >
                      <Rows3 className="h-4 w-4 mr-2 inline" />
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
                        filteredNotes.forEach((note) =>
                          handleRestoreNote(note.id)
                        );
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
                        filteredNotes.forEach((note) =>
                          handleDeleteNote(note.id)
                        );
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
                <p className="text-muted-foreground mb-4">
                  {getEmptyStateMessage()}
                </p>
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
                      const note = notes.find((n) => n.id === id);
                      if (note) executeProtectedAction(note, "pin");
                    }}
                    onArchive={(id) => {
                      const note = notes.find((n) => n.id === id);
                      if (note) executeProtectedAction(note, "archive");
                    }}
                    onTrash={(id) => {
                      const note = notes.find((n) => n.id === id);
                      if (note) executeProtectedAction(note, "trash");
                    }}
                    onRestore={(id) => {
                      const note = notes.find((n) => n.id === id);
                      if (note) executeProtectedAction(note, "restore");
                    }}
                    onDelete={(id) => {
                      const note = notes.find((n) => n.id === id);
                      if (note) executeProtectedAction(note, "delete");
                    }}
                    onSetPassword={(note) =>
                      executeProtectedAction(note, "setPassword")
                    }
                    onRemovePassword={(note) =>
                      executeProtectedAction(note, "removePassword")
                    }
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
            setPasswordDialog({ isOpen: false, noteId: "", action: "view" });
            setPasswordInput("");
            setPasswordError("");
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
            <DialogTitle className="text-xl font-semibold mb-2">
              {passwordDialog.action === "setPassword"
                ? "Set Password"
                : passwordDialog.action === "removePassword"
                ? "Remove Password"
                : "Password Required"}
            </DialogTitle>

            <p className="text-muted-foreground mb-4">
              <ShieldCheck className="h-6 w-6 inline" />
              {passwordDialog.action === "setPassword"
                ? "Enter a password to protect this note"
                : passwordDialog.action === "removePassword"
                ? "Enter current password to remove protection"
                : "This note is password protected"}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordSubmit2();
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="notePassword">
                {passwordDialog.action === "setPassword"
                  ? "New Password"
                  : "Password"}
              </Label>
              <Input
                id="notePassword"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={
                  passwordDialog.action === "setPassword"
                    ? "Enter new password"
                    : "Enter password"
                }
                className="text-center"
                autoFocus
              />
            </div>

            {passwordError2 && (
              <div className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">
                {passwordError2}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setPasswordDialog({
                    isOpen: false,
                    noteId: "",
                    action: "view",
                  });
                  setPasswordInput("");
                  setPasswordError("");
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
          const categoryManager = CategoryManager.getInstance();
          const allCategories = categoryManager.getAllCategories();
          setCategories(allCategories.map((cat) => cat.name));
          window.dispatchEvent(new Event("categoriesUpdated"));
        }}
      />
    </TooltipProvider>
  );
}
