import { tokenType, type ParserNode, type SegmentText } from '@interfaces/index'
import {
  Blockquote,
  Header,
  CodeBlock,
  InlineCode,
  HorizontalRule,
  LineBreak,
  Link,
  Emphasis,
  Strikethrough
} from '@builders/index'
import { NodeUtils } from '@builders/utils/index'

/**
 * Factory for building document nodes from tokens.
 * @description Orchestrates the creation of different node types
 */
export class NodeFactory {
  /**
   * Builds the next node from the current token.
   * @param token - Current token to process
   * @param maxDepth - Maximum recursion depth
   * @param depth - Current recursion depth
   * @param advanceToNextToken - Function to advance to next token
   * @param buildParagraphNode - Function to build paragraph node
   * @param buildListNode - Function to build list node
   * @param buildTaskListNode - Function to build task list node
   * @returns Parsed node or null if no valid node can be built
   */
  static buildNextNode(
    token: SegmentText,
    maxDepth: number,
    depth: number,
    advanceToNextToken: () => SegmentText,
    buildParagraphNode: () => ParserNode | null,
    buildListNode: () => ParserNode,
    buildTaskListNode: () => ParserNode
  ): ParserNode | null {
    switch (token.type) {
      case tokenType.TEXT:
        return buildParagraphNode()
      case tokenType.HEADER:
        return Header.build(advanceToNextToken())
      case tokenType.BLOCKQUOTE:
        return Blockquote.build(advanceToNextToken())
      case tokenType.CODE_BLOCK:
        return CodeBlock.build(advanceToNextToken())
      case tokenType.EMPHASIS:
        return Emphasis.build(advanceToNextToken())
      case tokenType.INLINE_CODE:
        return InlineCode.build(advanceToNextToken())
      case tokenType.LIST_ITEM:
        return buildListNode()
      case tokenType.TASK_LIST_ITEM:
        return buildTaskListNode()
      case tokenType.LINK:
        return Link.buildLink(advanceToNextToken())
      case tokenType.IMAGE:
        return Link.buildImage(advanceToNextToken())
      case tokenType.HORIZONTAL_RULE:
        return HorizontalRule.build(advanceToNextToken())
      case tokenType.STRIKETHROUGH:
        return Strikethrough.build(advanceToNextToken(), maxDepth, depth)
      case tokenType.LINE_BREAK:
        return LineBreak.build(advanceToNextToken())
      case tokenType.PARAGRAPH_BREAK:
      case tokenType.UNKNOWN: {
        const unknownToken: SegmentText = advanceToNextToken()
        if (token.type === tokenType.UNKNOWN && unknownToken.content.trim()) {
          return NodeUtils.createTextNode(unknownToken.content.trim())
        }
        return null
      }
      default:
        advanceToNextToken()
        return null
    }
  }
}
