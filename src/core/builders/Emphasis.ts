import { parserNodeType, type ParserNode, type SegmentText } from '@interfaces/index'

/**
 * Builder for emphasis nodes (bold, italic, bold+italic).
 * @description Handles parsing of markdown emphasis (*text*, **text**, ***text***)
 */
export class Emphasis {
  /**
   * Builds an emphasis node from a token.
   * @param token - The emphasis token to process
   * @returns Emphasis node with text children
   */
  static build(token: SegmentText): ParserNode {
    const isBoldItalic: boolean = token.content.startsWith('***') && token.content.endsWith('***')
    const isBold: boolean = token.content.startsWith('**') && token.content.endsWith('**')
    let content: string
    if (isBoldItalic) {
      content = token.content.replace(/(^\*\*\*|\*\*\*$)/g, '')
    } else if (isBold) {
      content = token.content.replace(/(^\*\*|\*\*$)/g, '')
    } else {
      content = token.content.replace(/(^\*|_|\*$|_$)/g, '')
    }
    const lines: string[] = content.split('\n').filter((line: string) => line.trim())
    const children: ParserNode[] = []
    lines.forEach((line: string, index: number) => {
      if (index > 0) {
        children.push({ type: parserNodeType.LINEBREAK })
      }
      children.push(this.createTextNode(line.trim()))
    })
    const result: ParserNode = {
      type: parserNodeType.EMPHASIS,
      children
    }
    if (isBoldItalic) {
      result.value = '***'
    } else if (isBold) {
      result.value = '**'
    }
    return result
  }

  /**
   * Creates a text node with the given content.
   * @param content - Text content for the node
   * @returns Text node
   */
  private static createTextNode(content: string): ParserNode {
    return {
      type: parserNodeType.TEXT,
      value: content
    }
  }
}
