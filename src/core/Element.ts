import { DocumentType, type DocumentNode, type ElementHTML } from '@interfaces/index'

/**
 * Converts document AST nodes to HTML element structures.
 * @description Transforms AST nodes into HTML elements.
 */
export class Element {
  /**
   * Converts a document AST to HTML element structure.
   * @param ast - Document AST node to convert
   * @returns HTML element structure
   */
  convertToHtml(ast: DocumentNode): ElementHTML {
    return this.convertNodeToHtml(ast)
  }

  /**
   * Recursively converts a document node to HTML element.
   * @param node - Document node to convert
   * @returns HTML element structure
   */
  private convertNodeToHtml(node: DocumentNode): ElementHTML {
    switch (node.type) {
      case DocumentType.DOCUMENT:
        return {
          tag: 'div',
          attributes: { class: 'markdown-content' },
          children: node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
        }
      case DocumentType.HEADER:
        return {
          tag: `h${node.metadata?.level ?? 1}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
          children: node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
        }
      case DocumentType.BLOCKQUOTE:
        return {
          tag: 'blockquote',
          children: node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
        }
      case DocumentType.CODE_BLOCK: {
        const codeElement: ElementHTML =
          node.metadata?.language !== null && node.metadata?.language !== undefined
            ? {
                tag: 'code',
                attributes: { class: `language-${node.metadata.language}` },
                content: node.value ?? ''
              }
            : {
                tag: 'code',
                content: node.value ?? ''
              }

        return {
          tag: 'pre',
          children: [codeElement]
        }
      }
      case DocumentType.LINEBREAK:
        return {
          tag: 'br',
          selfClosing: true
        }

      case DocumentType.TEXT:
        return {
          tag: 'span',
          content: node.value ?? ''
        }
      case DocumentType.INLINE_CODE:
        return {
          tag: 'code',
          content: node.value ?? ''
        }
      case DocumentType.PARAGRAPH:
        return {
          tag: 'p',
          children: node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
        }
      case DocumentType.EMPHASIS: {
        const isBoldItalic: boolean = node.value === '***'
        const isBold: boolean = node.value === '**'

        if (isBoldItalic) {
          return {
            tag: 'strong',
            children: [
              {
                tag: 'em',
                children:
                  node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
              }
            ]
          }
        } else if (isBold) {
          return {
            tag: 'strong',
            children:
              node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
          }
        } else {
          return {
            tag: 'em',
            children:
              node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
          }
        }
      }
      case DocumentType.LIST_ITEM: {
        return {
          tag: 'li',
          content: node.value ?? '',
          children: node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
        }
      }
      case DocumentType.LIST: {
        const listType: string = (node.metadata?.listType as string) ?? 'unordered'
        const tag: string = listType === 'ordered' ? 'ol' : 'ul'
        return {
          tag: tag as 'ul' | 'ol',
          children: node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
        }
      }
      case DocumentType.TASK_LIST: {
        return {
          tag: 'ul',
          attributes: { class: 'task-list' },
          children: node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
        }
      }
      case DocumentType.TASK_LIST_ITEM: {
        const isChecked: boolean = (node.metadata?.checked as boolean) ?? false
        const checkboxElement: ElementHTML = {
          tag: 'input',
          attributes: {
            type: 'checkbox',
            checked: isChecked,
            disabled: true
          },
          selfClosing: true
        }
        const labelElement: ElementHTML = {
          tag: 'label',
          children: [
            checkboxElement,
            ...node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
          ]
        }
        return {
          tag: 'li',
          children: [labelElement]
        }
      }
      case DocumentType.LINK: {
        const url: string = (node.metadata?.url as string) ?? '#'
        const title: string = (node.metadata?.title as string) ?? ''
        const attributes: Record<string, string> = { href: url }
        if (title) {
          attributes['title'] = title
        }
        return {
          tag: 'a',
          attributes,
          content: (node.metadata?.text as string) ?? node.value ?? '',
          children: node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
        }
      }
      case DocumentType.IMAGE: {
        const src: string = (node.metadata?.src as string) ?? '#'
        const alt: string = (node.metadata?.alt as string) ?? ''
        const title: string = (node.metadata?.title as string) ?? ''
        const attributes: Record<string, string> = { src, alt }
        if (title) {
          attributes['title'] = title
        }
        return {
          tag: 'img',
          attributes,
          selfClosing: true
        }
      }
      case DocumentType.HORIZONTAL_RULE: {
        return {
          tag: 'hr',
          selfClosing: true
        }
      }
      case DocumentType.STRIKETHROUGH: {
        return {
          tag: 'del',
          children: node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
        }
      }
      default:
        return {
          tag: 'div',
          children: node.children?.map((child: DocumentNode) => this.convertNodeToHtml(child)) ?? []
        }
    }
  }
}

/** Element transformer instance for converting AST to HTML */
export const transformer: typeof Element = Element
