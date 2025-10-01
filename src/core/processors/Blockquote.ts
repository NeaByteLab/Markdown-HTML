import { tokenType } from '@interfaces/index'
import type { SegmentProcessor, ProcessingContext, ProcessingResult } from '@core/processors/Types'

/**
 * Processor for blockquote segments (> blockquotes).
 * @description Processes markdown blockquote syntax.
 */
export class BlockquoteProcessor implements SegmentProcessor {
  /** Priority for processing order (higher = processed first) */
  priority: number = 9

  /**
   * Checks if this processor can handle the current character.
   * @param char - The character to check
   * @param context - The processing context
   * @returns True if the character is a blockquote marker at line start
   */
  canProcess(char: string, context: ProcessingContext): boolean {
    return char === '>' && context.isAtLineStart
  }

  /**
   * Processes the segment and returns tokens.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @param context - The processing context
   * @returns Processing result with tokens and new position
   */
  process(input: string, start: number): ProcessingResult {
    const { level, content, endPos }: { level: number; content: string; endPos: number } =
      this.parseBlockquoteLine(input, start)
    if (level === 0) {
      return {
        tokens: [],
        newPosition: start,
        consumed: false
      }
    }
    const { fullContent, finalEndPos }: { fullContent: string; finalEndPos: number } =
      this.collectBlockquoteContent(input, content, endPos, level)
    return {
      tokens: [
        {
          type: tokenType.BLOCKQUOTE,
          content: fullContent.trim(),
          metadata: { level: Math.min(level, 6) }
        }
      ],
      newPosition: finalEndPos,
      consumed: true
    }
  }

  /**
   * Parses a single blockquote line to extract level and content.
   * @param input - The input string
   * @param start - The starting position
   * @returns Object with level, content, and end position
   */
  private parseBlockquoteLine(
    input: string,
    start: number
  ): { level: number; content: string; endPos: number } {
    let endOfLine: number = input.indexOf('\n', start)
    if (endOfLine === -1) {
      endOfLine = input.length
    }
    const line: string = input.slice(start, endOfLine)
    if (!line.startsWith('>')) {
      return { level: 0, content: '', endPos: start }
    }
    const { level, content }: { level: number; content: string } = this.extractBlockquoteInfo(line)
    return { level, content, endPos: endOfLine }
  }

  /**
   * Extracts blockquote level and content from a line.
   * @param line - The line to parse
   * @returns Object with level and content
   */
  private extractBlockquoteInfo(line: string): { level: number; content: string } {
    let level: number = 0
    let pos: number = 0
    while (pos < line.length && line[pos] === '>' && level < 6) {
      level++
      pos++
    }
    while (pos < line.length && (line[pos] === ' ' || line[pos] === '\t')) {
      pos++
    }
    const content: string = line.slice(pos)
    return { level, content }
  }

  /**
   * Collects content from continuation lines of a blockquote.
   * @param input - The input string
   * @param initialContent - The initial content
   * @param startPos - The starting position
   * @param currentLevel - The current blockquote level
   * @returns The full collected content
   */
  private collectBlockquoteContent(
    input: string,
    initialContent: string,
    startPos: number,
    currentLevel: number
  ): { fullContent: string; finalEndPos: number } {
    let endPos: number = startPos
    let fullContent: string = initialContent
    while (endPos < input.length) {
      const nextLineStart: number = endPos + 1
      if (nextLineStart >= input.length) {
        break
      }
      const nextLine: string = this.getNextLine(input, nextLineStart)
      if (!this.shouldContinueProcessing(nextLine, currentLevel)) {
        break
      }
      const { level, content }: { level: number; content: string } =
        this.extractBlockquoteInfo(nextLine)

      if (!this.shouldCollectLine(level, content, currentLevel)) {
        break
      }
      fullContent += this.formatLineContent(content)
      endPos = this.getNextEndPos(input, nextLineStart)
    }
    return { fullContent, finalEndPos: endPos }
  }

  /**
   * Gets the next line from input.
   * @param input - The input string
   * @param startPos - Starting position
   * @returns The next line
   */
  private getNextLine(input: string, startPos: number): string {
    const nextLineEnd: number = input.indexOf('\n', startPos)
    return nextLineEnd === -1 ? input.slice(startPos) : input.slice(startPos, nextLineEnd)
  }

  /**
   * Checks if processing should continue.
   * @param line - The line to check
   * @param currentLevel - Current blockquote level
   * @returns True if processing should continue
   */
  private shouldContinueProcessing(line: string, currentLevel: number): boolean {
    if (!line.startsWith('>')) {
      return false
    }
    const { level }: { level: number } = this.extractBlockquoteInfo(line)
    return level === currentLevel || level === 0
  }

  /**
   * Checks if a line should be collected.
   * @param level - Line level
   * @param content - Line content
   * @param currentLevel - Current blockquote level
   * @returns True if line should be collected
   */
  private shouldCollectLine(level: number, content: string, currentLevel: number): boolean {
    return level === currentLevel || (level === 0 && content.trim() === '')
  }

  /**
   * Formats line content for collection.
   * @param content - Line content
   * @returns Formatted content
   */
  private formatLineContent(content: string): string {
    return content !== '' ? `\n${content}` : '\n'
  }

  /**
   * Gets the next end position.
   * @param input - The input string
   * @param startPos - Starting position
   * @returns Next end position
   */
  private getNextEndPos(input: string, startPos: number): number {
    const nextLineEnd: number = input.indexOf('\n', startPos)
    return nextLineEnd === -1 ? input.length : nextLineEnd
  }
}
