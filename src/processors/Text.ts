import {
  tokenType,
  type ProcessingContext,
  type ProcessingResult,
  type SegmentProcessor,
  type SegmentText
} from '@interfaces/index'

/**
 * Processor for plain text segments and paragraph splitting.
 * @description Processes plain text and paragraph breaks.
 */
export class TextProcessor implements SegmentProcessor {
  /** Priority for processing order (higher = processed first) */
  priority: number = 1

  /**
   * Checks if this processor can handle the current character.
   * @param char - The character to check
   * @param context - The processing context
   * @returns True if the character is not a special markdown character
   */
  canProcess(char: string, context?: ProcessingContext): boolean {
    if (this.isSpecialCharacter(char)) {
      return false
    }
    if (char === ' ' && context !== undefined) {
      return this.isLineBreakPattern(context.buffer, context.position)
    }
    if (char === '\n') {
      return false
    }
    return true
  }

  /**
   * Processes the segment and returns tokens.
   * @param input - The input string to process
   * @param start - The starting position in the input
   * @returns Processing result with tokens and new position
   */
  process(input: string, start: number): ProcessingResult {
    if (this.isLineBreakPattern(input, start)) {
      let pos: number = start
      while (pos < input.length && input[pos] === ' ') {
        pos++
      }
      if (pos < input.length && input[pos] === '\n') {
        pos++
      }
      return {
        tokens: [
          {
            type: tokenType.LINE_BREAK,
            content: input.slice(start, pos),
            metadata: { breakType: 'hard', spaceCount: pos - start - 1 }
          }
        ],
        newPosition: pos,
        consumed: true
      }
    }
    const nextPos: number = this.findNextSpecialCharacterPosition(input, start)
    const endPos: number = nextPos === -1 ? input.length : nextPos
    if (endPos <= start) {
      return {
        tokens: [],
        newPosition: start,
        consumed: false
      }
    }
    const content: string = input.slice(start, endPos)
    if (content.includes('  \n')) {
      const lineBreakPos: number = content.indexOf('  \n')
      const beforeLineBreak: string = content.slice(0, lineBreakPos)
      const afterLineBreak: string = content.slice(lineBreakPos + 3)
      const tokens: SegmentText[] = []
      if (beforeLineBreak.trim()) {
        tokens.push(...this.processTextContent(beforeLineBreak))
      }
      tokens.push({
        type: tokenType.LINE_BREAK,
        content: '  \n',
        metadata: { breakType: 'hard', spaceCount: 2 }
      })
      if (afterLineBreak.trim()) {
        tokens.push(...this.processTextContent(afterLineBreak))
      }
      return {
        tokens,
        newPosition: endPos,
        consumed: true
      }
    }
    const tokens: SegmentText[] = this.processTextContent(content)
    return {
      tokens,
      newPosition: endPos,
      consumed: true
    }
  }

  /**
   * Processes text content for inline code and paragraph splitting.
   * @param content - The text content to process
   * @returns Array of processed text tokens
   */
  private processTextContent(content: string): SegmentText[] {
    if (!content.trim()) {
      return []
    }
    if (!content.includes('`') && !content.includes('\n\n') && !content.includes('  \n')) {
      return [{ type: tokenType.TEXT, content: content.trim() }]
    }
    const tokens: SegmentText[] = []
    const lineBreakProcessedContent: string = this.processLineBreaks(content, tokens)
    if (lineBreakProcessedContent === '') {
      return tokens
    }
    const inlineCodeRegex: RegExp = /`([^`]+)`/g
    let lastIndex: number = 0
    let match: RegExpExecArray | null = null
    while ((match = inlineCodeRegex.exec(lineBreakProcessedContent)) !== null) {
      if (match.index > lastIndex) {
        const beforeText: string = lineBreakProcessedContent.slice(lastIndex, match.index)
        if (beforeText.trim()) {
          tokens.push({ type: tokenType.TEXT, content: beforeText.trim() })
        }
      }
      tokens.push({ type: tokenType.INLINE_CODE, content: match[0] })
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < lineBreakProcessedContent.length) {
      const afterText: string = lineBreakProcessedContent.slice(lastIndex)
      if (afterText.trim()) {
        tokens.push({ type: tokenType.TEXT, content: afterText.trim() })
      }
    }
    if (lastIndex === 0 && lineBreakProcessedContent.trim()) {
      tokens.push({ type: tokenType.TEXT, content: lineBreakProcessedContent.trim() })
    }
    return tokens
  }

  /**
   * Finds the position of the next special markdown character.
   * @param input - The input string to search
   * @param start - The starting position
   * @returns Position of next special character or -1 if not found
   */
  private findNextSpecialCharacterPosition(input: string, start: number): number {
    let pos: number = start
    const lineStart: number = input.lastIndexOf('\n', start - 1) + 1
    const lineEnd: number = input.indexOf('\n', start)
    const maxPos: number = lineEnd === -1 ? input.length : lineEnd
    while (pos < maxPos) {
      const char: string = input[pos] ?? ''
      const isAtLineStart: boolean = pos === lineStart
      if (char === ' ' && this.isLineBreakPattern(input, pos)) {
        return pos
      }
      if (char >= '0' && char <= '9' && this.isNumberedListMarker(input, pos)) {
        return pos
      }
      if (this.isSpecialMarkdownCharacter(char, isAtLineStart, input, pos)) {
        return pos
      }
      pos++
    }
    if (
      lineEnd !== -1 &&
      pos === lineEnd &&
      pos >= 2 &&
      input[pos - 2] === ' ' &&
      input[pos - 1] === ' '
    ) {
      return pos - 2
    }
    return maxPos
  }

  /**
   * Checks if position contains a numbered list marker
   * @param input - The input string
   * @param pos - The position to check
   * @returns True if numbered list marker found
   */
  private isNumberedListMarker(input: string, pos: number): boolean {
    let numPos: number = pos
    while (numPos < input.length && (input[numPos] ?? '') >= '0' && (input[numPos] ?? '') <= '9') {
      numPos++
    }
    return (
      numPos < input.length &&
      (input[numPos] ?? '') === '.' &&
      numPos + 1 < input.length &&
      (input[numPos + 1] ?? '') === ' '
    )
  }

  /**
   * Checks if character is a special markdown character
   * @param char - The character to check
   * @param isAtLineStart - Whether at line start
   * @param input - The input string
   * @param pos - Current position
   * @returns True if special markdown character
   */
  private isSpecialMarkdownCharacter(
    char: string,
    isAtLineStart: boolean,
    input: string,
    pos: number
  ): boolean {
    return (
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
      char === '~'
    )
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

  /**
   * Checks if character is a special markdown character.
   * @param char - The character to check
   * @returns True if the character is a special markdown character
   */
  private isSpecialCharacter(char: string): boolean {
    return [
      '#',
      '`',
      '*',
      '_',
      '[',
      '!',
      '-',
      '|',
      '>',
      '~',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9'
    ].includes(char)
  }

  /**
   * Checks if the current position starts a line break pattern.
   * @param input - The input string
   * @param start - The starting position
   * @returns True if this is a line break pattern
   */
  private isLineBreakPattern(input: string, start: number): boolean {
    let pos: number = start
    let spaceCount: number = 0
    while (pos < input.length && input[pos] === ' ') {
      spaceCount++
      pos++
    }
    return spaceCount >= 2 && pos < input.length && input[pos] === '\n'
  }

  /**
   * Processes line breaks in text content.
   * @param content - The text content to process
   * @param tokens - Array to add line break tokens to
   * @returns Processed content with line breaks replaced
   */
  private processLineBreaks(content: string, tokens: SegmentText[]): string {
    const parts: string[] = content.split(/ {2}\n/)
    for (let i: number = 0; i < parts.length; i++) {
      const part: string = parts[i] ?? ''
      if (part.trim()) {
        tokens.push({ type: tokenType.TEXT, content: part.trim() })
      }
      if (i < parts.length - 1) {
        tokens.push({
          type: tokenType.LINE_BREAK,
          content: '  \n',
          metadata: { breakType: 'hard', spaceCount: 2 }
        })
      }
    }
    return ''
  }
}
