import { useEffect, useRef, useState } from 'react'
import { countChars, formatCount, limitTone, remainingLabel } from '../lib/chars'
import { Icon } from './icons'
import { useStore } from '../store'

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

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
        <label htmlFor={fieldId} className="text-[13px] font-medium text-ink">
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
      {multiline ? (
        <textarea
          ref={textareaRef}
          id={fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={minRows}
          className="w-full resize-none overflow-hidden rounded-md border border-line bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:outline-2 focus:outline-offset-0 focus:outline-accent/20"
        />
      ) : (
        <input
          id={fieldId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:outline-2 focus:outline-offset-0 focus:outline-accent/20"
        />
      )}
      <CounterLabel count={count} max={max} warnAt={warnAt} />
    </div>
  )
}
