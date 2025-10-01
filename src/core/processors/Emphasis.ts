import { tokenType, type SegmentText } from '@interfaces/index'
import type { SegmentProcessor, ProcessingContext, ProcessingResult } from '@core/processors/Types'

/**
 * Processor for emphasis segments (*italic*, **bold**, ***bold italic***).
 * @description Processes markdown emphasis syntax.
 */
export class EmphasisProcessor implements SegmentProcessor {
  /** Priority for processing order (higher = processed first) */
  priority: number = 2

  /**
   * Checks if this processor can handle the current character.
   * @param char - The character to check
   * @returns True if the character is an emphasis marker
   */
  canProcess(char: string): boolean {
    return char === '*' || char === '_'
  }

  /**
   * Processes the segment and returns tokens.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @param context - The processing context
   * @returns Processing result with tokens and new position
   */
  process(input: string, start: number, context: ProcessingContext): ProcessingResult {
    const char: string = input[start] ?? ''
    if (char === '*' && this.isBoldItalic(input, start)) {
      return this.processBoldItalic(input, start, context)
    } else if (char === '*' && this.isBold(input, start)) {
      return this.processBold(input, start, context)
    } else if (char === '*' || char === '_') {
      return this.processItalic(input, start, context)
    } else {
      return {
        tokens: [],
        newPosition: start,
        consumed: false
      }
    }
  }

  /**
   * Processes bold italic segments (triple asterisks).
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @param context - The processing context
   * @returns Processing result with tokens and new position
   */
  private processBoldItalic(
    input: string,
    start: number,
    context: ProcessingContext
  ): ProcessingResult {
    const marker: string = '***'
    const pos: number = start + 3
    const closingMarker: number = input.indexOf(marker, pos)
    if (closingMarker === -1 && !context.isEnd) {
      return {
        tokens: [],
        newPosition: input.length,
        consumed: false,
        pendingContent: input.slice(start)
      }
    }
    if (closingMarker === -1 && context.isEnd) {
      return {
        tokens: [{ type: tokenType.TEXT, content: input.slice(start) }],
        newPosition: input.length,
        consumed: true
      }
    }
    const newPosition: number = closingMarker + 3
    const content: string = input.slice(start, newPosition)
    const innerContent: string = content.slice(3, -3).trim()
    if (!innerContent) {
      return {
        tokens: [{ type: tokenType.TEXT, content }],
        newPosition,
        consumed: true
      }
    }
    const tokens: SegmentText[] = [{ type: tokenType.EMPHASIS, content }]
    return {
      tokens,
      newPosition,
      consumed: true
    }
  }

  /**
   * Processes bold segments (double asterisks).
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @param context - The processing context
   * @returns Processing result with tokens and new position
   */
  private processBold(input: string, start: number, context: ProcessingContext): ProcessingResult {
    const marker: string = '**'
    const pos: number = start + 2
    const closingMarker: number = input.indexOf(marker, pos)
    if (closingMarker === -1 && !context.isEnd) {
      return {
        tokens: [],
        newPosition: input.length,
        consumed: false,
        pendingContent: input.slice(start)
      }
    }
    if (closingMarker === -1 && context.isEnd) {
      return {
        tokens: [{ type: tokenType.TEXT, content: input.slice(start) }],
        newPosition: input.length,
        consumed: true
      }
    }
    const newPosition: number = closingMarker + 2
    const content: string = input.slice(start, newPosition)
    const innerContent: string = content.slice(2, -2).trim()
    if (!innerContent) {
      return {
        tokens: [{ type: tokenType.TEXT, content }],
        newPosition,
        consumed: true
      }
    }
    const tokens: SegmentText[] = [{ type: tokenType.EMPHASIS, content }]
    return {
      tokens,
      newPosition,
      consumed: true
    }
  }

  /**
   * Processes italic segments (single asterisk or underscore).
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @param context - The processing context
   * @returns Processing result with tokens and new position
   */
  private processItalic(
    input: string,
    start: number,
    context: ProcessingContext
  ): ProcessingResult {
    const char: string = input[start] ?? ''
    const marker: string = char
    const pos: number = start + 1
    const closingMarker: number = input.indexOf(marker, pos)
    if (closingMarker === -1 && !context.isEnd) {
      return {
        tokens: [],
        newPosition: input.length,
        consumed: false,
        pendingContent: input.slice(start)
      }
    }
    if (closingMarker === -1 && context.isEnd) {
      return {
        tokens: [{ type: tokenType.TEXT, content: input.slice(start) }],
        newPosition: input.length,
        consumed: true
      }
    }
    const newPosition: number = closingMarker + 1
    const content: string = input.slice(start, newPosition)
    const tokens: SegmentText[] = [{ type: tokenType.EMPHASIS, content }]
    return {
      tokens,
      newPosition,
      consumed: true
    }
  }

  /**
   * Checks if the current position has bold italic markers.
   * @param input - The input string to check
   * @param pos - The position to check
   * @returns True if bold italic markers exist at the position
   */
  private isBoldItalic(input: string, pos: number): boolean {
    return (
      pos + 2 < input.length &&
      input[pos] === '*' &&
      input[pos + 1] === '*' &&
      input[pos + 2] === '*'
    )
  }

  /**
   * Checks if the current position has bold markers.
   * @param input - The input string to check
   * @param pos - The position to check
   * @returns True if bold markers exist at the position
   */
  private isBold(input: string, pos: number): boolean {
    return pos + 1 < input.length && input[pos] === '*' && input[pos + 1] === '*'
  }
}
