import { tokenType } from '@interfaces/index'
import type { SegmentProcessor, ProcessingContext, ProcessingResult } from '@processors/index'

/**
 * Processor for horizontal rules (---, ***, ___)
 * @description Handles detection and processing of horizontal rule patterns
 */
export class HorizontalRuleProcessor implements SegmentProcessor {
  /** Priority for processing order (higher = processed first) */
  priority: number = 9

  /**
   * Check if the current character can start a horizontal rule
   * @param char - Current character
   * @param context - Processing context
   * @returns True if character can start a horizontal rule
   */
  canProcess(char: string, context: ProcessingContext): boolean {
    if (!this.isAtLineStart(context) || !this.isHorizontalRuleMarker(char)) {
      return false
    }
    const remainingChars: number = context.buffer.length - context.position
    if (remainingChars < 3) {
      return false
    }
    const char1: string = context.buffer[context.position] ?? ''
    const char2: string = context.buffer[context.position + 1] ?? ''
    const char3: string = context.buffer[context.position + 2] ?? ''
    if (char1 !== char2 || char2 !== char3) {
      return false
    }
    const afterMarkers: string = context.buffer.slice(context.position + 3)
    if (afterMarkers && afterMarkers.trim() !== '' && !afterMarkers.startsWith('\n')) {
      return false
    }
    return true
  }

  /**
   * Process horizontal rule pattern
   * @param input - Input text
   * @param start - Start position
   * @returns Processing result
   */
  process(input: string, start: number): ProcessingResult {
    const horizontalRuleMatch: RegExpMatchArray | null = this.matchHorizontalRule(input, start)
    if (!horizontalRuleMatch) {
      return {
        tokens: [],
        newPosition: start,
        consumed: false
      }
    }
    const fullMatch: string = horizontalRuleMatch[0]
    const marker: string = horizontalRuleMatch[1] ?? ''
    return {
      tokens: [
        {
          type: tokenType.HORIZONTAL_RULE,
          content: fullMatch,
          metadata: {
            marker: marker as '-' | '*' | '_'
          }
        }
      ],
      newPosition: start + fullMatch.length,
      consumed: true
    }
  }

  /**
   * Check if character is a horizontal rule marker
   * @param char - Character to check
   * @returns True if character is a horizontal rule marker
   */
  private isHorizontalRuleMarker(char: string): boolean {
    return char === '-' || char === '*' || char === '_'
  }

  /**
   * Check if we're at the start of a line
   * @param context - Processing context
   * @returns True if at line start
   */
  private isAtLineStart(context: ProcessingContext): boolean {
    return context.isAtLineStart || context.position === 0
  }

  /**
   * Match horizontal rule pattern
   * @param input - Input text
   * @param start - Start position
   * @returns Regex match result or null
   */
  private matchHorizontalRule(input: string, start: number): RegExpMatchArray | null {
    const slicedInput: string = input.slice(start)
    const lineEnd: number = slicedInput.indexOf('\n')
    const lineToCheck: string = lineEnd === -1 ? slicedInput : slicedInput.slice(0, lineEnd)
    const beforeMatch: string = input.slice(0, start)
    const lastNewline: number = beforeMatch.lastIndexOf('\n')
    const lineStart: number = lastNewline === -1 ? 0 : lastNewline + 1
    const lineContent: string = input.slice(lineStart, start)
    if (!/^\s*$/.test(lineContent)) {
      return null
    }
    const trimmed: string = lineToCheck.trim()
    if (this.isHorizontalRulePattern(trimmed)) {
      const marker: string = trimmed[0] ?? '-'
      return [lineToCheck, marker] as RegExpMatchArray
    }
    return null
  }

  /**
   * Check if string is a valid horizontal rule pattern
   * @param str - String to check
   * @returns True if valid horizontal rule pattern
   */
  private isHorizontalRulePattern(str: string): boolean {
    if (str.length < 3) {
      return false
    }
    const firstChar: string = str[0] ?? ''
    if (firstChar !== '-' && firstChar !== '*' && firstChar !== '_') {
      return false
    }
    for (let i: number = 1; i < str.length; i++) {
      if (str[i] !== firstChar) {
        return false
      }
    }
    return true
  }
}
