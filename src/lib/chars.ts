const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null

export function countChars(text: string): number {
  if (!text) return 0
  if (segmenter) return [...segmenter.segment(text)].length
  return Array.from(text).length
}

export const LIMITS = {
  whatsapp: 1024,
  whatsappWarn: 950,
  pushTitle: 50,
  pushSubtitle: 75,
  sms: 160,
  smsWarn: 145,
} as const

export type LimitTone = 'ok' | 'warn' | 'over'

export function limitTone(count: number, max: number, warnAt?: number): LimitTone {
  if (count > max) return 'over'
  if (warnAt != null && count >= warnAt) return 'warn'
  return 'ok'
}

export function remainingLabel(count: number, max: number): string {
  const diff = max - count
  if (diff >= 0) {
    return `${diff.toLocaleString()} character${diff === 1 ? '' : 's'} remaining`
  }
  const over = Math.abs(diff)
  return `${over.toLocaleString()} character${over === 1 ? '' : 's'} over limit`
}

export function formatCount(count: number, max: number): string {
  return `${count.toLocaleString()} / ${max.toLocaleString()}`
}
