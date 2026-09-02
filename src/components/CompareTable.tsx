import { useState } from 'react'
import { useStore } from '../store'
import { countChars, formatCount, limitTone } from '../lib/chars'
import { LIMITS } from '../lib/chars'
import { Icon } from './icons'
import type { Option } from '../types'

type Row = { key: string; label: string; max: number; warnAt?: number; get: (o: Option) => string }

const ROWS: Row[] = [
  { key: 'wa-en', label: 'WhatsApp EN', max: LIMITS.whatsapp, warnAt: LIMITS.whatsappWarn, get: (o) => o.copy.whatsapp.en },
  { key: 'wa-id', label: 'WhatsApp ID', max: LIMITS.whatsapp, warnAt: LIMITS.whatsappWarn, get: (o) => o.copy.whatsapp.id },
  { key: 'pt-en', label: 'Push Title EN', max: LIMITS.pushTitle, get: (o) => o.copy.push.title.en },
  { key: 'pt-id', label: 'Push Title ID', max: LIMITS.pushTitle, get: (o) => o.copy.push.title.id },
  { key: 'ps-en', label: 'Push Subtitle EN', max: LIMITS.pushSubtitle, get: (o) => o.copy.push.subtitle.en },
  { key: 'ps-id', label: 'Push Subtitle ID', max: LIMITS.pushSubtitle, get: (o) => o.copy.push.subtitle.id },
]

export function CompareTable({ options }: { options: Option[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-40 border-b border-line bg-surface-2 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              &nbsp;
            </th>
            {options.map((o) => (
              <th key={o.id} className="min-w-[220px] border-b border-line bg-surface-2 px-3 py-2.5 text-[13px] font-semibold text-ink">
                {o.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key} className="align-top">
              <th className="sticky left-0 z-10 w-40 border-b border-line bg-surface px-3 py-3 text-left text-[12px] font-medium text-ink-muted">
                {row.label}
              </th>
              {options.map((o) => (
                <CompareCell key={o.id} value={row.get(o)} max={row.max} warnAt={row.warnAt} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CompareCell({ value, max, warnAt }: { value: string; max: number; warnAt?: number }) {
  const [copied, setCopied] = useState(false)
  const pushToast = useStore((s) => s.toast)
  const count = countChars(value)
  const tone = limitTone(count, max, warnAt)
  const toneClass = tone === 'over' ? 'text-red-600' : tone === 'warn' ? 'text-amber-600' : 'text-ink-faint'

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

  return (
    <td className="min-w-[220px] border-b border-line px-3 py-3 text-[13px]">
      <div className="group flex items-start gap-1.5">
        <p className="flex-1 whitespace-pre-wrap break-words text-ink">
          {value || <span className="italic text-ink-faint">Empty</span>}
        </p>
        <button
          onClick={handleCopy}
          aria-label="Copy"
          className="mt-0.5 shrink-0 rounded p-0.5 text-ink-faint opacity-0 transition-all hover:bg-surface-3 hover:text-ink group-hover:opacity-100"
        >
          <Icon name={copied ? 'check' : 'copy'} size={13} />
        </button>
      </div>
      <div className={`mt-1 flex items-center gap-1 text-[11px] font-medium tabular-nums ${toneClass}`}>
        {tone === 'over' && <Icon name="alert" size={11} />}
        {formatCount(count, max)}
      </div>
    </td>
  )
}
