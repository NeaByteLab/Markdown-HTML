import { parserNodeType, tokenType, type ParserNode, type SegmentText } from '@interfaces/index'
import { Emphasis, InlineCode, Strikethrough, Link } from '@builders/index'

/**
 * Builder for paragraph nodes.
 * @description Handles parsing of markdown paragraphs and text content
 */
export class Paragraph {
  /**
   * Builds a paragraph by collecting consecutive text and emphasis segments.
   * @param tokens - Array of tokens
   * @param current - Current position in tokens
   * @param hasReachedEnd - Function to check if reached end
   * @param peekCurrentToken - Function to peek at current token
   * @param advanceToNextToken - Function to advance to next token
   * @param createTextNode - Function to create text nodes
   * @param maxDepth - Maximum recursion depth
   * @param currentDepth - Current recursion depth
   * @returns Paragraph node with mixed content or null if empty
   */
  static buildParagraph(
    _tokens: SegmentText[],
    _current: number,
    hasReachedEnd: () => boolean,
    peekCurrentToken: () => SegmentText,
    advanceToNextToken: () => SegmentText,
    createTextNode: (content: string) => ParserNode,
    maxDepth: number,
    currentDepth: number
  ): ParserNode | null {
    const children: ParserNode[] = this.collectParagraphChildren(
      _tokens,
      _current,
      hasReachedEnd,
      peekCurrentToken,
      advanceToNextToken,
      createTextNode,
      maxDepth,
      currentDepth
    )
    if (children.length === 0) {
      return null
    }
    const spacedChildren: ParserNode[] = this.addSpacingBetweenElements(children)
    return {
      type: parserNodeType.PARAGRAPH,
      children: spacedChildren
    }
  }

  /**
   * Collects consecutive text, emphasis, and inline code tokens for paragraph building.
   * @param tokens - Array of tokens
   * @param current - Current position in tokens
   * @param hasReachedEnd - Function to check if reached end
   * @param peekCurrentToken - Function to peek at current token
   * @param advanceToNextToken - Function to advance to next token
   * @param createTextNode - Function to create text nodes
   * @param maxDepth - Maximum recursion depth
   * @param currentDepth - Current recursion depth
   * @returns Array of parser nodes for paragraph children
   */
  private static collectParagraphChildren(
    _tokens: SegmentText[],
    _current: number,
    hasReachedEnd: () => boolean,
    peekCurrentToken: () => SegmentText,
    advanceToNextToken: () => SegmentText,
    createTextNode: (content: string) => ParserNode,
    maxDepth: number,
    currentDepth: number
  ): ParserNode[] {
    const children: ParserNode[] = []
    while (!hasReachedEnd()) {
      const token: SegmentText = peekCurrentToken()
      if (token.type === tokenType.TEXT) {
        const textToken: SegmentText = advanceToNextToken()
        if (textToken.content.trim()) {
          children.push(createTextNode(textToken.content.trim()))
        }
      } else if (token.type === tokenType.EMPHASIS) {
        const emphasisNode: ParserNode = Emphasis.build(advanceToNextToken())
        children.push(emphasisNode)
      } else if (token.type === tokenType.INLINE_CODE) {
        const inlineCodeNode: ParserNode = InlineCode.build(advanceToNextToken())
        children.push(inlineCodeNode)
      } else if (token.type === tokenType.STRIKETHROUGH) {
        const strikethroughNode: ParserNode = Strikethrough.build(
          advanceToNextToken(),
          maxDepth,
          currentDepth
        )
        children.push(strikethroughNode)
      } else if (token.type === tokenType.LINK) {
        const linkNode: ParserNode = Link.buildLink(advanceToNextToken())
        children.push(linkNode)
      } else {
        break
      }
    }
    return children
  }

  /**
   * Adds appropriate spacing between inline elements in a paragraph.
   * @param children - Array of parser nodes to add spacing between
   * @returns Array of parser nodes with spacing added
   */
  private static addSpacingBetweenElements(children: ParserNode[]): ParserNode[] {
    const spacedChildren: ParserNode[] = []
    for (let i: number = 0; i < children.length; i++) {
      const currentChild: ParserNode | undefined = children[i]
      if (currentChild) {
        spacedChildren.push(currentChild)
        if (i < children.length - 1) {
          const nextChild: ParserNode | undefined = children[i + 1]
          if (nextChild && this.shouldAddSpaceBetween(currentChild, nextChild)) {
            spacedChildren.push({ type: parserNodeType.TEXT, value: ' ' })
          }
        }
      }
    }
    return spacedChildren
  }

  /**
   * Determines if spacing should be added between two inline elements.
   * @param current - Current parser node
   * @param next - Next parser node
   * @returns True if spacing should be added between the nodes
   */
  private static shouldAddSpaceBetween(current: ParserNode, next: ParserNode): boolean {
    const inlineTypes: string[] = [
      parserNodeType.TEXT,
      parserNodeType.EMPHASIS,
      parserNodeType.INLINE_CODE,
      parserNodeType.STRIKETHROUGH,
      parserNodeType.LINK
    ]
    return inlineTypes.includes(current.type) && inlineTypes.includes(next.type)
  }
}
