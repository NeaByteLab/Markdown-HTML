import type { ElementHTML } from '@interfaces/index'
import { sanitizeContent } from '@utils/index'

/**
 * Generates HTML string from element structures.
 * @description Converts elements to HTML strings with XSS protection.
 */
export class Generator {
  /** Whether to sanitize content for XSS protection */
  private readonly sanitizationEnabled: boolean
  /** Internal buffer for building HTML string */
  private buffer: string[] = []

  /**
   * Creates a new HTML generator instance.
   * @param sanitization - Whether to enable XSS sanitization (default: false)
   */
  constructor(sanitization: boolean = false) {
    this.sanitizationEnabled = sanitization
  }

  /**
   * Generates HTML string from an element structure.
   * @param node - Root element to generate HTML from
   * @returns Generated HTML string
   */
  generateString(node: ElementHTML): string {
    this.buffer = []
    this.generateNode(node)
    return this.buffer.join('')
  }

  /**
   * Recursively generates HTML for an element node.
   * @param node - Element node to generate HTML for
   */
  private generateNode(node: ElementHTML): void {
    if (node.tag === 'text') {
      this.generateTextNode(node)
      return
    }
    this.generateElementNode(node)
  }

  /**
   * Generates HTML for text nodes.
   * @param node - Text node to generate HTML for
   */
  private generateTextNode(node: ElementHTML): void {
    if (node.content !== undefined) {
      this.buffer.push(sanitizeContent(node.content, this.sanitizationEnabled))
    }
    if (node.children) {
      for (const child of node.children) {
        this.generateNode(child)
      }
    }
  }

  /**
   * Generates HTML for element nodes.
   * @param node - Element node to generate HTML for
   */
  private generateElementNode(node: ElementHTML): void {
    this.buffer.push('<', node.tag)
    this.generateAttributes(node.attributes)
    if (node.selfClosing === true) {
      this.buffer.push(' />')
      return
    }
    this.buffer.push('>')
    this.generateContent(node)
    this.generateChildren(node.children)
    this.buffer.push(`</${node.tag}>`)
  }

  /**
   * Generates HTML attributes.
   * @param attributes - Attributes to generate
   */
  private generateAttributes(attributes?: Record<string, string | number | boolean>): void {
    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        this.buffer.push(` ${key}="${sanitizeContent(String(value), this.sanitizationEnabled)}"`)
      }
    }
  }

  /**
   * Generates HTML content.
   * @param node - Node with content to generate
   */
  private generateContent(node: ElementHTML): void {
    if (node.content !== undefined) {
      this.buffer.push(sanitizeContent(node.content, this.sanitizationEnabled))
    }
  }

  /**
   * Generates HTML children.
   * @param children - Children to generate
   */
  private generateChildren(children?: ElementHTML[]): void {
    if (children) {
      for (const child of children) {
        this.generateNode(child)
      }
    }
  }
}
