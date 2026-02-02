"use client";

import { useEffect, useCallback } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

export const useRenderNoteContent = () => {
  const renderNoteContent = useCallback((content: string) => {
    let processedContent = content
      /* ================= CODE BLOCKS (FIRST) ================= */
      .replace(/```([\s\S]*?)```/g, (_, code) => {
        const trimmedCode = code.trim();
        let highlightedCode = trimmedCode;
        let language = "javascript";

        const firstLine = trimmedCode.split("\n")[0];
        const langMatch = firstLine.match(
          /^(javascript|python|html|css|typescript|jsx|tsx|json|sql|bash|sh|xml|php|ruby|java|c|cpp)/i
        );

        if (langMatch) {
          language = langMatch[1].toLowerCase();
          highlightedCode = trimmedCode.split("\n").slice(1).join("\n").trim();
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
      .replace(/^### (.*?)$/gm, "<h3 class='text-xl font-bold my-4 text-gray-900 dark:text-gray-100'>$1</h3>")
      .replace(/^## (.*?)$/gm, "<h2 class='text-2xl font-bold my-5 text-gray-900 dark:text-gray-100'>$1</h2>")
      .replace(/^# (.*?)$/gm, "<h1 class='text-3xl font-bold my-6 text-gray-900 dark:text-gray-100'>$1</h1>")

      /* ================= BLOCKQUOTES ================= */
      .replace(
        /^> (.*?)$/gm,
        "<blockquote class='border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 py-2 rounded-r'>$1</blockquote>"
      )

      /* ================= HORIZONTAL RULE ================= */
      .replace(/^(-{3,}|\*{3,}|={3,})$/gm, "<hr class='my-6 border-gray-300 dark:border-gray-600' />")

      /* ================= CHECKBOXES ================= */
      .replace(/^- \[x\] (.*?)$/gim, "<div class='flex items-start gap-2 my-2'><input type='checkbox' checked disabled class='mt-1' /><span class='text-gray-700 dark:text-gray-300 line-through'>$1</span></div>")
      .replace(/^- \[ \] (.*?)$/gm, "<div class='flex items-start gap-2 my-2'><input type='checkbox' disabled class='mt-1' /><span class='text-gray-700 dark:text-gray-300'>$1</span></div>")

      /* ================= IMAGES ================= */
      .replace(/!\[(.*?)\]\((.*?)\)/g, "<img src='$2' alt='$1' class='rounded h-auto max-h-160' style='display:inline-block;' />")

      /* ================= LINKS ================= */
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 inline-block">$1</a>')
      .replace(/(<a[^>]*>\s*<img[^>]*>\s*<\/a>\s*)+/g, (match) => `<div class='flex flex-wrap items-center gap-2 my-4'>${match.trim()}</div>`)

      /* ================= BOLD / ITALIC / STRIKE ================= */
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, "<em>$1</em>")

      /* ================= INLINE CODE ================= */
      .replace(/(?<!`)`([^`\n]+)`(?!`)/g, "<code class=\"bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400\">$1</code>")

      /* ================= LIST ITEMS ================= */
      .replace(/^[0-9]+\. (.*?)$/gm, "<li class='ml-6 list-decimal my-1 text-gray-700 dark:text-gray-300'>$1</li>")
      .replace(/^- (.*?)$/gm, "<li class='ml-6 list-disc my-1 text-gray-700 dark:text-gray-300'>$1</li>");

    // Handle tables
    const tableRegex = /\|(.+)\|\n\|:?-+:?\|(?:\s*:?-+:?\|)*\n((?:\|.+\|\n?)*)/g;
    processedContent = processedContent.replace(tableRegex, (match, header, rows) => {
      const headerCells = header
        .split("|")
        .map((cell: string) => cell.trim())
        .filter((cell: string) => cell)
        .map((cell: string) => `<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100">${cell}</th>`)
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
            .map((cell: string) => `<td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">${cell}</td>`)
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");

      return `<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"><thead><tr>${headerCells}</tr></thead><tbody>${rowCells}</tbody></table></div>`;
    });

    return processedContent;
  }, []);

  useEffect(() => {
    // Handle copy button clicks with event delegation
    const handleCopyClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains("copy-btn")) {
        const codeId = target.getAttribute("data-code-id");
        const codeElement = codeId ? document.getElementById(codeId) : null;

        if (codeElement) {
          const code = codeElement.textContent || "";

          navigator.clipboard.writeText(code).then(() => {
            const originalText = target.textContent;
            target.textContent = "Copied!";
            target.classList.add("bg-green-600", "hover:bg-green-700");
            target.classList.remove("bg-blue-600", "hover:bg-blue-700");

            setTimeout(() => {
              target.textContent = originalText;
              target.classList.remove("bg-green-600", "hover:bg-green-700");
              target.classList.add("bg-blue-600", "hover:bg-blue-700");
            }, 2000);
          }).catch((err) => {
            console.error("Failed to copy code:", err);
          });
        }
      }
    };

    document.addEventListener("click", handleCopyClick);
    return () => document.removeEventListener("click", handleCopyClick);
  }, []);

  return renderNoteContent;
};
