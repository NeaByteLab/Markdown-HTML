import { tokenType } from '@interfaces/index'
import type { SegmentProcessor, ProcessingContext, ProcessingResult } from '@processors/index'
import { sanitizeUrl } from '@utils/index'

/**
 * Processor for image segments (inline and reference images).
 * @description Processes both inline images ![alt](src) and reference images ![alt][ref].
 */
export class ImagesProcessor implements SegmentProcessor {
  /** Whether to enable URL sanitization */
  private readonly sanitizationEnabled: boolean
  /** Priority for processing order (higher = processed first) */
  priority: number = 5

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
   * @param context - The processing context
   * @returns True if the character is an image marker (![)
   */
  canProcess(char: string, context: ProcessingContext): boolean {
    return char === '!' && context.buffer[context.position + 1] === '['
  }

  /**
   * Processes the segment and returns tokens.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @returns Processing result with tokens and new position
   */
  process(input: string, start: number): ProcessingResult {
    const imageMatch: RegExpMatchArray | null = this.matchImage(input, start)
    if (!imageMatch) {
      return {
        tokens: [],
        newPosition: start,
        consumed: false
      }
    }
    const fullMatch: string = imageMatch[0]
    const altText: string = imageMatch[1] ?? ''
    const rawSrc: string = imageMatch[2] ?? ''
    const title: string = imageMatch[3] ?? ''
    const src: string = sanitizeUrl(rawSrc, this.sanitizationEnabled)
    return {
      tokens: [
        {
          type: tokenType.IMAGE,
          content: fullMatch,
          metadata: {
            alt: altText,
            src,
            title,
            isReference: false
          } as { alt: string; src: string; title: string; isReference: boolean }
        }
      ],
      newPosition: start + fullMatch.length,
      consumed: true
    }
  }

  /**
   * Matches an image pattern in the input string.
   * @param input - The input string to match
   * @param start - The starting position
   * @returns Match result or null
   */
  private matchImage(input: string, start: number): RegExpMatchArray | null {
    const text: string = input.slice(start)
    const inlineImageRegex: RegExp = /^!\[([^\]]*)\]\(([^)\s]*)(?:\s+["']([^"']*)["'])?\)/u
    const inlineMatch: RegExpMatchArray | null = inlineImageRegex.exec(text)
    if (inlineMatch) {
      return inlineMatch
    }
    const referenceImageRegex: RegExp = /^!\[([^\]]*)\]\[([^\]]*)\]/
    const refMatch: RegExpMatchArray | null = referenceImageRegex.exec(text)
    return refMatch
  }
}
