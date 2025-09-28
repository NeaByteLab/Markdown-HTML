import fs from 'node:fs'
import { unicodeEmojiData, type UnicodeData } from '@scripts/DataUnicode'

/**
 * Metadata structure for emoji data processing.
 * @description Contains markdown syntax, unicode code, and emoji character for comparison.
 */
interface EmojiMetadata {
  /** Markdown emoji syntax (e.g., ":smile:") */
  markdown: string
  /** Unicode code point in lowercase with dashes */
  unicode: string
  /** Actual emoji character (optional) */
  emoji?: string
}

/**
 * Compares unicode emoji data with markdown emoji data and generates combined metadata.
 * @description Processes unicode and markdown emoji datasets, matches them by unicode codes.
 * @param unicodeData - Array of unicode emoji data objects
 * @param markdownData - Record mapping emoji names to unicode codes
 */
function compareEmojiData(unicodeData: UnicodeData[], markdownData: Record<string, string>): void {
  const tempEmojiData: EmojiMetadata[] = []
  for (const [key, value] of Object.entries(markdownData)) {
    const emojiMetadata: EmojiMetadata = {
      markdown: `:${key}:`,
      unicode: value
    }
    tempEmojiData.push(emojiMetadata)
  }
  for (const unicode of unicodeData) {
    const { code, emoji }: { code: string; emoji: string } = unicode as {
      code: string
      emoji: string
    }
    const unicodeCode: string = code.toLowerCase().replace(/\s+/g, '-')
    const foundIndex: number = tempEmojiData.findIndex(
      (item: EmojiMetadata) => item.unicode === unicodeCode
    )
    if (foundIndex !== -1) {
      const foundItem: EmojiMetadata | undefined = tempEmojiData[foundIndex]
      if (foundItem) {
        foundItem.emoji = emoji
      }
    }
  }
  const filteredEmojiData: EmojiMetadata[] = tempEmojiData.filter(
    (value: EmojiMetadata) => value.emoji !== undefined
  )
  console.log(filteredEmojiData)
  const jsonData: string = JSON.stringify(filteredEmojiData, null, 2)
  fs.writeFileSync('./scripts/DataEmoji.json', jsonData, 'utf-8')
  console.log(`[LOG] Written ${filteredEmojiData.length} emoji items to DataEmoji.json`)
}

/**
 * Main execution function for emoji data processing.
 * @description Loads emoji data, validates integrity, and generates metadata file.
 * @throws {Error} When unicode or markdown emoji data fails to load
 */
function main(): void {
  try {
    if (
      typeof unicodeEmojiData !== 'object' ||
      unicodeEmojiData == null ||
      Object.keys(unicodeEmojiData as Record<string, unknown>).length < 1
    ) {
      throw new Error('Failed to load unicode emoji data')
    }
    const resUnicodeEmojiData: UnicodeData[] = Object.values(unicodeEmojiData).flat()
    console.log(`[LOG] Loaded "${resUnicodeEmojiData.length}" unicode emoji data`)
    const resMarkdownEmoji: string = fs.readFileSync('./scripts/DataMarkdown.json', 'utf-8')
    const markdownEmojiData: Record<string, string> = JSON.parse(resMarkdownEmoji) as Record<
      string,
      string
    >
    if (Object.keys(markdownEmojiData).length < 1) {
      throw new Error('Failed to load markdown emoji data')
    }
    console.log(`[LOG] Loaded "${Object.keys(markdownEmojiData).length}" markdown emoji data`)
    compareEmojiData(resUnicodeEmojiData, markdownEmojiData)
  } catch (error: unknown) {
    const errorMessage: string = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[ERROR]: ${errorMessage}`)
  }
}

/**
 * Executes the emoji data conversion process.
 * @description Entry point that runs the main function to process and convert emoji data.
 */
main()
