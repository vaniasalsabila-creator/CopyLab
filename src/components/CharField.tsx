import { useLayoutEffect, useRef, useState } from 'react'
import { countChars, formatCount, limitTone, remainingLabel } from '../lib/chars'
import { Icon } from './icons'
import type { IconName } from './icons'
import { useStore } from '../store'
import { elementToMarkup, markupToHtml } from '../lib/richTextHtml'

export function CounterLabel({ count, max, warnAt }: { count: number; max: number; warnAt?: number }) {
  const tone = limitTone(count, max, warnAt)
  const toneClass = tone === 'over' ? 'text-red-600' : tone === 'warn' ? 'text-amber-600' : 'text-ink-faint'
  return (
    <div className={`flex flex-wrap items-center gap-1.5 text-xs ${toneClass}`}>
      {tone === 'over' && <Icon name="alert" size={12} />}
      {tone === 'ok' && count > 0 && <Icon name="check" size={12} />}
      <span className="font-medium tabular-nums">{formatCount(count, max)} characters</span>
      <span className="text-ink-faint">·</span>
      <span>{remainingLabel(count, max)}</span>
    </div>
  )
}

type FormatAction = 'bold' | 'italic' | 'underline' | 'quote' | 'list' | 'paragraph'

const INLINE_BUTTONS: { action: FormatAction; icon: IconName; title: string }[] = [
  { action: 'bold', icon: 'bold', title: 'Bold' },
  { action: 'italic', icon: 'italic', title: 'Italic' },
  { action: 'underline', icon: 'underline', title: 'Underline' },
]

const QUOTE_BUTTON: { action: FormatAction; icon: IconName; title: string } = { action: 'quote', icon: 'quote', title: 'Quote' }

const GROUPED_BUTTONS: { action: FormatAction; icon: IconName; title: string }[] = [
  { action: 'list', icon: 'list', title: 'Bulleted list' },
  { action: 'paragraph', icon: 'paragraph', title: 'Paragraph (clear list/quote)' },
]

function ToolbarButton({ icon, title, onClick }: { icon: IconName; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-ink-muted shadow-sm transition-all duration-150 hover:bg-surface-3 hover:text-ink active:scale-95"
    >
      <Icon name={icon} size={15} />
    </button>
  )
}

function FormatToolbar({ onFormat, showBlockActions }: { onFormat: (action: FormatAction) => void; showBlockActions: boolean }) {
  const inlineButtons = showBlockActions ? [...INLINE_BUTTONS, QUOTE_BUTTON] : INLINE_BUTTONS
  return (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5">
        {inlineButtons.map((btn) => (
          <ToolbarButton key={btn.action} icon={btn.icon} title={btn.title} onClick={() => onFormat(btn.action)} />
        ))}
      </div>
      {showBlockActions && (
        <div className="flex items-stretch divide-x divide-line overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
          {GROUPED_BUTTONS.map((btn) => (
            <button
              key={btn.action}
              type="button"
              title={btn.title}
              aria-label={btn.title}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onFormat(btn.action)}
              className="inline-flex h-8 w-9 items-center justify-center text-ink-muted transition-colors duration-150 hover:bg-surface-3 hover:text-ink"
            >
              <Icon name={btn.icon} size={15} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function CopyField({
  label,
  value,
  onChange,
  placeholder,
  max,
  warnAt,
  multiline = true,
  minRows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  max: number
  warnAt?: number
  multiline?: boolean
  minRows?: number
}) {
  const [copied, setCopied] = useState(false)
  const pushToast = useStore((s) => s.toast)
  const count = countChars(value)
  const editorRef = useRef<HTMLDivElement>(null)
  const skipNextSync = useRef(false)

  useLayoutEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (skipNextSync.current) {
      skipNextSync.current = false
      return
    }
    if (elementToMarkup(el) !== value) {
      el.innerHTML = markupToHtml(value)
    }
  }, [value])

  function syncFromDom() {
    const el = editorRef.current
    if (!el) return
    const newValue = elementToMarkup(el)
    if (newValue === value) return
    skipNextSync.current = true
    onChange(newValue)
  }

  function handleFormat(action: FormatAction) {
    const el = editorRef.current
    if (!el) return
    el.focus()
    document.execCommand('styleWithCSS', false, 'false')
    document.execCommand('defaultParagraphSeparator', false, 'div')
    switch (action) {
      case 'bold':
      case 'italic':
      case 'underline':
        document.execCommand(action)
        break
      case 'quote': {
        const isQuote = document.queryCommandValue('formatBlock').toLowerCase() === 'blockquote'
        document.execCommand('formatBlock', false, isQuote ? 'div' : 'blockquote')
        break
      }
      case 'list':
        document.execCommand('insertUnorderedList')
        break
      case 'paragraph':
        document.execCommand('formatBlock', false, 'div')
        break
    }
    syncFromDom()
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault()
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
    syncFromDom()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
    }
  }

  async function handleCopy() {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      pushToast('Copied ✓')
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      pushToast('Could not copy')
    }
  }

  const fieldId = `field-${label.replace(/\s+/g, '-').toLowerCase()}-${max}`

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={fieldId}
          onClick={() => editorRef.current?.focus()}
          className="text-[13px] font-medium text-ink"
        >
          {label}
        </label>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy"
            aria-label={`Copy ${label}`}
            className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-faint transition-all duration-150 hover:bg-surface-3 hover:text-ink active:scale-90"
          >
            <Icon name={copied ? 'check' : 'copy'} size={13} />
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              title="Clear"
              aria-label={`Clear ${label}`}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-faint transition-all duration-150 hover:bg-surface-3 hover:text-ink active:scale-90"
            >
              <Icon name="close" size={13} />
            </button>
          )}
        </div>
      </div>
      <FormatToolbar onFormat={handleFormat} showBlockActions={multiline} />
      <div className="rounded-xl border border-line bg-surface shadow-sm transition-colors focus-within:border-accent focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-accent/20">
        <div className="relative">
          {!value && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden px-4 pt-3.5 text-sm leading-relaxed text-ink-faint">
              {placeholder}
            </div>
          )}
          <div
            ref={editorRef}
            id={fieldId}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline={multiline}
            aria-label={label}
            onInput={syncFromDom}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            style={{ minHeight: multiline ? `${minRows * 1.625}em` : undefined, whiteSpace: 'pre-wrap' }}
            className="w-full overflow-hidden rounded-t-xl bg-transparent px-4 pt-3.5 text-sm leading-relaxed text-ink break-words outline-none [&_blockquote]:my-1 [&_blockquote]:border-l-2 [&_blockquote]:border-current/30 [&_blockquote]:pl-2 [&_blockquote]:italic [&_blockquote]:opacity-90 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-4"
          />
        </div>
        <div className="flex justify-end px-4 pb-2.5 pt-1.5">
          <CounterLabel count={count} max={max} warnAt={warnAt} />
        </div>
      </div>
    </div>
  )
}
