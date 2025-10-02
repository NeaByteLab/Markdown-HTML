import { tokenType } from '@interfaces/index'
import type { SegmentProcessor, ProcessingContext, ProcessingResult } from '@processors/index'

/**
 * Processor for strikethrough segments (~~strikethrough~~).
 * @description Processes GitHub Flavored Markdown strikethrough syntax.
 */
export class StrikethroughProcessor implements SegmentProcessor {
  /** Priority for processing order (higher = processed first) */
  priority: number = 2.5

  /**
   * Checks if this processor can handle the current character.
   * @param char - The character to check
   * @param context - The processing context
   * @returns True if the character is a strikethrough marker
   */
  canProcess(char: string, context: ProcessingContext): boolean {
    return char === '~' && this.isStrikethroughMarker(context)
  }

  /**
   * Checks if the current position starts a strikethrough marker.
   * @param context - The processing context
   * @returns True if this is a strikethrough marker
   */
  private isStrikethroughMarker(context: ProcessingContext): boolean {
    const nextChar: string = context.buffer[context.position + 1] ?? ''
    return nextChar === '~'
  }

  /**
   * Processes the segment and returns tokens.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @returns Processing result with tokens and new position
   */
  process(input: string, start: number): ProcessingResult {
    const char: string = input[start] ?? ''
    if (char === '~' && this.isStrikethrough(input, start)) {
      return this.processStrikethrough(input, start)
    } else {
      return {
        tokens: [],
        newPosition: start,
        consumed: false
      }
    }
  }

  /**
   * Processes strikethrough segments (double tildes).
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @returns Processing result with tokens and new position
   */
  private processStrikethrough(input: string, start: number): ProcessingResult {
    const endPos: number = this.findStrikethroughEnd(input, start + 2)
    if (endPos === -1) {
      return {
        tokens: [],
        newPosition: start,
        consumed: false
      }
    }
    const content: string = input.slice(start + 2, endPos)
    const fullMatch: string = input.slice(start, endPos + 2)
    return {
      tokens: [
        {
          type: tokenType.STRIKETHROUGH,
          content: fullMatch,
          metadata: {
            marker: '~~',
            text: content
          }
        }
      ],
      newPosition: endPos + 2,
      consumed: true
    }
  }

  /**
   * Checks if the current position starts a strikethrough segment.
   * @param input - The input string
   * @param start - The starting position
   * @returns True if this is a strikethrough segment
   */
  private isStrikethrough(input: string, start: number): boolean {
    const nextChar: string = input[start + 1] ?? ''
    if (nextChar !== '~') {
      return false
    }
    const endPos: number = this.findStrikethroughEnd(input, start + 2)
    return endPos !== -1
  }

  /**
   * Finds the end position of a strikethrough segment.
   * @param input - The input string
   * @param start - The starting position (after ~~)
   * @returns The end position or -1 if not found
   */
  private findStrikethroughEnd(input: string, start: number): number {
    let pos: number = start
    while (pos < input.length - 1) {
      if (input[pos] === '~' && input[pos + 1] === '~') {
        return pos
      }
      pos++
    }
    return -1
  }
}
