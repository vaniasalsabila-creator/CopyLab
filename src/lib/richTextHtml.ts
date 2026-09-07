import { parseBlocks, parseInline } from './richText'

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inlineToHtml(text: string): string {
  if (text === '') return '<br>'
  return parseInline(text)
    .map((token) => {
      let html = escapeHtml(token.text)
      if (token.bold) html = `<b>${html}</b>`
      if (token.italic) html = `<i>${html}</i>`
      if (token.underline) html = `<u>${html}</u>`
      return html
    })
    .join('')
}

/** Converts a markup string into the HTML used to seed a contentEditable box, one <div> per line. */
export function markupToHtml(text: string): string {
  if (text === '') return ''
  return parseBlocks(text)
    .map((block) => {
      if (block.type === 'quote') {
        return `<blockquote>${block.lines.map((line) => `<div>${inlineToHtml(line)}</div>`).join('')}</blockquote>`
      }
      if (block.type === 'list') {
        return `<ul>${block.lines.map((line) => `<li>${inlineToHtml(line)}</li>`).join('')}</ul>`
      }
      return block.lines.map((line) => `<div>${inlineToHtml(line)}</div>`).join('')
    })
    .join('')
}

const BLOCK_TAGS = new Set(['div', 'p'])

function inlineNodeToMarkup(node: Node): string {
  let out = ''
  const children = Array.from(node.childNodes)
  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE) {
      out += child.textContent ?? ''
      continue
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue
    const el = child as HTMLElement
    const tag = el.tagName.toLowerCase()
    if (tag === 'br') {
      out += '\n'
    } else if (tag === 'b' || tag === 'strong') {
      out += `**${inlineNodeToMarkup(el)}**`
    } else if (tag === 'i' || tag === 'em') {
      out += `_${inlineNodeToMarkup(el)}_`
    } else if (tag === 'u') {
      out += `++${inlineNodeToMarkup(el)}++`
    } else if (BLOCK_TAGS.has(tag)) {
      out += (out ? '\n' : '') + inlineNodeToMarkup(el)
    } else {
      out += inlineNodeToMarkup(el)
    }
  }

  // Browsers pad an otherwise-empty block with a trailing <br> just to keep it
  // visible/focusable - it marks "this block has no more content", not a real
  // line break, so it shouldn't introduce a second blank line on top of the
  // one the enclosing block already represents.
  const lastElement = [...children].reverse().find((c) => c.nodeType === Node.ELEMENT_NODE) as HTMLElement | undefined
  if (lastElement?.tagName.toLowerCase() === 'br' && out.endsWith('\n')) {
    out = out.slice(0, -1)
  }

  return out
}

function pushLines(lines: string[], text: string, prefix = '') {
  for (const line of text.split('\n')) lines.push(prefix + line)
}

const CONTAINER_TAGS = new Set(['div', 'p', 'blockquote'])

/**
 * Browsers (Chrome in particular) apply formatBlock/insertUnorderedList to the
 * existing block rather than replacing it, leaving e.g. <div><ul>...</ul></div>
 * or <blockquote><div>...</div></blockquote>. Peel through wrapper elements that
 * hold nothing but a single nested block so callers see the real list/quote node.
 */
function unwrapSoleChild(el: HTMLElement): HTMLElement {
  while (CONTAINER_TAGS.has(el.tagName.toLowerCase())) {
    const meaningfulChildren = Array.from(el.childNodes).filter(
      (n) => !(n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() === ''),
    )
    if (meaningfulChildren.length !== 1 || meaningfulChildren[0].nodeType !== Node.ELEMENT_NODE) break
    const only = meaningfulChildren[0] as HTMLElement
    const tag = only.tagName.toLowerCase()
    if (tag === 'ul' || tag === 'ol' || tag === 'blockquote' || BLOCK_TAGS.has(tag)) {
      el = only
      continue
    }
    break
  }
  return el
}

function pushListLines(lines: string[], el: HTMLElement) {
  for (const li of Array.from(el.children).filter((n) => n.tagName.toLowerCase() === 'li')) {
    pushLines(lines, inlineNodeToMarkup(li), '- ')
  }
}

function pushQuoteLines(lines: string[], el: HTMLElement) {
  const innerBlocks = Array.from(el.children).filter((n) => BLOCK_TAGS.has(n.tagName.toLowerCase()))
  if (innerBlocks.length === 0) {
    pushLines(lines, inlineNodeToMarkup(el), '> ')
  } else {
    for (const inner of innerBlocks) pushLines(lines, inlineNodeToMarkup(inner as HTMLElement), '> ')
  }
}

/** Serializes a contentEditable box's live DOM back into the markup string that is the field's stored value. */
export function elementToMarkup(root: HTMLElement): string {
  const lines: string[] = []
  let pending = ''
  const flushPending = () => {
    if (pending !== '') {
      pushLines(lines, pending)
      pending = ''
    }
  }

  for (const child of Array.from(root.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      pending += child.textContent ?? ''
      continue
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue
    const el = unwrapSoleChild(child as HTMLElement)
    const tag = el.tagName.toLowerCase()

    if (tag === 'br') {
      flushPending()
      lines.push('')
      continue
    }

    if (tag === 'ul' || tag === 'ol') {
      flushPending()
      pushListLines(lines, el)
      continue
    }

    if (tag === 'blockquote') {
      flushPending()
      pushQuoteLines(lines, el)
      continue
    }

    if (BLOCK_TAGS.has(tag)) {
      flushPending()
      pushLines(lines, inlineNodeToMarkup(el))
      continue
    }

    pending += inlineNodeToMarkup(el)
  }
  flushPending()

  return lines.join('\n')
}
