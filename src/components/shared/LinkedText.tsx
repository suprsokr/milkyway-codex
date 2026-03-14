import type { ReactNode } from 'react'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'
import { CHAPTER_PAGES } from '../../data/book-chapters.ts'

/**
 * Renders text with "Chapter N" references auto-linked to the book viewer.
 * Handles: "Chapter 25", "Chapters 17, 25 & 26", "(Chapter 25)", etc.
 */
export const LinkedText = ({ text }: { text: string }): ReactNode => {
  // Match "Chapter(s) N" patterns including lists like "17, 25 & 26"
  const pattern = /Chapters?\s+(\d+(?:\s*[,&]\s*\d+)*)/g
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    // Parse chapter numbers from the match
    const nums = match[1].match(/\d+/g)?.map(Number) ?? []
    const isPlural = match[0].startsWith('Chapters')

    // Build linked chapter references
    const chapterParts: ReactNode[] = []
    const fullMatch = match[0]

    // Reconstruct the separators from the original text
    const numPattern = /(\d+)/g
    const separators: string[] = []
    let numMatch: RegExpExecArray | null
    let prevEnd = isPlural ? 9 : 8 // length of "Chapters " or "Chapter "
    while ((numMatch = numPattern.exec(match[1])) !== null) {
      if (numMatch.index > 0) {
        separators.push(match[1].slice(prevEnd, numMatch.index))
      }
      prevEnd = numMatch.index + numMatch[0].length
    }

    chapterParts.push(isPlural ? 'Chapters ' : 'Chapter ')

    nums.forEach((num, i) => {
      if (i > 0 && separators[i - 1]) {
        chapterParts.push(separators[i - 1])
      } else if (i > 0) {
        chapterParts.push(', ')
      }

      const page = CHAPTER_PAGES[num]
      if (page) {
        chapterParts.push(
          <ChapterLink key={`${match!.index}-${num}`} href={`/book?page=${page}`}>
            {num}
          </ChapterLink>,
        )
      } else {
        chapterParts.push(String(num))
      }
    })

    parts.push(<span key={match.index}>{chapterParts}</span>)
    lastIndex = match.index + fullMatch.length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  // If no matches were found, return the original text
  if (parts.length === 0) return <>{text}</>

  return <>{parts}</>
}

const ChapterLink = styled.a`
  color: ${theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
