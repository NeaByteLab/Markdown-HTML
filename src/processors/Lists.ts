import { tokenType } from '@interfaces/index'
import type { SegmentProcessor, ProcessingContext, ProcessingResult } from '@processors/index'

/**
 * Processor for list segments (unordered and ordered lists).
 * @description Processes both unordered (- item) and ordered (1. item) lists.
 */
export class ListsProcessor implements SegmentProcessor {
  /** Priority for processing order (higher = processed first) */
  priority: number = 7

  /**
   * Checks if this processor can handle the current character.
   * @param char - The character to check
   * @param context - The processing context
   * @returns True if the character is a list marker
   */
  canProcess(char: string, context: ProcessingContext): boolean {
    return this.isListMarker(char, context)
  }

  /**
   * Processes the segment and returns tokens.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @param context - Processing context
   * @returns Processing result with tokens and new position
   */
  process(input: string, start: number): ProcessingResult {
    const char: string = input[start] ?? ''
    if (char === '-' || char === '*') {
      if (this.isTaskListPattern(input, start)) {
        return this.processTaskList(input, start)
      }
      return this.processUnorderedList(input, start)
    } else if (char >= '0' && char <= '9') {
      return this.processOrderedList(input, start)
    }
    return {
      tokens: [],
      newPosition: start,
      consumed: false
    }
  }

  /**
   * Checks if the current position is a list marker.
   * @param char - The character to check
   * @param context - Processing context
   * @returns True if the character is a list marker
   */
  private isListMarker(char: string, context: ProcessingContext): boolean {
    const isAtValidPosition: boolean = context.isAtLineStart || this.isAfterIndentation(context)
    if (!isAtValidPosition) {
      return false
    }
    if (char === '-' || char === '*') {
      const nextChar: string = context.buffer[context.position + 1] ?? ''
      if (nextChar === ' ') {
        return true
      }
      if (nextChar === '[') {
        const bracketChar: string = context.buffer[context.position + 2] ?? ''
        const closeBracketChar: string = context.buffer[context.position + 3] ?? ''
        const spaceAfterBracket: string = context.buffer[context.position + 4] ?? ''
        return (
          (bracketChar === ' ' || bracketChar === 'x' || bracketChar === 'X') &&
          closeBracketChar === ']' &&
          spaceAfterBracket === ' '
        )
      }
    }
    if (char >= '0' && char <= '9') {
      let pos: number = context.position + 1
      while (
        pos < context.buffer.length &&
        (context.buffer[pos] ?? '') >= '0' &&
        (context.buffer[pos] ?? '') <= '9'
      ) {
        pos++
      }
      const dotChar: string = context.buffer[pos] ?? ''
      const spaceChar: string = context.buffer[pos + 1] ?? ''
      return dotChar === '.' && spaceChar === ' '
    }
    return false
  }

  /**
   * Check if we're positioned after valid indentation (spaces/tabs only)
   * @param context - Processing context
   * @returns True if positioned after indentation
   */
  private isAfterIndentation(context: ProcessingContext): boolean {
    if (context.position === 0) {
      return false
    }
    const prevChar: string = context.buffer[context.position - 1] ?? ''
    if (prevChar !== ' ' && prevChar !== '\t') {
      return false
    }
    return this.checkIndentationFromPosition(context, context.position - 1)
  }

  /**
   * Check indentation from a specific position backwards
   * @param context - Processing context
   * @param startPos - Starting position to check from
   * @returns True if valid indentation found
   */
  private checkIndentationFromPosition(context: ProcessingContext, startPos: number): boolean {
    let pos: number = startPos
    while (pos >= 0) {
      const char: string = context.buffer[pos] ?? ''
      if (char === '\n') {
        return true
      }
      if (char !== ' ' && char !== '\t') {
        return false
      }
      pos--
    }
    return this.validateWhitespaceOnly(context)
  }

  /**
   * Validate that the entire buffer up to position is whitespace only
   * @param context - Processing context
   * @returns True if only whitespace found
   */
  private validateWhitespaceOnly(context: ProcessingContext): boolean {
    let whitespaceCount: number = 0
    for (let i: number = 0; i < context.position; i++) {
      const char: string = context.buffer[i] ?? ''
      if (char === ' ' || char === '\t') {
        whitespaceCount++
      } else {
        return false
      }
    }
    return whitespaceCount > 0
  }

  /**
   * Processes unordered list items.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @param context - Processing context
   * @returns Processing result with list tokens
   */
  private processUnorderedList(input: string, start: number): ProcessingResult {
    const marker: string = input[start] ?? ''
    let pos: number = start + 2
    while (pos < input.length && input[pos] !== '\n') {
      pos++
    }
    const content: string = input.slice(start + 2, pos).trim()
    return {
      tokens: [
        {
          type: tokenType.LIST_ITEM,
          content,
          metadata: {
            listType: 'unordered',
            marker,
            level: this.calculateIndentLevel(input, start)
          }
        }
      ],
      newPosition: pos,
      consumed: true
    }
  }

  /**
   * Processes ordered list items.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @param context - Processing context
   * @returns Processing result with list tokens
   */
  private processOrderedList(input: string, start: number): ProcessingResult {
    let pos: number = start
    while (pos < input.length && (input[pos] ?? '') >= '0' && (input[pos] ?? '') <= '9') {
      pos++
    }
    if (input[pos] === '.' && input[pos + 1] === ' ') {
      pos += 2
    } else {
      return {
        tokens: [],
        newPosition: start,
        consumed: false
      }
    }
    const lineStart: number = pos
    while (pos < input.length && input[pos] !== '\n') {
      pos++
    }
    const content: string = input.slice(lineStart, pos).trim()
    const number: string = input.slice(start, lineStart - 2)
    return {
      tokens: [
        {
          type: tokenType.LIST_ITEM,
          content,
          metadata: {
            listType: 'ordered',
            number,
            level: this.calculateIndentLevel(input, start)
          }
        }
      ],
      newPosition: pos,
      consumed: true
    }
  }

  /**
   * Calculates the indentation level of a list item.
   * @param input - The input string
   * @param start - The starting position
   * @returns The indentation level
   */
  private calculateIndentLevel(input: string, start: number): number {
    let level: number = 0
    let pos: number = start - 1
    while (pos >= 0 && (input[pos] === ' ' || input[pos] === '\t')) {
      if (input[pos] === ' ') {
        level++
      } else if (input[pos] === '\t') {
        level += 4
      }
      pos--
    }
    return Math.floor(level / 4)
  }

  /**
   * Checks if the current position starts a task list pattern.
   * @param input - The input string
   * @param start - The starting position
   * @returns True if this is a task list pattern
   */
  private isTaskListPattern(input: string, start: number): boolean {
    const marker: string = input[start] ?? ''
    const spaceAfterMarker: string = input[start + 1] ?? ''
    const bracketChar: string = input[start + 2] ?? ''
    const checkboxChar: string = input[start + 3] ?? ''
    const closeBracketChar: string = input[start + 4] ?? ''
    const spaceAfterBracket: string = input[start + 5] ?? ''
    return (
      (marker === '-' || marker === '*') &&
      spaceAfterMarker === ' ' &&
      bracketChar === '[' &&
      (checkboxChar === ' ' || checkboxChar === 'x' || checkboxChar === 'X') &&
      closeBracketChar === ']' &&
      spaceAfterBracket === ' '
    )
  }

  /**
   * Processes task list items.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @returns Processing result with task list tokens
   */
  private processTaskList(input: string, start: number): ProcessingResult {
    const marker: string = input[start] ?? ''
    const checkboxChar: string = input[start + 3] ?? ''
    const isChecked: boolean = checkboxChar === 'x' || checkboxChar === 'X'
    let pos: number = start + 6
    while (pos < input.length && input[pos] !== '\n') {
      pos++
    }
    const content: string = input.slice(start + 6, pos).trim()
    return {
      tokens: [
        {
          type: tokenType.TASK_LIST_ITEM,
          content,
          metadata: {
            checked: isChecked,
            listType: 'task',
            marker,
            level: this.calculateIndentLevel(input, start)
          }
        }
      ],
      newPosition: pos,
      consumed: true
    }
  }
}
