import { tokenType, type SegmentText } from '@interfaces/index'
import type { SegmentProcessor, ProcessingContext, ProcessingResult } from '@processors/index'

/**
 * Processor for inline code segments (single backticks).
 * @description Processes inline code syntax.
 */
export class InlineCodeProcessor implements SegmentProcessor {
  /** Priority for processing order (higher = processed first) */
  priority: number = 3

  /**
   * Checks if this processor can handle the current character.
   * @param char - The character to check
   * @param context - The processing context
   * @returns True if the character is an inline code marker
   */
  canProcess(char: string, context: ProcessingContext): boolean {
    return char === '`' && !this.hasTripleBackticksAtPosition(context.buffer, context.position)
  }

  /**
   * Processes the segment and returns tokens.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @param context - The processing context
   * @returns Processing result with tokens and new position
   */
  process(input: string, start: number, context: ProcessingContext): ProcessingResult {
    const marker: string = '`'
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
    const tokens: SegmentText[] = [{ type: tokenType.INLINE_CODE, content }]
    return {
      tokens,
      newPosition,
      consumed: true
    }
  }

  /**
   * Checks if triple backticks exist at specified position.
   * @param input - The input string to check
   * @param pos - The position to check
   * @returns True if triple backticks exist at position
   */
  private hasTripleBackticksAtPosition(input: string, pos: number): boolean {
    return (
      pos + 2 < input.length &&
      input[pos] === '`' &&
      input[pos + 1] === '`' &&
      input[pos + 2] === '`'
    )
  }
}
