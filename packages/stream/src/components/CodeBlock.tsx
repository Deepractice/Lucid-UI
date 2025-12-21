import * as React from 'react'
import { cn } from '../utils'

export interface CodeBlockProps {
  /**
   * The code content to display
   */
  children: string
  /**
   * Programming language for syntax highlighting
   */
  language?: string
  /**
   * Show line numbers
   */
  showLineNumbers?: boolean
  /**
   * Show copy button
   */
  showCopyButton?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * CodeBlock Component
 *
 * Displays code with syntax highlighting and optional features like
 * line numbers and copy button.
 *
 * @example
 * ```tsx
 * <CodeBlock language="typescript">
 *   const hello = "world"
 * </CodeBlock>
 * ```
 */
export function CodeBlock({
  children,
  language,
  showLineNumbers = false,
  showCopyButton = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = children.split('\n')

  return (
    <div className={cn('relative group rounded-lg overflow-hidden', className)}>
      {/* Header with language label and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-400 text-xs">
        <span>{language || 'text'}</span>
        {showCopyButton && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded hover:bg-gray-700"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      {/* Code content */}
      <div className="bg-gray-900 overflow-x-auto">
        <pre className="p-4 text-sm">
          <code className={`language-${language || 'text'}`}>
            {showLineNumbers ? (
              <table className="border-collapse">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="pr-4 text-gray-500 select-none text-right w-8">
                        {index + 1}
                      </td>
                      <td className="text-gray-100">{line || ' '}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-gray-100">{children}</span>
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}
