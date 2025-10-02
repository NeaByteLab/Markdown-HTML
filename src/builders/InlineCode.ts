import { parserNodeType, type ParserNode, type SegmentText } from '@interfaces/index'

/**
 * Builder for inline code nodes.
 * @description Handles parsing of markdown inline code (`code`)
 */
export class InlineCode {
  /**
   * Builds an inline code node from a token.
   * @param token - The inline code token to process
   * @returns Inline code node with text content
   */
  static build(token: SegmentText): ParserNode {
    const content: string = token.content.replace(/(^`|`$)/g, '')
    return {
      type: parserNodeType.INLINE_CODE,
      value: content
    }
  }
}
