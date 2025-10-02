import { parserNodeType, type ParserNode, type SegmentText } from '@interfaces/index'
import { Paragraph, List, TokenManager, NodeUtils, NodeFactory } from '@core/builders'

/**
 * Document parser that converts markdown tokens into a structured AST.
 * @description Parses markdown tokens into document tree structure.
 */
export class Document {
  /** Token manager for handling token navigation */
  private readonly tokenManager: TokenManager
  /** Maximum recursion depth to prevent stack overflow */
  private readonly maxDepth: number = 10
  /** Current recursion depth */
  private depth: number = 0

  /**
   * Creates a new Document parser instance.
   * @param tokens - Array of markdown tokens to parse
   * @param maxDepth - Maximum recursion depth (default: 10)
   */
  constructor(tokens: SegmentText[] = [], maxDepth: number = 10) {
    this.tokenManager = new TokenManager(tokens)
    this.maxDepth = maxDepth
  }

  /**
   * Sets new tokens and resets parser position.
   * @param tokens - Array of markdown tokens to parse
   */
  setTokens(tokens: SegmentText[]): void {
    this.tokenManager.setTokens(tokens)
  }

  /**
   * Builds a complete document tree from markdown tokens.
   * @param tokens - Optional array of tokens to parse, uses current tokens if not provided
   * @returns Root document node containing the parsed AST
   */
  buildDocumentTree(tokens?: SegmentText[]): ParserNode {
    if (tokens) {
      this.setTokens(tokens)
    }
    if (this.depth >= this.maxDepth) {
      return {
        type: parserNodeType.DOCUMENT,
        children: []
      }
    }
    this.depth++
    const document: ParserNode = {
      type: parserNodeType.DOCUMENT,
      children: []
    }
    try {
      while (!this.tokenManager.hasReachedEnd()) {
        const node: ParserNode | null = this.buildNextNode()
        if (node !== null && document.children !== undefined) {
          document.children.push(node)
        }
      }
    } finally {
      this.depth--
    }
    return document
  }

  /**
   * Builds the next node from the current token.
   * @returns Parsed node or null if no valid node can be built
   * @throws {Error} When unexpected end of tokens is reached
   */
  private buildNextNode(): ParserNode | null {
    const token: SegmentText = this.tokenManager.peekCurrentToken()
    return NodeFactory.buildNextNode(
      token,
      this.maxDepth,
      this.depth,
      () => this.tokenManager.advanceToNextToken(),
      () => this.buildParagraphNode(),
      () => this.buildListNode(),
      () => this.buildTaskListNode()
    )
  }

  /**
   * Builds a paragraph by collecting consecutive text and emphasis segments.
   * @returns Paragraph node with mixed content or null if empty
   */
  private buildParagraphNode(): ParserNode | null {
    return Paragraph.buildParagraph(
      this.tokenManager['tokens'],
      this.tokenManager.getCurrentPosition(),
      () => this.tokenManager.hasReachedEnd(),
      () => this.tokenManager.peekCurrentToken(),
      () => this.tokenManager.advanceToNextToken(),
      (content: string) => NodeUtils.createTextNode(content),
      this.maxDepth,
      this.depth
    )
  }

  /**
   * Builds a list node by grouping consecutive list items.
   * @returns List node containing grouped list items
   */
  private buildListNode(): ParserNode {
    return List.buildList(
      this.tokenManager['tokens'],
      this.tokenManager.getCurrentPosition(),
      this.maxDepth,
      this.depth,
      () => this.tokenManager.hasReachedEnd(),
      () => this.tokenManager.peekCurrentToken(),
      () => this.tokenManager.advanceToNextToken(),
      (metadata?: unknown) => NodeUtils.getListTypeFromMetadata(metadata)
    )
  }

  /**
   * Builds a task list node by grouping consecutive task list items.
   * @returns Task list node containing grouped task list items
   */
  private buildTaskListNode(): ParserNode {
    return List.buildTaskList(
      this.tokenManager['tokens'],
      this.tokenManager.getCurrentPosition(),
      this.maxDepth,
      this.depth,
      () => this.tokenManager.hasReachedEnd(),
      () => this.tokenManager.peekCurrentToken(),
      () => this.tokenManager.advanceToNextToken()
    )
  }
}
