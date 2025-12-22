import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Fix incomplete markdown for streaming scenarios
 * Handles unclosed code blocks, bold, italic, etc.
 *
 * @deprecated Streamdown now handles this automatically via Remend.
 * This function is kept for backward compatibility.
 */
export function healMarkdown(content: string): string {
  let result = content

  // Count backticks for code blocks
  const codeBlockMatches = result.match(/```/g)
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    // Unclosed code block - add closing
    result += '\n```'
  }

  // Count inline code backticks
  const inlineCodeMatches = result.match(/(?<!`)`(?!`)/g)
  if (inlineCodeMatches && inlineCodeMatches.length % 2 !== 0) {
    result += '`'
  }

  // Count bold markers (**)
  const boldMatches = result.match(/\*\*/g)
  if (boldMatches && boldMatches.length % 2 !== 0) {
    result += '**'
  }

  // Count italic markers (single *)
  // This is tricky because * is also used in lists
  const italicMatches = result.match(/(?<!\*)\*(?!\*)/g)
  if (italicMatches && italicMatches.length % 2 !== 0) {
    result += '*'
  }

  return result
}
