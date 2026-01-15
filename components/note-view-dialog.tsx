import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Calendar, Archive, Trash, RotateCcw, Download, Edit } from "lucide-react";

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

export default function NoteViewDialog({
  open,
  onOpenChange,
  viewingNote,
  onEdit,
  onDownload,
  onArchive,
  onTrash,
  onRestore,
  onDelete,
  renderNoteContent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewingNote: Note | null;
  onEdit: (note: Note) => void;
  onDownload: (note: Note, format: "txt" | "pdf" | "csv") => void;
  onArchive: (id: string) => void;
  onTrash: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  renderNoteContent: (content: string) => string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full max-h-full h-screen w-screen m-0 rounded-none border-0 p-0">
        <div className="flex flex-col h-full">
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
                      onClick={() => viewingNote && onEdit(viewingNote)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit note</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => viewingNote && onDownload(viewingNote, "txt")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save note</TooltipContent>
                </Tooltip>

                {!viewingNote?.isTrashed && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewingNote && onArchive(viewingNote.id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {viewingNote?.isArchived ? "Unarchive note" : "Archive note"}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewingNote && onTrash(viewingNote.id)}
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
                        onClick={() => viewingNote && onRestore(viewingNote.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Restore note</TooltipContent>
                  </Tooltip>
                )}

                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
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
                  className="prose prose-lg dark:prose-invert max-w-100 max-h-0"
                  dangerouslySetInnerHTML={{ __html: renderNoteContent(viewingNote.content || "No content") }}
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
  );
}
