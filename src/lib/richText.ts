type Block = { type: 'quote' | 'list' | 'p'; lines: string[] }

export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = []
  for (const line of text.split('\n')) {
    const type: Block['type'] = line.startsWith('> ') ? 'quote' : line.startsWith('- ') ? 'list' : 'p'
    const content = type === 'p' ? line : line.slice(2)
    const last = blocks[blocks.length - 1]
    if (last && last.type === type) {
      last.lines.push(content)
    } else {
      blocks.push({ type, lines: [content] })
    }
  }
  return blocks
}

export type InlineToken = { text: string; bold?: boolean; italic?: boolean; underline?: boolean }

export function parseInline(text: string): InlineToken[] {
  if (!text) return []
  const parts = text.split(/(\*\*.+?\*\*|\+\+.+?\+\+|_.+?_)/g).filter((p) => p !== '')
  return parts.map((part) => {
    if (part.length >= 4 && part.startsWith('**') && part.endsWith('**')) {
      return { text: part.slice(2, -2), bold: true }
    }
    if (part.length >= 4 && part.startsWith('++') && part.endsWith('++')) {
      return { text: part.slice(2, -2), underline: true }
    }
    if (part.length >= 2 && part.startsWith('_') && part.endsWith('_')) {
      return { text: part.slice(1, -1), italic: true }
    }
    return { text: part }
  })
}
