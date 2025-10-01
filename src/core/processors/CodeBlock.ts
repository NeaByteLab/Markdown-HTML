import { tokenType, type SegmentText } from '@interfaces/index'
import type { SegmentProcessor, ProcessingContext, ProcessingResult } from '@core/processors/Types'

/**
 * Processor for code block segments (triple backticks).
 * @description Processes code block syntax.
 */
export class CodeBlockProcessor implements SegmentProcessor {
  /** Priority for processing order (higher = processed first) */
  priority: number = 8

  /**
   * Checks if this processor can handle the current character.
   * @param char - The character to check
   * @param context - The processing context
   * @returns True if the character is a code block marker
   */
  canProcess(char: string, context: ProcessingContext): boolean {
    return char === '`' && this.hasTripleBackticksAtPosition(context.buffer, context.position)
  }

  /**
   * Processes the segment and returns tokens.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @param context - The processing context
   * @returns Processing result with tokens and new position
   */
  process(input: string, start: number, context: ProcessingContext): ProcessingResult {
    const startPos: number = start
    let pos: number = start + 3
    const closingBackticks: number = input.indexOf('```', pos)
    if (closingBackticks === -1 && !context.isEnd) {
      return {
        tokens: [],
        newPosition: input.length,
        consumed: false,
        pendingContent: input.slice(startPos)
      }
    }
    if (closingBackticks === -1 && context.isEnd) {
      pos = input.length
    } else {
      pos = closingBackticks + 3
    }
    const content: string = input.slice(startPos, pos)
    const tokens: SegmentText[] = [{ type: tokenType.CODE_BLOCK, content }]
    return {
      tokens,
      newPosition: pos,
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
