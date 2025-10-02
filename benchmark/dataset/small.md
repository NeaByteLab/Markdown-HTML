# Small Performance Test Document

This document tests markdown parsing performance at the small size level (18.95 KB).

## Document Structure

This document contains various markdown elements:

- **Headers** of different levels
- **Text formatting** (bold, italic, strikethrough)
- **Lists** (ordered and unordered)
- **Code blocks** in JavaScript
- **Tables** with data
- **Links** and **images**
- **Blockquotes** with nested content
- **Task lists** with checkboxes

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
| Small | 18.95 KB | 19.91 KB | **0.41ms** | **46k chars/ms** |

## Blockquotes

> This is a blockquote with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance.

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

This is section 1 of the small performance test content.

### Repetitive Lists 1

- Item 1-1 with **bold text** and `inline code`
- Item 1-2 with *italic text* and [links](https://example.com)
- Item 1-3 with ~~strikethrough~~ and > blockquotes
- Item 1-4 with `code spans` and **bold** *italic* text
- Item 1-5 with [external links](https://github.com) and images

### Code Block 1

```javascript
// Performance test function 1
function testFunction1() {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 1`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 1
    });
  }
  return data;
}
```

### Table 1

| ID | Name | Value | Status | Section |
|----|------|-------|--------|---------|
| 1001 | Test Item 1-1 | 243.50303816252116 | Active | 1 |
| 1002 | Test Item 1-2 | 192.44206011274457 | Inactive | 1 |
| 1003 | Test Item 1-3 | 975.3518060996773 | Active | 1 |

### Blockquote 1

> This is test blockquote 1 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with small documents.

### Task List 1

- [x] Completed task 1-1 with **bold text**
- [ ] Incomplete task 1-2 with *italic text*
- [x] Another completed task 1-3 with `inline code`
- [ ] Another incomplete task 1-4 with [links](https://example.com)

### Large Text Block 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

---


## Performance Test Section 2

This is section 2 of the small performance test content.

### Repetitive Lists 2

- Item 2-1 with **bold text** and `inline code`
- Item 2-2 with *italic text* and [links](https://example.com)
- Item 2-3 with ~~strikethrough~~ and > blockquotes
- Item 2-4 with `code spans` and **bold** *italic* text
- Item 2-5 with [external links](https://github.com) and images

### Code Block 2

```javascript
// Performance test function 2
function testFunction2() {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 2`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 2
    });
  }
  return data;
}
```

### Table 2

| ID | Name | Value | Status | Section |
|----|------|-------|--------|---------|
| 2001 | Test Item 2-1 | 516.9293045298331 | Active | 2 |
| 2002 | Test Item 2-2 | 872.7957767158108 | Inactive | 2 |
| 2003 | Test Item 2-3 | 876.6367115633714 | Active | 2 |

### Blockquote 2

> This is test blockquote 2 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with small documents.

### Task List 2

- [x] Completed task 2-1 with **bold text**
- [ ] Incomplete task 2-2 with *italic text*
- [x] Another completed task 2-3 with `inline code`
- [ ] Another incomplete task 2-4 with [links](https://example.com)

### Large Text Block 2

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

---


## Performance Test Section 3

This is section 3 of the small performance test content.

### Repetitive Lists 3

- Item 3-1 with **bold text** and `inline code`
- Item 3-2 with *italic text* and [links](https://example.com)
- Item 3-3 with ~~strikethrough~~ and > blockquotes
- Item 3-4 with `code spans` and **bold** *italic* text
- Item 3-5 with [external links](https://github.com) and images

### Code Block 3

```javascript
// Performance test function 3
function testFunction3() {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 3`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 3
    });
  }
  return data;
}
```

### Table 3

| ID | Name | Value | Status | Section |
|----|------|-------|--------|---------|
| 3001 | Test Item 3-1 | 19.755032863926438 | Active | 3 |
| 3002 | Test Item 3-2 | 762.7029596571615 | Inactive | 3 |
| 3003 | Test Item 3-3 | 625.9835241621507 | Active | 3 |

### Blockquote 3

> This is test blockquote 3 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with small documents.

### Task List 3

- [x] Completed task 3-1 with **bold text**
- [ ] Incomplete task 3-2 with *italic text*
- [x] Another completed task 3-3 with `inline code`
- [ ] Another incomplete task 3-4 with [links](https://example.com)

### Large Text Block 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

---


## Performance Test Section 4

This is section 4 of the small performance test content.

### Repetitive Lists 4

- Item 4-1 with **bold text** and `inline code`
- Item 4-2 with *italic text* and [links](https://example.com)
- Item 4-3 with ~~strikethrough~~ and > blockquotes
- Item 4-4 with `code spans` and **bold** *italic* text
- Item 4-5 with [external links](https://github.com) and images

### Code Block 4

```javascript
// Performance test function 4
function testFunction4() {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 4`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 4
    });
  }
  return data;
}
```

### Table 4

| ID | Name | Value | Status | Section |
|----|------|-------|--------|---------|
| 4001 | Test Item 4-1 | 688.1279736587837 | Active | 4 |
| 4002 | Test Item 4-2 | 220.96611977104263 | Inactive | 4 |
| 4003 | Test Item 4-3 | 987.6416271696036 | Active | 4 |

### Blockquote 4

> This is test blockquote 4 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with small documents.

### Task List 4

- [x] Completed task 4-1 with **bold text**
- [ ] Incomplete task 4-2 with *italic text*
- [x] Another completed task 4-3 with `inline code`
- [ ] Another incomplete task 4-4 with [links](https://example.com)

### Large Text Block 4

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

---


## Performance Test Section 5

This is section 5 of the small performance test content.

### Repetitive Lists 5

- Item 5-1 with **bold text** and `inline code`
- Item 5-2 with *italic text* and [links](https://example.com)
- Item 5-3 with ~~strikethrough~~ and > blockquotes
- Item 5-4 with `code spans` and **bold** *italic* text
- Item 5-5 with [external links](https://github.com) and images

### Code Block 5

```javascript
// Performance test function 5
function testFunction5() {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 5`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 5
    });
  }
  return data;
}
```

### Table 5

| ID | Name | Value | Status | Section |
|----|------|-------|--------|---------|
| 5001 | Test Item 5-1 | 346.4859262822386 | Active | 5 |
| 5002 | Test Item 5-2 | 336.2286027806367 | Inactive | 5 |
| 5003 | Test Item 5-3 | 186.22984040959412 | Active | 5 |

### Blockquote 5

> This is test blockquote 5 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with small documents.

### Task List 5

- [x] Completed task 5-1 with **bold text**
- [ ] Incomplete task 5-2 with *italic text*
- [x] Another completed task 5-3 with `inline code`
- [ ] Another incomplete task 5-4 with [links](https://example.com)

### Large Text Block 5

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

---


## Performance Test Section 6

This is section 6 of the small performance test content.

### Repetitive Lists 6

- Item 6-1 with **bold text** and `inline code`
- Item 6-2 with *italic text* and [links](https://example.com)
- Item 6-3 with ~~strikethrough~~ and > blockquotes
- Item 6-4 with `code spans` and **bold** *italic* text
- Item 6-5 with [external links](https://github.com) and images

### Code Block 6

```javascript
// Performance test function 6
function testFunction6() {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 6`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 6
    });
  }
  return data;
}
```

### Table 6

| ID | Name | Value | Status | Section |
|----|------|-------|--------|---------|
| 6001 | Test Item 6-1 | 359.7666200481002 | Active | 6 |
| 6002 | Test Item 6-2 | 857.7047177383901 | Inactive | 6 |
| 6003 | Test Item 6-3 | 729.7528075768338 | Active | 6 |

### Blockquote 6

> This is test blockquote 6 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with small documents.

### Task List 6

- [x] Completed task 6-1 with **bold text**
- [ ] Incomplete task 6-2 with *italic text*
- [x] Another completed task 6-3 with `inline code`
- [ ] Another incomplete task 6-4 with [links](https://example.com)

### Large Text Block 6

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

---


## Performance Test Section 7

This is section 7 of the small performance test content.

### Repetitive Lists 7

- Item 7-1 with **bold text** and `inline code`
- Item 7-2 with *italic text* and [links](https://example.com)
- Item 7-3 with ~~strikethrough~~ and > blockquotes
- Item 7-4 with `code spans` and **bold** *italic* text
- Item 7-5 with [external links](https://github.com) and images

### Code Block 7

```javascript
// Performance test function 7
function testFunction7() {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 7`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 7
    });
  }
  return data;
}
```

### Table 7

| ID | Name | Value | Status | Section |
|----|------|-------|--------|---------|
| 7001 | Test Item 7-1 | 266.4495880993052 | Active | 7 |
| 7002 | Test Item 7-2 | 68.87673552869367 | Inactive | 7 |
| 7003 | Test Item 7-3 | 287.9264485714783 | Active | 7 |

### Blockquote 7

> This is test blockquote 7 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with small documents.

### Task List 7

- [x] Completed task 7-1 with **bold text**
- [ ] Incomplete task 7-2 with *italic text*
- [x] Another completed task 7-3 with `inline code`
- [ ] Another incomplete task 7-4 with [links](https://example.com)

### Large Text Block 7

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

---


## Performance Test Section 8

This is section 8 of the small performance test content.

### Repetitive Lists 8

- Item 8-1 with **bold text** and `inline code`
- Item 8-2 with *italic text* and [links](https://example.com)
- Item 8-3 with ~~strikethrough~~ and > blockquotes
- Item 8-4 with `code spans` and **bold** *italic* text
- Item 8-5 with [external links](https://github.com) and images

### Code Block 8

```javascript
// Performance test function 8
function testFunction8() {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 8`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 8
    });
  }
  return data;
}
```

### Table 8

| ID | Name | Value | Status | Section |
|----|------|-------|--------|---------|
| 8001 | Test Item 8-1 | 264.8928294734374 | Active | 8 |
| 8002 | Test Item 8-2 | 208.52366044030157 | Inactive | 8 |
| 8003 | Test Item 8-3 | 836.4610227649673 | Active | 8 |

### Blockquote 8

> This is test blockquote 8 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with small documents.

### Task List 8

- [x] Completed task 8-1 with **bold text**
- [ ] Incomplete task 8-2 with *italic text*
- [x] Another completed task 8-3 with `inline code`
- [ ] Another incomplete task 8-4 with [links](https://example.com)

### Large Text Block 8

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

---


## Performance Test Section 9

This is section 9 of the small performance test content.

### Repetitive Lists 9

- Item 9-1 with **bold text** and `inline code`
- Item 9-2 with *italic text* and [links](https://example.com)
- Item 9-3 with ~~strikethrough~~ and > blockquotes
- Item 9-4 with `code spans` and **bold** *italic* text
- Item 9-5 with [external links](https://github.com) and images

### Code Block 9

```javascript
// Performance test function 9
function testFunction9() {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 9`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 9
    });
  }
  return data;
}
```

### Table 9

| ID | Name | Value | Status | Section |
|----|------|-------|--------|---------|
| 9001 | Test Item 9-1 | 681.1741949688766 | Active | 9 |
| 9002 | Test Item 9-2 | 382.04408882070504 | Inactive | 9 |
| 9003 | Test Item 9-3 | 223.2804254241112 | Active | 9 |

### Blockquote 9

> This is test blockquote 9 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with small documents.

### Task List 9

- [x] Completed task 9-1 with **bold text**
- [ ] Incomplete task 9-2 with *italic text*
- [x] Another completed task 9-3 with `inline code`
- [ ] Another incomplete task 9-4 with [links](https://example.com)

### Large Text Block 9

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

---


## Performance Test Section 10

This is section 10 of the small performance test content.

### Repetitive Lists 10

- Item 10-1 with **bold text** and `inline code`
- Item 10-2 with *italic text* and [links](https://example.com)
- Item 10-3 with ~~strikethrough~~ and > blockquotes
- Item 10-4 with `code spans` and **bold** *italic* text
- Item 10-5 with [external links](https://github.com) and images

### Code Block 10

```javascript
// Performance test function 10
function testFunction10() {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i,
      name: `Item ${i} from section 10`,
      value: Math.random() * 100,
      timestamp: new Date().getTime(),
      section: 10
    });
  }
  return data;
}
```

### Table 10

| ID | Name | Value | Status | Section |
|----|------|-------|--------|---------|
| 10001 | Test Item 10-1 | 118.38391733731979 | Active | 10 |
| 10002 | Test Item 10-2 | 529.2154104030656 | Inactive | 10 |
| 10003 | Test Item 10-3 | 207.03454884046945 | Active | 10 |

### Blockquote 10

> This is test blockquote 10 with **bold text** and *italic text*.
> It contains `inline code` and [links](https://example.com).
> The content is designed to test parsing performance with small documents.

### Task List 10

- [x] Completed task 10-1 with **bold text**
- [ ] Incomplete task 10-2 with *italic text*
- [x] Another completed task 10-3 with `inline code`
- [ ] Another incomplete task 10-4 with [links](https://example.com)

### Large Text Block 10

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

---


## Conclusion

This small markdown test document contains 10 sections with:

- **Multiple header levels** (H1-H6)
- **Various text formatting** (bold, italic, strikethrough, inline code)
- **Complex lists** (ordered, unordered, nested, mixed)
- **Code blocks** in JavaScript with complex functions
- **Tables** with various structures and content
- **Links and images** (external and internal)
- **Blockquotes** (simple and nested)
- **Horizontal rules** with different syntax
- **Task lists** with checkboxes

Total file size: 20.11KB
Total sections: 10

The document is designed to test markdown parsing performance at the small size level.

---

*End of small test document*
