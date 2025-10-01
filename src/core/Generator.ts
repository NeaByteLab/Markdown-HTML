import type { ElementHTML } from '@interfaces/Element'

/**
 * Generates HTML string from element structures.
 * @description Converts elements to HTML strings with XSS protection.
 */
export class Generator {
  /** Internal buffer for building HTML string */
  private buffer: string[] = []

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
    this.buffer.push('<', node.tag)
    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        this.buffer.push(` ${key}="${this.sanitizeContent(String(value))}"`)
      }
    }
    if (node.selfClosing === true) {
      this.buffer.push(' />')
      return
    }
    this.buffer.push('>')
    if (node.content !== undefined) {
      this.buffer.push(this.sanitizeContent(node.content))
    }
    if (node.children) {
      for (const child of node.children) {
        this.generateNode(child)
      }
    }
    this.buffer.push('</', node.tag, '>')
  }

  /**
   * Sanitizes content to prevent XSS attacks.
   * @param unsafe - Unsafe string content
   * @returns Sanitized HTML-safe string
   */
  private sanitizeContent(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
}
