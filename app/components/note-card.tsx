"use client";

import React, { useState } from "react";
import { Note } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MoreVertical,
} from "lucide-react";

interface NoteCardProps {
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
}

export const NoteCard = React.memo(
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
  }: NoteCardProps) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const displayContent = note.isPasswordProtected
      ? "•••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• ••••••"
      : note.content;

    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              className={`group cursor-pointer hover:shadow-lg transition-all duration-200 relative ${
                note.isPinned ? "border-primary" : ""
              } ${note.isTrashed ? "opacity-75" : ""} ${
                note.isPasswordProtected
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
                                className={`h-3 w-3 ${
                                  note.isPinned
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
                  className={`text-sm text-muted-foreground line-clamp-3 ${
                    note.isPasswordProtected ? "blur-sm select-none" : ""
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
                      className={`h-4 w-4 ${
                        note.isPinned ? "fill-primary text-primary" : ""
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

NoteCard.displayName = "NoteCard";
