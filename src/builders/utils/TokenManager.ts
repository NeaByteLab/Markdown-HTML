import { tokenType, type SegmentText } from '@interfaces/index'

/**
 * Token manager for handling token navigation and state.
 * @description Manages token position, peeking, and advancing
 */
export class TokenManager {
  /** Array of parsed markdown tokens */
  private tokens: SegmentText[]
  /** Current position in the tokens array */
  private current: number = 0

  /**
   * Creates a new TokenManager instance.
   * @param tokens - Array of markdown tokens to manage
   */
  constructor(tokens: SegmentText[] = []) {
    this.tokens = tokens
  }

  /**
   * Sets new tokens and resets position.
   * @param tokens - Array of markdown tokens to manage
   */
  setTokens(tokens: SegmentText[]): void {
    this.tokens = tokens
    this.current = 0
  }

  /**
   * Peeks at the current token without advancing position.
   * @returns Current token
   */
  peekCurrentToken(): SegmentText {
    const token: SegmentText | undefined = this.tokens[this.current]
    if (!token) {
      return {
        type: tokenType.TEXT,
        content: ''
      }
    }
    return token
  }

  /**
   * Advances to the next token and returns the previous one.
   * @returns Previous token
   */
  advanceToNextToken(): SegmentText {
    if (!this.hasReachedEnd()) {
      this.current++
    }
    const token: SegmentText | undefined = this.tokens[this.current - 1]
    if (!token) {
      return {
        type: tokenType.TEXT,
        content: ''
      }
    }
    return token
  }

  /**
   * Checks if parser has reached the end of tokens.
   * @returns True if all tokens have been processed
   */
  hasReachedEnd(): boolean {
    return this.current >= this.tokens.length
  }

  /**
   * Gets the current position.
   * @returns Current position in tokens array
   */
  getCurrentPosition(): number {
    return this.current
  }

  /**
   * Sets the current position.
   * @param position - Position to set
   */
  setCurrentPosition(position: number): void {
    this.current = position
  }
}
