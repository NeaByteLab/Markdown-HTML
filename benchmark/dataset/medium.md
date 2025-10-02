# Medium Performance Test Document

This document tests markdown parsing performance at the medium size level (94.02 KB).

## Document Structure

This document contains various markdown elements to simulate real-world usage:

- **Headers** of different levels
- **Text formatting** (bold, italic, strikethrough)
- **Lists** (ordered and unordered)
- **Code blocks** in multiple languages
- **Tables** with data
- **Links** and **images**
- **Blockquotes** with nested content
- **Task lists** with checkboxes
- **Horizontal rules** for separation

## Code Examples

### JavaScript Function

```javascript
function parseMarkdown(text) {
  const tokens = tokenize(text);
  const ast = buildAST(tokens);
  return generateHTML(ast);
}

function tokenize(text) {
  const lines = text.split('\n');
  const tokens = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const token = analyzeLine(line, i);
    if (token) tokens.push(token);
  }
  
  return tokens;
}

function analyzeLine(line, lineNumber) {
  // Header detection
  const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
  if (headerMatch) {
    return {
      type: 'header',
      level: headerMatch[1].length,
      content: headerMatch[2],
      lineNumber
    };
  }
  
  // Code block detection
  if (line.startsWith('```')) {
    return {
      type: 'code_block',
      content: line,
      lineNumber
    };
  }
  
  // List item detection
  const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
  if (listMatch) {
    return {
      type: 'list_item',
      content: listMatch[3],
      indent: listMatch[1].length,
      marker: listMatch[2],
      lineNumber
    };
  }
  
  // Regular paragraph
  if (line.trim()) {
    return {
      type: 'paragraph',
      content: line,
      lineNumber
    };
  }
  
  return null;
}

function buildAST(tokens) {
  const ast = {
    type: 'document',
    children: []
  };
  
  for (const token of tokens) {
    const node = createNode(token);
    ast.children.push(node);
  }
  
  return ast;
}

function createNode(token) {
  return {
    type: token.type,
    content: token.content,
    metadata: token.metadata || {}
  };
}
```

### Python Implementation

```python
import re
from typing import List, Dict, Optional
from dataclasses import dataclass
from enum import Enum

class TokenType(Enum):
    HEADER = "header"
    PARAGRAPH = "paragraph"
    CODE_BLOCK = "code_block"
    LIST_ITEM = "list_item"
    LINK = "link"
    IMAGE = "image"
    BOLD = "bold"
    ITALIC = "italic"
    STRIKETHROUGH = "strikethrough"

@dataclass
class Token:
    type: TokenType
    content: str
    line_number: int
    metadata: Optional[Dict] = None

class MarkdownParser:
    def __init__(self, options: Dict = None):
        self.options = options or {}
        self.tokens: List[Token] = []
        
    def parse(self, text: str) -> Dict:
        """Parse markdown text into AST"""
        self.tokens = self.tokenize(text)
        return self.build_ast()
    
    def tokenize(self, text: str) -> List[Token]:
        """Tokenize markdown text"""
        tokens = []
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            token = self.analyze_line(line, i)
            if token:
                tokens.append(token)
        
        return tokens
    
    def analyze_line(self, line: str, line_number: int) -> Optional[Token]:
        """Analyze a single line and return appropriate token"""
        # Header detection
        header_match = re.match(r'^(#{1,6})\s+(.+)$', line)
        if header_match:
            level = len(header_match.group(1))
            return Token(
                type=TokenType.HEADER,
                content=header_match.group(2),
                line_number=line_number,
                metadata={'level': level}
            )
        
        # Code block detection
        if line.startswith('```'):
            return Token(
                type=TokenType.CODE_BLOCK,
                content=line,
                line_number=line_number
            )
        
        # List item detection
        list_match = re.match(r'^(\s*)([-*+]|\d+\.)\s+(.+)$', line)
        if list_match:
            return Token(
                type=TokenType.LIST_ITEM,
                content=list_match.group(3),
                line_number=line_number,
                metadata={
                    'indent': len(list_match.group(1)),
                    'marker': list_match.group(2)
                }
            )
        
        # Regular paragraph
        if line.strip():
            return Token(
                type=TokenType.PARAGRAPH,
                content=line,
                line_number=line_number
            )
        
        return None
```

## Data Tables

| Feature | Support | Performance | Notes |
|---------|---------|-------------|-------|
| Headers | ✅ | Fast | H1-H6 supported |
| Bold | ✅ | Fast | **text** syntax |
| Italic | ✅ | Fast | *text* syntax |
| Code | ✅ | Fast | `inline` and ```blocks``` |
| Links | ✅ | Fast | [text](url) syntax |
| Images | ✅ | Medium | ![alt](src) syntax |
| Lists | ✅ | Fast | Ordered and unordered |
| Tables | ✅ | Medium | Pipe-separated |
| Blockquotes | ✅ | Fast | > syntax |
| Strikethrough | ✅ | Fast | ~~text~~ syntax |

## Performance Metrics

| Document Size | Input Size | HTML Output | Processing Time | Speed |
|---------------|------------|-------------|----------------|-------|
| Medium | 94.02 KB | 95.81 KB | **0.40ms** | **235k chars/ms** |

## Blockquotes

> This is a blockquote with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance.

> ### Blockquote with Header
> 
> This blockquote contains a header and multiple paragraphs.
> 
> It demonstrates the flexibility of blockquote syntax.

## Task Lists

- [x] Completed task with **bold text**
- [ ] Incomplete task with *italic text*
- [x] Another completed task with `inline code`
- [ ] Another incomplete task with [links](https://example.com)
- [x] Task with ~~strikethrough~~ text
- [ ] Task with > blockquote content

## Links and Images

### External Links

- [GitHub](https://github.com)
- [Stack Overflow](https://stackoverflow.com)
- [MDN Web Docs](https://developer.mozilla.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Images

![Markdown Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/1200px-Markdown-mark.svg.png)

---


## Performance Test Section 1

This is section 1 of the medium performance test content.

### Repetitive Lists 1

- Item 1-1 with **bold text** and `inline code`
- Item 1-2 with *italic text* and [links](https://example.com)
- Item 1-3 with ~~strikethrough~~ and > blockquotes
- Item 1-4 with `code spans` and **bold** *italic* text
- Item 1-5 with [external links](https://github.com) and images
- Item 1-6 with nested structures and complex formatting
- Item 1-7 with tables and mathematical expressions
- Item 1-8 with HTML elements and custom styling
- Item 1-9 with task lists and checkboxes
- Item 1-10 with horizontal rules and separators

### Code Block 1

```javascript
// Performance test function 1
function testFunction1() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 1`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 1,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section1'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 1
function processData1(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 1,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash1(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum1(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 1

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 1001 | Test Item 1-1 | 935.585351007947 | Active | Performance | High | test,markdown,section1 | Test item 1-1 for performance testing | 2024-01-01 | 2024-01-02 | 1 |
| 1002 | Test Item 1-2 | 315.5654128096435 | Inactive | Performance | Medium | test,markdown,section1 | Test item 1-2 for performance testing | 2024-01-02 | 2024-01-03 | 1 |
| 1003 | Test Item 1-3 | 553.1298158818263 | Active | Performance | High | test,markdown,section1 | Test item 1-3 for performance testing | 2024-01-03 | 2024-01-04 | 1 |
| 1004 | Test Item 1-4 | 679.6058941031837 | Pending | Performance | Low | test,markdown,section1 | Test item 1-4 for performance testing | 2024-01-04 | 2024-01-05 | 1 |
| 1005 | Test Item 1-5 | 914.8176658529865 | Active | Performance | High | test,markdown,section1 | Test item 1-5 for performance testing | 2024-01-05 | 2024-01-06 | 1 |

### Blockquote 1

> This is test blockquote 1 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 1

- [x] Completed task 1-1 with **bold text**
- [ ] Incomplete task 1-2 with *italic text*
- [x] Another completed task 1-3 with `inline code`
- [ ] Another incomplete task 1-4 with [links](https://example.com)
- [x] Task 1-5 with ~~strikethrough~~ text
- [ ] Task 1-6 with > blockquote content
- [x] Task 1-7 with nested structures
- [ ] Task 1-8 with complex formatting

### Large Text Block 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 2

This is section 2 of the medium performance test content.

### Repetitive Lists 2

- Item 2-1 with **bold text** and `inline code`
- Item 2-2 with *italic text* and [links](https://example.com)
- Item 2-3 with ~~strikethrough~~ and > blockquotes
- Item 2-4 with `code spans` and **bold** *italic* text
- Item 2-5 with [external links](https://github.com) and images
- Item 2-6 with nested structures and complex formatting
- Item 2-7 with tables and mathematical expressions
- Item 2-8 with HTML elements and custom styling
- Item 2-9 with task lists and checkboxes
- Item 2-10 with horizontal rules and separators

### Code Block 2

```javascript
// Performance test function 2
function testFunction2() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 2`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 2,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section2'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 2
function processData2(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 2,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash2(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum2(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 2

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 2001 | Test Item 2-1 | 572.4427500979559 | Active | Performance | High | test,markdown,section2 | Test item 2-1 for performance testing | 2024-01-01 | 2024-01-02 | 2 |
| 2002 | Test Item 2-2 | 100.78017481714951 | Inactive | Performance | Medium | test,markdown,section2 | Test item 2-2 for performance testing | 2024-01-02 | 2024-01-03 | 2 |
| 2003 | Test Item 2-3 | 213.2036377805071 | Active | Performance | High | test,markdown,section2 | Test item 2-3 for performance testing | 2024-01-03 | 2024-01-04 | 2 |
| 2004 | Test Item 2-4 | 571.2318110237318 | Pending | Performance | Low | test,markdown,section2 | Test item 2-4 for performance testing | 2024-01-04 | 2024-01-05 | 2 |
| 2005 | Test Item 2-5 | 199.8445501120425 | Active | Performance | High | test,markdown,section2 | Test item 2-5 for performance testing | 2024-01-05 | 2024-01-06 | 2 |

### Blockquote 2

> This is test blockquote 2 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 2

- [x] Completed task 2-1 with **bold text**
- [ ] Incomplete task 2-2 with *italic text*
- [x] Another completed task 2-3 with `inline code`
- [ ] Another incomplete task 2-4 with [links](https://example.com)
- [x] Task 2-5 with ~~strikethrough~~ text
- [ ] Task 2-6 with > blockquote content
- [x] Task 2-7 with nested structures
- [ ] Task 2-8 with complex formatting

### Large Text Block 2

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 3

This is section 3 of the medium performance test content.

### Repetitive Lists 3

- Item 3-1 with **bold text** and `inline code`
- Item 3-2 with *italic text* and [links](https://example.com)
- Item 3-3 with ~~strikethrough~~ and > blockquotes
- Item 3-4 with `code spans` and **bold** *italic* text
- Item 3-5 with [external links](https://github.com) and images
- Item 3-6 with nested structures and complex formatting
- Item 3-7 with tables and mathematical expressions
- Item 3-8 with HTML elements and custom styling
- Item 3-9 with task lists and checkboxes
- Item 3-10 with horizontal rules and separators

### Code Block 3

```javascript
// Performance test function 3
function testFunction3() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 3`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 3,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section3'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 3
function processData3(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 3,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash3(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum3(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 3

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 3001 | Test Item 3-1 | 572.6015807657112 | Active | Performance | High | test,markdown,section3 | Test item 3-1 for performance testing | 2024-01-01 | 2024-01-02 | 3 |
| 3002 | Test Item 3-2 | 664.8329550174142 | Inactive | Performance | Medium | test,markdown,section3 | Test item 3-2 for performance testing | 2024-01-02 | 2024-01-03 | 3 |
| 3003 | Test Item 3-3 | 256.7049828704524 | Active | Performance | High | test,markdown,section3 | Test item 3-3 for performance testing | 2024-01-03 | 2024-01-04 | 3 |
| 3004 | Test Item 3-4 | 547.8041655033363 | Pending | Performance | Low | test,markdown,section3 | Test item 3-4 for performance testing | 2024-01-04 | 2024-01-05 | 3 |
| 3005 | Test Item 3-5 | 95.34523910295034 | Active | Performance | High | test,markdown,section3 | Test item 3-5 for performance testing | 2024-01-05 | 2024-01-06 | 3 |

### Blockquote 3

> This is test blockquote 3 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 3

- [x] Completed task 3-1 with **bold text**
- [ ] Incomplete task 3-2 with *italic text*
- [x] Another completed task 3-3 with `inline code`
- [ ] Another incomplete task 3-4 with [links](https://example.com)
- [x] Task 3-5 with ~~strikethrough~~ text
- [ ] Task 3-6 with > blockquote content
- [x] Task 3-7 with nested structures
- [ ] Task 3-8 with complex formatting

### Large Text Block 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 4

This is section 4 of the medium performance test content.

### Repetitive Lists 4

- Item 4-1 with **bold text** and `inline code`
- Item 4-2 with *italic text* and [links](https://example.com)
- Item 4-3 with ~~strikethrough~~ and > blockquotes
- Item 4-4 with `code spans` and **bold** *italic* text
- Item 4-5 with [external links](https://github.com) and images
- Item 4-6 with nested structures and complex formatting
- Item 4-7 with tables and mathematical expressions
- Item 4-8 with HTML elements and custom styling
- Item 4-9 with task lists and checkboxes
- Item 4-10 with horizontal rules and separators

### Code Block 4

```javascript
// Performance test function 4
function testFunction4() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 4`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 4,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section4'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 4
function processData4(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 4,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash4(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum4(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 4

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 4001 | Test Item 4-1 | 849.1630913756993 | Active | Performance | High | test,markdown,section4 | Test item 4-1 for performance testing | 2024-01-01 | 2024-01-02 | 4 |
| 4002 | Test Item 4-2 | 16.789766622409495 | Inactive | Performance | Medium | test,markdown,section4 | Test item 4-2 for performance testing | 2024-01-02 | 2024-01-03 | 4 |
| 4003 | Test Item 4-3 | 478.0394617959074 | Active | Performance | High | test,markdown,section4 | Test item 4-3 for performance testing | 2024-01-03 | 2024-01-04 | 4 |
| 4004 | Test Item 4-4 | 842.2358826217404 | Pending | Performance | Low | test,markdown,section4 | Test item 4-4 for performance testing | 2024-01-04 | 2024-01-05 | 4 |
| 4005 | Test Item 4-5 | 496.00801757737713 | Active | Performance | High | test,markdown,section4 | Test item 4-5 for performance testing | 2024-01-05 | 2024-01-06 | 4 |

### Blockquote 4

> This is test blockquote 4 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 4

- [x] Completed task 4-1 with **bold text**
- [ ] Incomplete task 4-2 with *italic text*
- [x] Another completed task 4-3 with `inline code`
- [ ] Another incomplete task 4-4 with [links](https://example.com)
- [x] Task 4-5 with ~~strikethrough~~ text
- [ ] Task 4-6 with > blockquote content
- [x] Task 4-7 with nested structures
- [ ] Task 4-8 with complex formatting

### Large Text Block 4

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 5

This is section 5 of the medium performance test content.

### Repetitive Lists 5

- Item 5-1 with **bold text** and `inline code`
- Item 5-2 with *italic text* and [links](https://example.com)
- Item 5-3 with ~~strikethrough~~ and > blockquotes
- Item 5-4 with `code spans` and **bold** *italic* text
- Item 5-5 with [external links](https://github.com) and images
- Item 5-6 with nested structures and complex formatting
- Item 5-7 with tables and mathematical expressions
- Item 5-8 with HTML elements and custom styling
- Item 5-9 with task lists and checkboxes
- Item 5-10 with horizontal rules and separators

### Code Block 5

```javascript
// Performance test function 5
function testFunction5() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 5`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 5,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section5'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 5
function processData5(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 5,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash5(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum5(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 5

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 5001 | Test Item 5-1 | 364.55487655899566 | Active | Performance | High | test,markdown,section5 | Test item 5-1 for performance testing | 2024-01-01 | 2024-01-02 | 5 |
| 5002 | Test Item 5-2 | 300.87595371733266 | Inactive | Performance | Medium | test,markdown,section5 | Test item 5-2 for performance testing | 2024-01-02 | 2024-01-03 | 5 |
| 5003 | Test Item 5-3 | 192.68764603237742 | Active | Performance | High | test,markdown,section5 | Test item 5-3 for performance testing | 2024-01-03 | 2024-01-04 | 5 |
| 5004 | Test Item 5-4 | 704.6987750560671 | Pending | Performance | Low | test,markdown,section5 | Test item 5-4 for performance testing | 2024-01-04 | 2024-01-05 | 5 |
| 5005 | Test Item 5-5 | 603.8859038032978 | Active | Performance | High | test,markdown,section5 | Test item 5-5 for performance testing | 2024-01-05 | 2024-01-06 | 5 |

### Blockquote 5

> This is test blockquote 5 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 5

- [x] Completed task 5-1 with **bold text**
- [ ] Incomplete task 5-2 with *italic text*
- [x] Another completed task 5-3 with `inline code`
- [ ] Another incomplete task 5-4 with [links](https://example.com)
- [x] Task 5-5 with ~~strikethrough~~ text
- [ ] Task 5-6 with > blockquote content
- [x] Task 5-7 with nested structures
- [ ] Task 5-8 with complex formatting

### Large Text Block 5

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 6

This is section 6 of the medium performance test content.

### Repetitive Lists 6

- Item 6-1 with **bold text** and `inline code`
- Item 6-2 with *italic text* and [links](https://example.com)
- Item 6-3 with ~~strikethrough~~ and > blockquotes
- Item 6-4 with `code spans` and **bold** *italic* text
- Item 6-5 with [external links](https://github.com) and images
- Item 6-6 with nested structures and complex formatting
- Item 6-7 with tables and mathematical expressions
- Item 6-8 with HTML elements and custom styling
- Item 6-9 with task lists and checkboxes
- Item 6-10 with horizontal rules and separators

### Code Block 6

```javascript
// Performance test function 6
function testFunction6() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 6`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 6,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section6'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 6
function processData6(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 6,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash6(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum6(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 6

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 6001 | Test Item 6-1 | 920.563312868534 | Active | Performance | High | test,markdown,section6 | Test item 6-1 for performance testing | 2024-01-01 | 2024-01-02 | 6 |
| 6002 | Test Item 6-2 | 709.3367300210687 | Inactive | Performance | Medium | test,markdown,section6 | Test item 6-2 for performance testing | 2024-01-02 | 2024-01-03 | 6 |
| 6003 | Test Item 6-3 | 300.7013885216243 | Active | Performance | High | test,markdown,section6 | Test item 6-3 for performance testing | 2024-01-03 | 2024-01-04 | 6 |
| 6004 | Test Item 6-4 | 872.5224911178007 | Pending | Performance | Low | test,markdown,section6 | Test item 6-4 for performance testing | 2024-01-04 | 2024-01-05 | 6 |
| 6005 | Test Item 6-5 | 922.637998863475 | Active | Performance | High | test,markdown,section6 | Test item 6-5 for performance testing | 2024-01-05 | 2024-01-06 | 6 |

### Blockquote 6

> This is test blockquote 6 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 6

- [x] Completed task 6-1 with **bold text**
- [ ] Incomplete task 6-2 with *italic text*
- [x] Another completed task 6-3 with `inline code`
- [ ] Another incomplete task 6-4 with [links](https://example.com)
- [x] Task 6-5 with ~~strikethrough~~ text
- [ ] Task 6-6 with > blockquote content
- [x] Task 6-7 with nested structures
- [ ] Task 6-8 with complex formatting

### Large Text Block 6

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 7

This is section 7 of the medium performance test content.

### Repetitive Lists 7

- Item 7-1 with **bold text** and `inline code`
- Item 7-2 with *italic text* and [links](https://example.com)
- Item 7-3 with ~~strikethrough~~ and > blockquotes
- Item 7-4 with `code spans` and **bold** *italic* text
- Item 7-5 with [external links](https://github.com) and images
- Item 7-6 with nested structures and complex formatting
- Item 7-7 with tables and mathematical expressions
- Item 7-8 with HTML elements and custom styling
- Item 7-9 with task lists and checkboxes
- Item 7-10 with horizontal rules and separators

### Code Block 7

```javascript
// Performance test function 7
function testFunction7() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 7`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 7,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section7'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 7
function processData7(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 7,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash7(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum7(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 7

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 7001 | Test Item 7-1 | 296.37664216157435 | Active | Performance | High | test,markdown,section7 | Test item 7-1 for performance testing | 2024-01-01 | 2024-01-02 | 7 |
| 7002 | Test Item 7-2 | 140.85525455097715 | Inactive | Performance | Medium | test,markdown,section7 | Test item 7-2 for performance testing | 2024-01-02 | 2024-01-03 | 7 |
| 7003 | Test Item 7-3 | 461.9854807767192 | Active | Performance | High | test,markdown,section7 | Test item 7-3 for performance testing | 2024-01-03 | 2024-01-04 | 7 |
| 7004 | Test Item 7-4 | 269.8257078170352 | Pending | Performance | Low | test,markdown,section7 | Test item 7-4 for performance testing | 2024-01-04 | 2024-01-05 | 7 |
| 7005 | Test Item 7-5 | 770.8396865096197 | Active | Performance | High | test,markdown,section7 | Test item 7-5 for performance testing | 2024-01-05 | 2024-01-06 | 7 |

### Blockquote 7

> This is test blockquote 7 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 7

- [x] Completed task 7-1 with **bold text**
- [ ] Incomplete task 7-2 with *italic text*
- [x] Another completed task 7-3 with `inline code`
- [ ] Another incomplete task 7-4 with [links](https://example.com)
- [x] Task 7-5 with ~~strikethrough~~ text
- [ ] Task 7-6 with > blockquote content
- [x] Task 7-7 with nested structures
- [ ] Task 7-8 with complex formatting

### Large Text Block 7

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 8

This is section 8 of the medium performance test content.

### Repetitive Lists 8

- Item 8-1 with **bold text** and `inline code`
- Item 8-2 with *italic text* and [links](https://example.com)
- Item 8-3 with ~~strikethrough~~ and > blockquotes
- Item 8-4 with `code spans` and **bold** *italic* text
- Item 8-5 with [external links](https://github.com) and images
- Item 8-6 with nested structures and complex formatting
- Item 8-7 with tables and mathematical expressions
- Item 8-8 with HTML elements and custom styling
- Item 8-9 with task lists and checkboxes
- Item 8-10 with horizontal rules and separators

### Code Block 8

```javascript
// Performance test function 8
function testFunction8() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 8`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 8,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section8'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 8
function processData8(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 8,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash8(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum8(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 8

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 8001 | Test Item 8-1 | 708.9333782098188 | Active | Performance | High | test,markdown,section8 | Test item 8-1 for performance testing | 2024-01-01 | 2024-01-02 | 8 |
| 8002 | Test Item 8-2 | 151.1084244232639 | Inactive | Performance | Medium | test,markdown,section8 | Test item 8-2 for performance testing | 2024-01-02 | 2024-01-03 | 8 |
| 8003 | Test Item 8-3 | 103.17212796251019 | Active | Performance | High | test,markdown,section8 | Test item 8-3 for performance testing | 2024-01-03 | 2024-01-04 | 8 |
| 8004 | Test Item 8-4 | 912.4109546349532 | Pending | Performance | Low | test,markdown,section8 | Test item 8-4 for performance testing | 2024-01-04 | 2024-01-05 | 8 |
| 8005 | Test Item 8-5 | 560.7584102383179 | Active | Performance | High | test,markdown,section8 | Test item 8-5 for performance testing | 2024-01-05 | 2024-01-06 | 8 |

### Blockquote 8

> This is test blockquote 8 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 8

- [x] Completed task 8-1 with **bold text**
- [ ] Incomplete task 8-2 with *italic text*
- [x] Another completed task 8-3 with `inline code`
- [ ] Another incomplete task 8-4 with [links](https://example.com)
- [x] Task 8-5 with ~~strikethrough~~ text
- [ ] Task 8-6 with > blockquote content
- [x] Task 8-7 with nested structures
- [ ] Task 8-8 with complex formatting

### Large Text Block 8

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 9

This is section 9 of the medium performance test content.

### Repetitive Lists 9

- Item 9-1 with **bold text** and `inline code`
- Item 9-2 with *italic text* and [links](https://example.com)
- Item 9-3 with ~~strikethrough~~ and > blockquotes
- Item 9-4 with `code spans` and **bold** *italic* text
- Item 9-5 with [external links](https://github.com) and images
- Item 9-6 with nested structures and complex formatting
- Item 9-7 with tables and mathematical expressions
- Item 9-8 with HTML elements and custom styling
- Item 9-9 with task lists and checkboxes
- Item 9-10 with horizontal rules and separators

### Code Block 9

```javascript
// Performance test function 9
function testFunction9() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 9`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 9,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section9'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 9
function processData9(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 9,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash9(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum9(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 9

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 9001 | Test Item 9-1 | 732.0629197462675 | Active | Performance | High | test,markdown,section9 | Test item 9-1 for performance testing | 2024-01-01 | 2024-01-02 | 9 |
| 9002 | Test Item 9-2 | 756.2977026555511 | Inactive | Performance | Medium | test,markdown,section9 | Test item 9-2 for performance testing | 2024-01-02 | 2024-01-03 | 9 |
| 9003 | Test Item 9-3 | 695.0111142810053 | Active | Performance | High | test,markdown,section9 | Test item 9-3 for performance testing | 2024-01-03 | 2024-01-04 | 9 |
| 9004 | Test Item 9-4 | 617.0639905746617 | Pending | Performance | Low | test,markdown,section9 | Test item 9-4 for performance testing | 2024-01-04 | 2024-01-05 | 9 |
| 9005 | Test Item 9-5 | 35.79236809035646 | Active | Performance | High | test,markdown,section9 | Test item 9-5 for performance testing | 2024-01-05 | 2024-01-06 | 9 |

### Blockquote 9

> This is test blockquote 9 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 9

- [x] Completed task 9-1 with **bold text**
- [ ] Incomplete task 9-2 with *italic text*
- [x] Another completed task 9-3 with `inline code`
- [ ] Another incomplete task 9-4 with [links](https://example.com)
- [x] Task 9-5 with ~~strikethrough~~ text
- [ ] Task 9-6 with > blockquote content
- [x] Task 9-7 with nested structures
- [ ] Task 9-8 with complex formatting

### Large Text Block 9

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 10

This is section 10 of the medium performance test content.

### Repetitive Lists 10

- Item 10-1 with **bold text** and `inline code`
- Item 10-2 with *italic text* and [links](https://example.com)
- Item 10-3 with ~~strikethrough~~ and > blockquotes
- Item 10-4 with `code spans` and **bold** *italic* text
- Item 10-5 with [external links](https://github.com) and images
- Item 10-6 with nested structures and complex formatting
- Item 10-7 with tables and mathematical expressions
- Item 10-8 with HTML elements and custom styling
- Item 10-9 with task lists and checkboxes
- Item 10-10 with horizontal rules and separators

### Code Block 10

```javascript
// Performance test function 10
function testFunction10() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 10`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 10,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section10'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 10
function processData10(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 10,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash10(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum10(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 10

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 10001 | Test Item 10-1 | 143.0770980635898 | Active | Performance | High | test,markdown,section10 | Test item 10-1 for performance testing | 2024-01-01 | 2024-01-02 | 10 |
| 10002 | Test Item 10-2 | 343.7182281431821 | Inactive | Performance | Medium | test,markdown,section10 | Test item 10-2 for performance testing | 2024-01-02 | 2024-01-03 | 10 |
| 10003 | Test Item 10-3 | 903.4313653140132 | Active | Performance | High | test,markdown,section10 | Test item 10-3 for performance testing | 2024-01-03 | 2024-01-04 | 10 |
| 10004 | Test Item 10-4 | 103.69749841833386 | Pending | Performance | Low | test,markdown,section10 | Test item 10-4 for performance testing | 2024-01-04 | 2024-01-05 | 10 |
| 10005 | Test Item 10-5 | 377.95169514290893 | Active | Performance | High | test,markdown,section10 | Test item 10-5 for performance testing | 2024-01-05 | 2024-01-06 | 10 |

### Blockquote 10

> This is test blockquote 10 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 10

- [x] Completed task 10-1 with **bold text**
- [ ] Incomplete task 10-2 with *italic text*
- [x] Another completed task 10-3 with `inline code`
- [ ] Another incomplete task 10-4 with [links](https://example.com)
- [x] Task 10-5 with ~~strikethrough~~ text
- [ ] Task 10-6 with > blockquote content
- [x] Task 10-7 with nested structures
- [ ] Task 10-8 with complex formatting

### Large Text Block 10

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 11

This is section 11 of the medium performance test content.

### Repetitive Lists 11

- Item 11-1 with **bold text** and `inline code`
- Item 11-2 with *italic text* and [links](https://example.com)
- Item 11-3 with ~~strikethrough~~ and > blockquotes
- Item 11-4 with `code spans` and **bold** *italic* text
- Item 11-5 with [external links](https://github.com) and images
- Item 11-6 with nested structures and complex formatting
- Item 11-7 with tables and mathematical expressions
- Item 11-8 with HTML elements and custom styling
- Item 11-9 with task lists and checkboxes
- Item 11-10 with horizontal rules and separators

### Code Block 11

```javascript
// Performance test function 11
function testFunction11() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 11`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 11,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section11'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 11
function processData11(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 11,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash11(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum11(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 11

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 11001 | Test Item 11-1 | 25.369702001680537 | Active | Performance | High | test,markdown,section11 | Test item 11-1 for performance testing | 2024-01-01 | 2024-01-02 | 11 |
| 11002 | Test Item 11-2 | 634.6505604589585 | Inactive | Performance | Medium | test,markdown,section11 | Test item 11-2 for performance testing | 2024-01-02 | 2024-01-03 | 11 |
| 11003 | Test Item 11-3 | 287.61386017055554 | Active | Performance | High | test,markdown,section11 | Test item 11-3 for performance testing | 2024-01-03 | 2024-01-04 | 11 |
| 11004 | Test Item 11-4 | 562.4520052912585 | Pending | Performance | Low | test,markdown,section11 | Test item 11-4 for performance testing | 2024-01-04 | 2024-01-05 | 11 |
| 11005 | Test Item 11-5 | 325.4694440625001 | Active | Performance | High | test,markdown,section11 | Test item 11-5 for performance testing | 2024-01-05 | 2024-01-06 | 11 |

### Blockquote 11

> This is test blockquote 11 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 11

- [x] Completed task 11-1 with **bold text**
- [ ] Incomplete task 11-2 with *italic text*
- [x] Another completed task 11-3 with `inline code`
- [ ] Another incomplete task 11-4 with [links](https://example.com)
- [x] Task 11-5 with ~~strikethrough~~ text
- [ ] Task 11-6 with > blockquote content
- [x] Task 11-7 with nested structures
- [ ] Task 11-8 with complex formatting

### Large Text Block 11

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 12

This is section 12 of the medium performance test content.

### Repetitive Lists 12

- Item 12-1 with **bold text** and `inline code`
- Item 12-2 with *italic text* and [links](https://example.com)
- Item 12-3 with ~~strikethrough~~ and > blockquotes
- Item 12-4 with `code spans` and **bold** *italic* text
- Item 12-5 with [external links](https://github.com) and images
- Item 12-6 with nested structures and complex formatting
- Item 12-7 with tables and mathematical expressions
- Item 12-8 with HTML elements and custom styling
- Item 12-9 with task lists and checkboxes
- Item 12-10 with horizontal rules and separators

### Code Block 12

```javascript
// Performance test function 12
function testFunction12() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 12`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 12,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section12'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 12
function processData12(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 12,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash12(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum12(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 12

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 12001 | Test Item 12-1 | 323.74579380168257 | Active | Performance | High | test,markdown,section12 | Test item 12-1 for performance testing | 2024-01-01 | 2024-01-02 | 12 |
| 12002 | Test Item 12-2 | 880.8085773132264 | Inactive | Performance | Medium | test,markdown,section12 | Test item 12-2 for performance testing | 2024-01-02 | 2024-01-03 | 12 |
| 12003 | Test Item 12-3 | 176.6044640244222 | Active | Performance | High | test,markdown,section12 | Test item 12-3 for performance testing | 2024-01-03 | 2024-01-04 | 12 |
| 12004 | Test Item 12-4 | 389.92556166175183 | Pending | Performance | Low | test,markdown,section12 | Test item 12-4 for performance testing | 2024-01-04 | 2024-01-05 | 12 |
| 12005 | Test Item 12-5 | 747.2485237164002 | Active | Performance | High | test,markdown,section12 | Test item 12-5 for performance testing | 2024-01-05 | 2024-01-06 | 12 |

### Blockquote 12

> This is test blockquote 12 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 12

- [x] Completed task 12-1 with **bold text**
- [ ] Incomplete task 12-2 with *italic text*
- [x] Another completed task 12-3 with `inline code`
- [ ] Another incomplete task 12-4 with [links](https://example.com)
- [x] Task 12-5 with ~~strikethrough~~ text
- [ ] Task 12-6 with > blockquote content
- [x] Task 12-7 with nested structures
- [ ] Task 12-8 with complex formatting

### Large Text Block 12

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 13

This is section 13 of the medium performance test content.

### Repetitive Lists 13

- Item 13-1 with **bold text** and `inline code`
- Item 13-2 with *italic text* and [links](https://example.com)
- Item 13-3 with ~~strikethrough~~ and > blockquotes
- Item 13-4 with `code spans` and **bold** *italic* text
- Item 13-5 with [external links](https://github.com) and images
- Item 13-6 with nested structures and complex formatting
- Item 13-7 with tables and mathematical expressions
- Item 13-8 with HTML elements and custom styling
- Item 13-9 with task lists and checkboxes
- Item 13-10 with horizontal rules and separators

### Code Block 13

```javascript
// Performance test function 13
function testFunction13() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 13`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 13,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section13'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 13
function processData13(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 13,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash13(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum13(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 13

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 13001 | Test Item 13-1 | 215.41880617636645 | Active | Performance | High | test,markdown,section13 | Test item 13-1 for performance testing | 2024-01-01 | 2024-01-02 | 13 |
| 13002 | Test Item 13-2 | 352.39634772167716 | Inactive | Performance | Medium | test,markdown,section13 | Test item 13-2 for performance testing | 2024-01-02 | 2024-01-03 | 13 |
| 13003 | Test Item 13-3 | 543.9790367691523 | Active | Performance | High | test,markdown,section13 | Test item 13-3 for performance testing | 2024-01-03 | 2024-01-04 | 13 |
| 13004 | Test Item 13-4 | 652.418668585711 | Pending | Performance | Low | test,markdown,section13 | Test item 13-4 for performance testing | 2024-01-04 | 2024-01-05 | 13 |
| 13005 | Test Item 13-5 | 787.3712983465531 | Active | Performance | High | test,markdown,section13 | Test item 13-5 for performance testing | 2024-01-05 | 2024-01-06 | 13 |

### Blockquote 13

> This is test blockquote 13 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 13

- [x] Completed task 13-1 with **bold text**
- [ ] Incomplete task 13-2 with *italic text*
- [x] Another completed task 13-3 with `inline code`
- [ ] Another incomplete task 13-4 with [links](https://example.com)
- [x] Task 13-5 with ~~strikethrough~~ text
- [ ] Task 13-6 with > blockquote content
- [x] Task 13-7 with nested structures
- [ ] Task 13-8 with complex formatting

### Large Text Block 13

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 14

This is section 14 of the medium performance test content.

### Repetitive Lists 14

- Item 14-1 with **bold text** and `inline code`
- Item 14-2 with *italic text* and [links](https://example.com)
- Item 14-3 with ~~strikethrough~~ and > blockquotes
- Item 14-4 with `code spans` and **bold** *italic* text
- Item 14-5 with [external links](https://github.com) and images
- Item 14-6 with nested structures and complex formatting
- Item 14-7 with tables and mathematical expressions
- Item 14-8 with HTML elements and custom styling
- Item 14-9 with task lists and checkboxes
- Item 14-10 with horizontal rules and separators

### Code Block 14

```javascript
// Performance test function 14
function testFunction14() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 14`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 14,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section14'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 14
function processData14(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 14,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash14(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum14(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 14

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 14001 | Test Item 14-1 | 777.081591261473 | Active | Performance | High | test,markdown,section14 | Test item 14-1 for performance testing | 2024-01-01 | 2024-01-02 | 14 |
| 14002 | Test Item 14-2 | 97.98265547323327 | Inactive | Performance | Medium | test,markdown,section14 | Test item 14-2 for performance testing | 2024-01-02 | 2024-01-03 | 14 |
| 14003 | Test Item 14-3 | 333.5401465178154 | Active | Performance | High | test,markdown,section14 | Test item 14-3 for performance testing | 2024-01-03 | 2024-01-04 | 14 |
| 14004 | Test Item 14-4 | 527.4711602832589 | Pending | Performance | Low | test,markdown,section14 | Test item 14-4 for performance testing | 2024-01-04 | 2024-01-05 | 14 |
| 14005 | Test Item 14-5 | 593.6200942918439 | Active | Performance | High | test,markdown,section14 | Test item 14-5 for performance testing | 2024-01-05 | 2024-01-06 | 14 |

### Blockquote 14

> This is test blockquote 14 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 14

- [x] Completed task 14-1 with **bold text**
- [ ] Incomplete task 14-2 with *italic text*
- [x] Another completed task 14-3 with `inline code`
- [ ] Another incomplete task 14-4 with [links](https://example.com)
- [x] Task 14-5 with ~~strikethrough~~ text
- [ ] Task 14-6 with > blockquote content
- [x] Task 14-7 with nested structures
- [ ] Task 14-8 with complex formatting

### Large Text Block 14

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 15

This is section 15 of the medium performance test content.

### Repetitive Lists 15

- Item 15-1 with **bold text** and `inline code`
- Item 15-2 with *italic text* and [links](https://example.com)
- Item 15-3 with ~~strikethrough~~ and > blockquotes
- Item 15-4 with `code spans` and **bold** *italic* text
- Item 15-5 with [external links](https://github.com) and images
- Item 15-6 with nested structures and complex formatting
- Item 15-7 with tables and mathematical expressions
- Item 15-8 with HTML elements and custom styling
- Item 15-9 with task lists and checkboxes
- Item 15-10 with horizontal rules and separators

### Code Block 15

```javascript
// Performance test function 15
function testFunction15() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 15`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 15,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section15'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 15
function processData15(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 15,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash15(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum15(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 15

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 15001 | Test Item 15-1 | 252.07165650665698 | Active | Performance | High | test,markdown,section15 | Test item 15-1 for performance testing | 2024-01-01 | 2024-01-02 | 15 |
| 15002 | Test Item 15-2 | 318.00157115570846 | Inactive | Performance | Medium | test,markdown,section15 | Test item 15-2 for performance testing | 2024-01-02 | 2024-01-03 | 15 |
| 15003 | Test Item 15-3 | 209.88394521865672 | Active | Performance | High | test,markdown,section15 | Test item 15-3 for performance testing | 2024-01-03 | 2024-01-04 | 15 |
| 15004 | Test Item 15-4 | 430.6443980549175 | Pending | Performance | Low | test,markdown,section15 | Test item 15-4 for performance testing | 2024-01-04 | 2024-01-05 | 15 |
| 15005 | Test Item 15-5 | 471.428887532964 | Active | Performance | High | test,markdown,section15 | Test item 15-5 for performance testing | 2024-01-05 | 2024-01-06 | 15 |

### Blockquote 15

> This is test blockquote 15 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 15

- [x] Completed task 15-1 with **bold text**
- [ ] Incomplete task 15-2 with *italic text*
- [x] Another completed task 15-3 with `inline code`
- [ ] Another incomplete task 15-4 with [links](https://example.com)
- [x] Task 15-5 with ~~strikethrough~~ text
- [ ] Task 15-6 with > blockquote content
- [x] Task 15-7 with nested structures
- [ ] Task 15-8 with complex formatting

### Large Text Block 15

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 16

This is section 16 of the medium performance test content.

### Repetitive Lists 16

- Item 16-1 with **bold text** and `inline code`
- Item 16-2 with *italic text* and [links](https://example.com)
- Item 16-3 with ~~strikethrough~~ and > blockquotes
- Item 16-4 with `code spans` and **bold** *italic* text
- Item 16-5 with [external links](https://github.com) and images
- Item 16-6 with nested structures and complex formatting
- Item 16-7 with tables and mathematical expressions
- Item 16-8 with HTML elements and custom styling
- Item 16-9 with task lists and checkboxes
- Item 16-10 with horizontal rules and separators

### Code Block 16

```javascript
// Performance test function 16
function testFunction16() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 16`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 16,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section16'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 16
function processData16(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 16,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash16(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum16(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 16

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 16001 | Test Item 16-1 | 303.8881250444212 | Active | Performance | High | test,markdown,section16 | Test item 16-1 for performance testing | 2024-01-01 | 2024-01-02 | 16 |
| 16002 | Test Item 16-2 | 863.8496288352364 | Inactive | Performance | Medium | test,markdown,section16 | Test item 16-2 for performance testing | 2024-01-02 | 2024-01-03 | 16 |
| 16003 | Test Item 16-3 | 151.62834071081676 | Active | Performance | High | test,markdown,section16 | Test item 16-3 for performance testing | 2024-01-03 | 2024-01-04 | 16 |
| 16004 | Test Item 16-4 | 515.5935846445325 | Pending | Performance | Low | test,markdown,section16 | Test item 16-4 for performance testing | 2024-01-04 | 2024-01-05 | 16 |
| 16005 | Test Item 16-5 | 610.3564768217022 | Active | Performance | High | test,markdown,section16 | Test item 16-5 for performance testing | 2024-01-05 | 2024-01-06 | 16 |

### Blockquote 16

> This is test blockquote 16 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 16

- [x] Completed task 16-1 with **bold text**
- [ ] Incomplete task 16-2 with *italic text*
- [x] Another completed task 16-3 with `inline code`
- [ ] Another incomplete task 16-4 with [links](https://example.com)
- [x] Task 16-5 with ~~strikethrough~~ text
- [ ] Task 16-6 with > blockquote content
- [x] Task 16-7 with nested structures
- [ ] Task 16-8 with complex formatting

### Large Text Block 16

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 17

This is section 17 of the medium performance test content.

### Repetitive Lists 17

- Item 17-1 with **bold text** and `inline code`
- Item 17-2 with *italic text* and [links](https://example.com)
- Item 17-3 with ~~strikethrough~~ and > blockquotes
- Item 17-4 with `code spans` and **bold** *italic* text
- Item 17-5 with [external links](https://github.com) and images
- Item 17-6 with nested structures and complex formatting
- Item 17-7 with tables and mathematical expressions
- Item 17-8 with HTML elements and custom styling
- Item 17-9 with task lists and checkboxes
- Item 17-10 with horizontal rules and separators

### Code Block 17

```javascript
// Performance test function 17
function testFunction17() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 17`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 17,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section17'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 17
function processData17(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 17,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash17(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum17(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 17

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 17001 | Test Item 17-1 | 590.3927723963307 | Active | Performance | High | test,markdown,section17 | Test item 17-1 for performance testing | 2024-01-01 | 2024-01-02 | 17 |
| 17002 | Test Item 17-2 | 655.7820646612076 | Inactive | Performance | Medium | test,markdown,section17 | Test item 17-2 for performance testing | 2024-01-02 | 2024-01-03 | 17 |
| 17003 | Test Item 17-3 | 579.0092521261079 | Active | Performance | High | test,markdown,section17 | Test item 17-3 for performance testing | 2024-01-03 | 2024-01-04 | 17 |
| 17004 | Test Item 17-4 | 671.9176321538845 | Pending | Performance | Low | test,markdown,section17 | Test item 17-4 for performance testing | 2024-01-04 | 2024-01-05 | 17 |
| 17005 | Test Item 17-5 | 398.61087416733886 | Active | Performance | High | test,markdown,section17 | Test item 17-5 for performance testing | 2024-01-05 | 2024-01-06 | 17 |

### Blockquote 17

> This is test blockquote 17 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 17

- [x] Completed task 17-1 with **bold text**
- [ ] Incomplete task 17-2 with *italic text*
- [x] Another completed task 17-3 with `inline code`
- [ ] Another incomplete task 17-4 with [links](https://example.com)
- [x] Task 17-5 with ~~strikethrough~~ text
- [ ] Task 17-6 with > blockquote content
- [x] Task 17-7 with nested structures
- [ ] Task 17-8 with complex formatting

### Large Text Block 17

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 18

This is section 18 of the medium performance test content.

### Repetitive Lists 18

- Item 18-1 with **bold text** and `inline code`
- Item 18-2 with *italic text* and [links](https://example.com)
- Item 18-3 with ~~strikethrough~~ and > blockquotes
- Item 18-4 with `code spans` and **bold** *italic* text
- Item 18-5 with [external links](https://github.com) and images
- Item 18-6 with nested structures and complex formatting
- Item 18-7 with tables and mathematical expressions
- Item 18-8 with HTML elements and custom styling
- Item 18-9 with task lists and checkboxes
- Item 18-10 with horizontal rules and separators

### Code Block 18

```javascript
// Performance test function 18
function testFunction18() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 18`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 18,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section18'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 18
function processData18(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 18,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash18(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum18(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 18

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 18001 | Test Item 18-1 | 586.8407917200793 | Active | Performance | High | test,markdown,section18 | Test item 18-1 for performance testing | 2024-01-01 | 2024-01-02 | 18 |
| 18002 | Test Item 18-2 | 603.0124921509306 | Inactive | Performance | Medium | test,markdown,section18 | Test item 18-2 for performance testing | 2024-01-02 | 2024-01-03 | 18 |
| 18003 | Test Item 18-3 | 243.44804241023675 | Active | Performance | High | test,markdown,section18 | Test item 18-3 for performance testing | 2024-01-03 | 2024-01-04 | 18 |
| 18004 | Test Item 18-4 | 493.55004463816266 | Pending | Performance | Low | test,markdown,section18 | Test item 18-4 for performance testing | 2024-01-04 | 2024-01-05 | 18 |
| 18005 | Test Item 18-5 | 764.4234317025875 | Active | Performance | High | test,markdown,section18 | Test item 18-5 for performance testing | 2024-01-05 | 2024-01-06 | 18 |

### Blockquote 18

> This is test blockquote 18 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 18

- [x] Completed task 18-1 with **bold text**
- [ ] Incomplete task 18-2 with *italic text*
- [x] Another completed task 18-3 with `inline code`
- [ ] Another incomplete task 18-4 with [links](https://example.com)
- [x] Task 18-5 with ~~strikethrough~~ text
- [ ] Task 18-6 with > blockquote content
- [x] Task 18-7 with nested structures
- [ ] Task 18-8 with complex formatting

### Large Text Block 18

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Performance Test Section 19

This is section 19 of the medium performance test content.

### Repetitive Lists 19

- Item 19-1 with **bold text** and `inline code`
- Item 19-2 with *italic text* and [links](https://example.com)
- Item 19-3 with ~~strikethrough~~ and > blockquotes
- Item 19-4 with `code spans` and **bold** *italic* text
- Item 19-5 with [external links](https://github.com) and images
- Item 19-6 with nested structures and complex formatting
- Item 19-7 with tables and mathematical expressions
- Item 19-8 with HTML elements and custom styling
- Item 19-9 with task lists and checkboxes
- Item 19-10 with horizontal rules and separators

### Code Block 19

```javascript
// Performance test function 19
function testFunction19() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 19`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 19,
      metadata: {
        category: 'test',
        status: 'active',
        priority: Math.floor(Math.random() * 5) + 1,
        tags: ['performance', 'test', 'markdown', 'section19'],
        description: `This is a test item for performance testing in section ${sectionCount}`
      }
    });
  }
  return data;
}

// Additional utility functions for section 19
function processData19(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    section: 19,
    hash: generateHash(item),
    checksum: calculateChecksum(item),
    processedAt: new Date().toISOString()
  }));
}

function generateHash19(item) {
  return btoa(JSON.stringify(item)).substring(0, 16);
}

function calculateChecksum19(item) {
  let sum = 0;
  const str = JSON.stringify(item);
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum % 10000;
}
```

### Table 19

| ID | Name | Value | Status | Category | Priority | Tags | Description | Created | Updated | Section |
|----|------|-------|--------|----------|----------|------|-------------|---------|---------|---------|
| 19001 | Test Item 19-1 | 582.1697902306378 | Active | Performance | High | test,markdown,section19 | Test item 19-1 for performance testing | 2024-01-01 | 2024-01-02 | 19 |
| 19002 | Test Item 19-2 | 533.5217556796548 | Inactive | Performance | Medium | test,markdown,section19 | Test item 19-2 for performance testing | 2024-01-02 | 2024-01-03 | 19 |
| 19003 | Test Item 19-3 | 454.051543786163 | Active | Performance | High | test,markdown,section19 | Test item 19-3 for performance testing | 2024-01-03 | 2024-01-04 | 19 |
| 19004 | Test Item 19-4 | 10.591863709143778 | Pending | Performance | Low | test,markdown,section19 | Test item 19-4 for performance testing | 2024-01-04 | 2024-01-05 | 19 |
| 19005 | Test Item 19-5 | 781.5547876987172 | Active | Performance | High | test,markdown,section19 | Test item 19-5 for performance testing | 2024-01-05 | 2024-01-06 | 19 |

### Blockquote 19

> This is test blockquote 19 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with medium documents.
> This blockquote contains multiple lines and various formatting elements.

### Task List 19

- [x] Completed task 19-1 with **bold text**
- [ ] Incomplete task 19-2 with *italic text*
- [x] Another completed task 19-3 with `inline code`
- [ ] Another incomplete task 19-4 with [links](https://example.com)
- [x] Task 19-5 with ~~strikethrough~~ text
- [ ] Task 19-6 with > blockquote content
- [x] Task 19-7 with nested structures
- [ ] Task 19-8 with complex formatting

### Large Text Block 19

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollit anim id est laborum et dolorum fuga.

---


## Conclusion

This medium markdown test document contains 19 sections with:

- **Multiple header levels** (H1-H6)
- **Various text formatting** (bold, italic, strikethrough, inline code)
- **Complex lists** (ordered, unordered, nested, mixed)
- **Code blocks** in JavaScript with complex functions
- **Tables** with various structures and content
- **Links and images** (external and internal)
- **Blockquotes** (simple and nested)
- **Horizontal rules** with different syntax
- **Task lists** with checkboxes
- **Complex nested structures** combining multiple elements

Total file size: 94.75KB
Total sections: 19

The document is designed to test markdown parsing performance at the medium size level.

---

*End of medium test document*
