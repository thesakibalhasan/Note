"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/atom-one-dark.css"

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div
      className="prose prose-slate dark:prose-invert max-w-none
      prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-6
      prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-3 prose-h2:mt-5
      prose-h3:text-xl prose-h3:font-bold prose-h3:mb-2 prose-h3:mt-4
      prose-p:mb-4 prose-p:leading-7
      prose-ul:list-disc prose-ul:list-inside prose-ul:mb-4
      prose-ol:list-decimal prose-ol:list-inside prose-ol:mb-4
      prose-li:mb-2
      prose-code:bg-gray-200 prose-code:dark:bg-gray-700 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:mb-4
      prose-a:text-blue-600 prose-a:dark:text-blue-400 prose-a:underline prose-a:hover:no-underline
      prose-strong:font-bold prose-strong:text-gray-900 prose-strong:dark:text-white
      prose-em:italic prose-em:text-gray-700 prose-em:dark:text-gray-300
      prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:dark:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:mb-4
      prose-img:rounded prose-img:mb-4
      prose-table:border-collapse prose-table:w-full prose-table:mb-4
      prose-th:border prose-th:border-gray-300 prose-th:dark:border-gray-600 prose-th:p-2 prose-th:bg-gray-100 prose-th:dark:bg-gray-800
      prose-td:border prose-td:border-gray-300 prose-td:dark:border-gray-600 prose-td:p-2
    "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 mt-6" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 mt-5" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 mt-4" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="mb-2" {...props} />,
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono" {...props} />
            ) : (
              <code
                className="block bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto font-mono text-sm mb-4"
                {...props}
              />
            ),
          pre: ({ node, ...props }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto mb-4 font-mono" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-blue-600 dark:text-blue-400 underline hover:no-underline" {...props} />
          ),
          strong: ({ node, ...props }) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-gray-700 dark:text-gray-300" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-4" {...props} />
          ),
          img: ({ node, ...props }) => <img className="rounded mb-4 max-w-full" {...props} />,
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="border-collapse w-full" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 dark:border-gray-600 p-2 bg-gray-100 dark:bg-gray-800" {...props} />
          ),
          td: ({ node, ...props }) => <td className="border border-gray-300 dark:border-gray-600 p-2" {...props} />,
        }}
      >
        {content || "_Nothing to preview_"}
      </ReactMarkdown>
    </div>
  )
}
