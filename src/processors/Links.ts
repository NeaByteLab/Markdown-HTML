import { tokenType } from '@interfaces/index'
import type { SegmentProcessor, ProcessingResult } from '@processors/index'
import { sanitizeUrl } from '@utils/index'

/**
 * Processor for link segments (inline and reference links).
 * @description Processes both inline links [text](url) and reference links [text][ref].
 */
export class LinksProcessor implements SegmentProcessor {
  /** Whether to enable URL sanitization */
  private readonly sanitizationEnabled: boolean
  /** Priority for processing order (higher = processed first) */
  priority: number = 4

  /**
   * Constructor
   * @param sanitization - Whether to enable URL sanitization (default: false)
   */
  constructor(sanitization: boolean = false) {
    this.sanitizationEnabled = sanitization
  }

  /**
   * Checks if this processor can handle the current character.
   * @param char - The character to check
   * @returns True if the character is a link marker ([)
   */
  canProcess(char: string): boolean {
    return char === '['
  }

  /**
   * Processes the segment and returns tokens.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @returns Processing result with tokens and new position
   */
  process(input: string, start: number): ProcessingResult {
    const linkMatch: RegExpMatchArray | null = this.matchLink(input, start)
    if (!linkMatch) {
      return {
        tokens: [],
        newPosition: start,
        consumed: false
      }
    }
    const fullMatch: string = linkMatch[0]
    const linkText: string = linkMatch[1] ?? ''
    const rawUrl: string = linkMatch[2] ?? ''
    const title: string = linkMatch[3] ?? ''
    const url: string = sanitizeUrl(rawUrl, this.sanitizationEnabled)
    return {
      tokens: [
        {
          type: tokenType.LINK,
          content: fullMatch,
          metadata: {
            text: linkText,
            url,
            title,
            isReference: false
          } as { text: string; url: string; title: string; isReference: boolean }
        }
      ],
      newPosition: start + fullMatch.length,
      consumed: true
    }
  }

  /**
   * Matches a link pattern in the input string.
   * @param input - The input string to match
   * @param start - The starting position
   * @returns Match result or null
   */
  private matchLink(input: string, start: number): RegExpMatchArray | null {
    const text: string = input.slice(start)
    const inlineLinkRegex: RegExp =
      /^\[([^\]]{0,100})\]\(([^)\s]{0,500})(?:\s+["']([^"']{0,100})["'])?\)/u
    const inlineMatch: RegExpMatchArray | null = inlineLinkRegex.exec(text)
    if (inlineMatch) {
      return inlineMatch
    }
    const referenceLinkRegex: RegExp = /^\[([^\]]{0,100})\]\[([^\]]{0,50})\]/
    const refMatch: RegExpMatchArray | null = referenceLinkRegex.exec(text)
    return refMatch
  }
}
