import {
  tokenType,
  type ProcessingContext,
  type ProcessingResult,
  type SegmentProcessor
} from '@interfaces/index'

/**
 * Processor for escaped characters in markdown text.
 * @description Handles backslash-escaped characters like \*, \_, \`, etc.
 */
export class EscapedCharProcessor implements SegmentProcessor {
  /** Priority for processing order (higher = processed first) */
  priority: number = 15

  /**
   * Checks if this processor can handle the current character.
   * @param char - The character to check
   * @param context - The processing context
   * @returns True if the character is a backslash
   */
  canProcess(char: string, context?: ProcessingContext): boolean {
    if (char !== '\\') {
      return false
    }
    if (context) {
      let pos: number = context.position
      while (pos < context.buffer.length && context.buffer[pos] === '\\') {
        pos++
      }
      return pos > context.position
    }
    return true
  }

  /**
   * Processes escaped characters and returns tokens.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @returns Processing result with tokens and new position
   */
  process(input: string, start: number): ProcessingResult {
    if (input[start] !== '\\') {
      return {
        tokens: [],
        newPosition: start,
        consumed: false
      }
    }
    let pos: number = start
    let processedText: string = ''
    while (pos < input.length && input[pos] === '\\') {
      if (pos + 1 >= input.length) {
        processedText += '\\'
        pos++
        break
      }
      const nextChar: string = input[pos + 1] ?? ''
      if (this.isEscapableCharacter(nextChar)) {
        processedText += nextChar
        pos += 2
      } else {
        processedText += '\\'
        pos++
        break
      }
    }
    return {
      tokens: [
        {
          type: tokenType.TEXT,
          content: processedText
        }
      ],
      newPosition: pos,
      consumed: true
    }
  }

  /**
   * Checks if a character can be escaped.
   * @param char - The character to check
   * @returns True if the character is escapable
   */
  private isEscapableCharacter(char: string): boolean {
    const escapableChars: string = '*_`[](){}#+\\-.!|'
    return escapableChars.includes(char)
  }
}
