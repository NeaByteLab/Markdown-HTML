import { parserNodeType, type ParserNode, type SegmentText } from '@interfaces/index'

/**
 * Builder for code block nodes.
 * @description Handles parsing of markdown code blocks (```language)
 */
export class CodeBlock {
  /**
   * Builds a code block node from a token.
   * @param token - The code block token to process
   * @returns Code block node with language metadata if available
   */
  static build(token: SegmentText): ParserNode {
    const content: string = token.content.replace(/(^```|```$)/g, '')
    const hasNewLine: boolean = content.includes('\n')
    const language: string | null = hasNewLine ? content.split('\n')[0]?.trim() ?? null : null
    const value: string = hasNewLine ? content.split('\n').slice(1).join('\n') : content
    const metadata: { language?: string | null } = {}
    if (language != null && language.length > 0) {
      metadata.language = language
    }
    return {
      type: parserNodeType.CODE_BLOCK,
      value: value.trim(),
      metadata
    }
  }
}
