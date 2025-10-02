import { tokenType } from '@interfaces/index'
import type { SegmentProcessor, ProcessingContext, ProcessingResult } from '@core/processors/Types'

/**
 * Processor for image segments (inline and reference images).
 * @description Processes both inline images ![alt](src) and reference images ![alt][ref].
 */
export class ImagesProcessor implements SegmentProcessor {
  /** Safe protocols that should be allowed */
  private static readonly SAFE_PROTOCOLS: readonly string[] = Object.freeze(['http:', 'https:'])
  /** Priority for processing order (higher = processed first) */
  priority: number = 5

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
    const src: string = this.sanitizeImageSrc(rawSrc)
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
    const inlineImageRegex: RegExp =
      /^!\[([^\]]{0,100})\]\(([^)\s]{0,500})(?:\s+["']([^"']{0,100})["'])?\)/u
    const inlineMatch: RegExpMatchArray | null = inlineImageRegex.exec(text)
    if (inlineMatch) {
      return inlineMatch
    }
    const referenceImageRegex: RegExp = /^!\[([^\]]{0,100})\]\[([^\]]{0,50})\]/
    const refMatch: RegExpMatchArray | null = referenceImageRegex.exec(text)
    return refMatch
  }

  /**
   * Sanitizes an image source URL for security.
   * @param src - The image source to sanitize
   * @returns Sanitized image source
   */
  private sanitizeImageSrc(src: string): string {
    const lowerSrc: string = src.toLowerCase()
    for (const protocol of ImagesProcessor.SAFE_PROTOCOLS) {
      if (!lowerSrc.startsWith(protocol)) {
        return '#'
      }
    }
    return src
  }
}
