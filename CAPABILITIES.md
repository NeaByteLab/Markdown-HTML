# 📋 Module Capabilities

## ✅ Supported (CommonMark Core)

- [x] Headers (H1-H6)
- [x] Bold text (**text**)
- [x] Italic text (*text*)
- [x] Bold italic (***text***)
- [x] Strikethrough (~~text~~)
- [x] Inline code (`code`)
- [x] Code blocks (```code```)
- [x] Unordered lists (- item)
- [x] Ordered lists (1. item)
- [x] Task lists (- [ ] item)
- [x] Inline links ([text](url))
- [x] Inline images (![alt](src))
- [x] Blockquotes (> text)
- [x] Horizontal rules (---)
- [x] Line breaks
- [x] Escaped characters (\*)
- [x] Nested lists (indentation support)
- [x] Streaming support

## ⚠️ Partially Supported

- [~] Reference links ([text][ref]) - Parses but doesn't resolve references
- [~] Reference images (![alt][ref]) - Parses but doesn't resolve references
- [~] Hard line breaks (  \n) - Creates `<br>` but not proper CommonMark behavior
- [~] Tables (| col1 | col2 |) - Treats as plain text, not table structure

## ❌ Not Supported (CommonMark Missing)

- [ ] Table parsing (| col1 | col2 |)
- [ ] Reference resolution ([ref]: url)
- [ ] Autolinks (https://example.com)
- [ ] Footnotes ([^1])
- [ ] Definition lists (term: definition)
- [ ] Math expressions ($x^2$)
- [ ] HTML blocks and spans
- [ ] Setext headers (===, ---)
- [ ] Fenced code block info strings
- [ ] Link reference definitions