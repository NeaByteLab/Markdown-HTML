import { parserNodeType, type ParserNode, type SegmentText } from '@interfaces/index'

/**
 * Builder for header nodes.
 * @description Handles parsing of markdown headers (# ## ### etc.)
 */
export class Header {
  /**
   * Builds a header node from a token.
   * @param token - The header token to process
   * @returns Header node with level metadata and text content
   */
  static build(token: SegmentText): ParserNode {
    const headerMatch: RegExpExecArray | null = /^#+/.exec(token.content)
    const level: number = headerMatch !== null ? Math.min(headerMatch[0].length, 6) : 1
    const content: string = token.content.replace(/^#+\s*/, '')
    return {
      type: parserNodeType.HEADER,
      children: [{ type: parserNodeType.TEXT, value: content }],
      metadata: {
        level: level as 1 | 2 | 3 | 4 | 5 | 6
      }
    }
  }
}
