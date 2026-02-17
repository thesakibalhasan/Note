"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Edit,
  Trash2,
  Archive,
  RotateCcw,
  Calendar,
  Tag,
  Lock,
  Key,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { MarkdownPreview } from "@/components/markdown-preview";
import {
  updateNote,
  deleteNote,
  setNotePassword,
  removeNotePassword,
  getLockedNoteContent,
} from "@/lib/firebase-service";

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

export default function NotePreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (!searchParams) {
    return <div>Loading...</div>;
  }
  const noteId = searchParams.get("id");

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordDialog, setPasswordDialog] = useState<{
    isOpen: boolean;
    action: "unlock" | "setPassword" | "removePassword";
  }>({
    isOpen: false,
    action: "unlock",
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Fetch note data
  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) {
        router.push("/");
        return;
      }

      try {
        // TODO: Implement getNoteById function in firebase-service or fetch from your data source
        // For now, this will need to be implemented based on your Firebase setup
        setLoading(false);
        router.push("/");
      } catch (error) {
        console.error("Error fetching note:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId, router]);

  const verifyPassword = useCallback(
    (inputPassword: string): boolean => {
      if (!note?.isPasswordProtected || !note.password) {
        return true;
      }
      return note.password === inputPassword;
    },
    [note]
  );

  const handlePasswordSubmit = useCallback(async () => {
    if (!note) return;

    if (passwordDialog.action === "setPassword") {
      if (!passwordInput.trim()) {
        setPasswordError("Please enter a password");
        return;
      }
      try {
        await setNotePassword(note.id, passwordInput);
        setNote({ ...note, isPasswordProtected: true, password: passwordInput });
        setPasswordDialog({ isOpen: false, action: "unlock" });
        setPasswordInput("");
        setPasswordError("");
      } catch (error) {
        setPasswordError("Failed to set password");
      }
      return;
    }

    if (passwordDialog.action === "removePassword") {
      if (!verifyPassword(passwordInput)) {
        setPasswordError("Incorrect password");
        return;
      }
      try {
        await removeNotePassword(note.id);
        setNote({ ...note, isPasswordProtected: false, password: undefined });
        setPasswordDialog({ isOpen: false, action: "unlock" });
        setPasswordInput("");
        setPasswordError("");
      } catch (error) {
        setPasswordError("Failed to remove password");
      }
      return;
    }

    if (!verifyPassword(passwordInput)) {
      setPasswordError("Incorrect password");
      return;
    }

    // Unlock the note
    try {
      const fullContent = await getLockedNoteContent(note.id);
      setNote({ ...note, content: fullContent });
    } catch (error) {
      setPasswordError("Failed to load note content");
      return;
    }

    setPasswordDialog({ isOpen: false, action: "unlock" });
    setPasswordInput("");
    setPasswordError("");
  }, [note, passwordDialog.action, passwordInput, verifyPassword]);

  const handleEdit = useCallback(() => {
    router.push(`/?edit=${note?.id}`);
  }, [note?.id, router]);

  const handleArchive = useCallback(async () => {
    if (!note) return;
    try {
      await updateNote(note.id, {
        isArchived: !note.isArchived,
        isTrashed: false,
        isPinned: false,
      });
      setNote({
        ...note,
        isArchived: !note.isArchived,
        isTrashed: false,
        isPinned: false,
      });
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }, [note]);

  const handleTrash = useCallback(async () => {
    if (!note) return;
    try {
      await updateNote(note.id, {
        isTrashed: true,
        isArchived: false,
        isPinned: false,
      });
      router.push("/");
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }, [note, router]);

  const handleRestore = useCallback(async () => {
    if (!note) return;
    try {
      await updateNote(note.id, { isTrashed: false, isArchived: false });
      setNote({ ...note, isTrashed: false, isArchived: false });
    } catch (error) {
      console.error("Error restoring note:", error);
    }
  }, [note]);

  const handleDelete = useCallback(async () => {
    if (!note) return;
    try {
      await deleteNote(note.id);
      router.push("/");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }, [note, router]);

  // Render note content with markdown - memoized for performance
  const renderNoteContent = useMemo(() => {
    return (content: string) => {
      let processedContent = content
        /* ================= CODE BLOCKS (FIRST) ================= */
        .replace(/```([\s\S]*?)```/g, (_, code) => {
          return `<pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto mb-4 font-mono text-sm"><code>${code
            .replace(/</g, "<")
            .replace(/>/g, ">")
            .trim()}</code></pre>`;
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
          /^(-{3,}|\*{3,})$/gm,
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
          "<img src='$2' alt='$1' class='rounded my-4 max-w-full' />"
        )

        /* ================= LINKS ================= */
        .replace(
          /\[(.*?)\]\((.*?)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">$1</a>'
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
        );

      // Handle tables
      const tableRegex =
        /\|(.+)\|\n\|:?-+:?\|(?:\s*:?-+:?\|)*\n((?:\|.+\|\n?)*)/g;
      processedContent = processedContent.replace(
        tableRegex,
        (match, header, separator, rows) => {
          const headerCells = header
            .split("|")
            .map((cell: string) => cell.trim())
            .filter((cell: string) => cell)
            .map(
              (cell: string) =>
                `<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100">${cell}</th>`
            )
            .join("");

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
                    `<td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">${cell}</td>`
                )
                .join("");
              return `<tr>${cells}</tr>`;
            })
            .join("");

          return `<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"><thead><tr>${headerCells}</tr></thead><tbody>${rowCells}</tbody></table></div>`;
        }
      );

      return processedContent;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Note not found</h1>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  const displayContent = note.isPasswordProtected
    ? "•••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• ••••••"
    : note.content;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">
                    {note.isPasswordProtected ? (
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        {note.title}
                      </div>
                    ) : (
                      note.title
                    )}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {note.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!note.isTrashed && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleEdit}
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
                          onClick={() =>
                            note.isPasswordProtected
                              ? setPasswordDialog({
                                  isOpen: true,
                                  action: "removePassword",
                                })
                              : setPasswordDialog({
                                  isOpen: true,
                                  action: "setPassword",
                                })
                          }
                        >
                          <ShieldCheck className="h-4 w-4" />
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
                          onClick={handleArchive}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {note.isArchived ? "Unarchive note" : "Archive note"}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleTrash}
                        >
                          <Trash2 className="h-4 w-4" />
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
                          onClick={handleRestore}
                          className="text-green-600 hover:text-green-700"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Restore note</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleDelete}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete permanently</TooltipContent>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-primary/10 text-primary">
              {note.category}
            </Badge>
            {note.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="text-sm text-muted-foreground mb-6 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Updated: {new Date(note.updatedAt).toLocaleDateString()}
            </span>
          </div>

          {note.isPasswordProtected && !note.content.includes("••••••") ? (
            <div className="max-w-4xl mx-auto">
              <MarkdownPreview content={note.content} />
            </div>
          ) : (
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: renderNoteContent(displayContent || "No content"),
              }}
            />
          )}

          {note.images && note.images.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {note.images.map((image, index) => (
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

        {/* Password Dialog */}
        <Dialog
          open={passwordDialog.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              setPasswordDialog({ isOpen: false, action: "unlock" });
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
                ) : passwordDialog.action === "removePassword" ? (
                  <ShieldCheck className="h-8 w-8 text-primary" />
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
                handlePasswordSubmit();
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

              {passwordError && (
                <div className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">
                  {passwordError}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setPasswordDialog({ isOpen: false, action: "unlock" });
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
      </div>
    </TooltipProvider>
  );
}
