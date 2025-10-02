import { parserNodeType, type ParserNode, type SegmentText } from '@interfaces/index'
import { SegmentExtractor, Document } from '@core/index'

/**
 * Builder for blockquote nodes.
 * @description Converts blockquote tokens to parser nodes
 */
export class Blockquote {
  /**
   * Builds a blockquote node from a token.
   * @param token - The blockquote token to process
   * @returns Parser node representing the blockquote
   */
  static build(token: SegmentText): ParserNode {
    const level: number = (token.metadata as { level: number })?.level || 1
    const { content }: { content: string } = token
    const extractor: SegmentExtractor = new SegmentExtractor()
    const document: Document = new Document()
    const contentSegments: SegmentText[] = extractor.extractSegments(content, true)
    const contentAst: ParserNode = document.buildDocumentTree(contentSegments)
    return {
      type: parserNodeType.BLOCKQUOTE,
      value: '',
      metadata: { level },
      children: contentAst.children ?? []
    }
  }
}
