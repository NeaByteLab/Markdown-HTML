import {
  tokenType,
  type ProcessingContext,
  type ProcessingResult,
  type SegmentProcessor,
  type SegmentText
} from '@interfaces/index'

/**
 * Processor for header segments (# headers).
 * @description Processes markdown header syntax.
 */
export class HeaderProcessor implements SegmentProcessor {
  /** Priority for processing order (higher = processed first) */
  priority: number = 10

  /**
   * Checks if this processor can handle the current character.
   * @param char - The character to check
   * @param context - The processing context
   * @returns True if the character is a header marker at line start
   */
  canProcess(char: string, context: ProcessingContext): boolean {
    return char === '#' && context.isAtLineStart
  }

  /**
   * Processes the segment and returns tokens.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @param context - The processing context
   * @returns Processing result with tokens and new position
   */
  process(input: string, start: number, context: ProcessingContext): ProcessingResult {
    let endOfHeader: number = input.indexOf('\n', start)
    if (endOfHeader === -1 && !context.isEnd) {
      return {
        tokens: [],
        newPosition: input.length,
        consumed: false,
        pendingContent: input.slice(start)
      }
    }
    if (endOfHeader === -1 && context.isEnd) {
      endOfHeader = input.length
    }
    const content: string = input.slice(start, endOfHeader).trim()
    const tokens: SegmentText[] = [{ type: tokenType.HEADER, content }]
    const newPosition: number = endOfHeader + 1
    if (newPosition < input.length) {
      const nextSpecialChar: number = this.findNextSpecialCharacterPosition(input, newPosition)
      const textEnd: number = nextSpecialChar === -1 ? input.length : nextSpecialChar
      const textContent: string = input.slice(newPosition, textEnd)
      if (textContent.length > 0) {
        tokens.push({ type: tokenType.TEXT, content: textContent })
        return {
          tokens,
          newPosition: textEnd,
          consumed: true
        }
      }
    }
    return {
      tokens,
      newPosition,
      consumed: true
    }
  }

  /**
   * Finds the position of the next special markdown character.
   * @param input - The input string to search
   * @param start - The starting position
   * @returns Position of next special character or -1 if not found
   */
  private findNextSpecialCharacterPosition(input: string, start: number): number {
    let pos: number = start
    while (pos < input.length) {
      const char: string = input[pos] ?? ''
      const isAtLineStart: boolean = pos === 0 || input[pos - 1] === '\n'
      if (
        (char === '#' && isAtLineStart) ||
        (char === '`' && this.hasTripleBackticksAtPosition(input, pos)) ||
        char === '*' ||
        char === '_' ||
        char === '`' ||
        char === '[' ||
        char === '!' ||
        char === '-' ||
        char === '|' ||
        char === '>' ||
        (char >= '0' && char <= '9' && isAtLineStart)
      ) {
        return pos
      }
      pos++
    }
    return -1
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
