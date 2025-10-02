/**
 * Sanitization utilities to prevent XSS attacks.
 */
const javascriptProtocol: RegExp = /javascript:/gi
const dangerousChars: RegExp = /[&<>"'`\s=();:%\\[\]{}!@#$^*+|?~/-]/g
const eventHandlers: RegExp = /\bon\w+\s*=\s*["']?[^"'>\s]*["']?/gi
const safeProtocols: Set<string> = new Set(['http:', 'https:', 'mailto:', 'tel:'])
const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#039;',
  '`': '&#x60;',
  ' ': '&#32;',
  '=': '&#61;',
  '(': '&#40;',
  ')': '&#41;',
  '@': '&#64;',
  '#': '&#35;',
  $: '&#36;',
  '^': '&#94;',
  '*': '&#42;',
  '+': '&#43;',
  '|': '&#124;',
  '?': '&#63;',
  '~': '&#126;',
  '/': '&#47;',
  '-': '&#45;',
  _: '&#95;'
}

/**
 * Sanitizes a URL for security.
 * @param url - The URL to sanitize
 * @param enabled - Whether to enable sanitization
 * @returns Sanitized URL
 */
export function sanitizeUrl(url: string, enabled: boolean): string {
  if (!enabled || !url) {
    return url || '#'
  }
  if (url.startsWith('~/') || url.includes('../')) {
    return '#'
  }
  const colonIndex: number = url.indexOf(':')
  if (colonIndex > 0) {
    const protocol: string = url.substring(0, colonIndex + 1).toLowerCase()
    if (safeProtocols.has(protocol)) {
      return url
    }
  }
  if (url.startsWith('./') && !url.includes('../')) {
    return url
  }
  return '#'
}

/**
 * Sanitizes content to prevent XSS attacks.
 * @param content - Unsafe string content
 * @param enabled - Whether to enable sanitization
 * @returns Sanitized HTML-safe string
 */

export function sanitizeContent(content: string, enabled: boolean): string {
  if (!enabled || !content) {
    return content || ''
  }
  return content
    .replace(eventHandlers, '')
    .replace(javascriptProtocol, '')
    .replace(dangerousChars, (char: string) => entities[char] ?? `&#${char.charCodeAt(0)};`)
}
