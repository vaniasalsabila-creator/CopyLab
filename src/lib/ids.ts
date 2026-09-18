import type { CopyFields } from '../types'

export function uid(): string {
  return crypto.randomUUID()
}

export function emptyCopy(): CopyFields {
  return {
    whatsapp: { en: '', id: '' },
    push: {
      title: { en: '', id: '' },
      subtitle: { en: '', id: '' },
    },
    sms: { en: '', id: '' },
    flightAssistant: {
      title: { en: '', id: '' },
      description: { en: '', id: '' },
    },
  }
}

export function cloneCopy<T>(value: T): T {
  return structuredClone(value)
}

/** Backfills any channels/fields missing from older stored copy (e.g. before a new channel was added). */
export function normalizeCopy(raw: Partial<CopyFields> | null | undefined): CopyFields {
  const empty = emptyCopy()
  return {
    whatsapp: { ...empty.whatsapp, ...raw?.whatsapp },
    push: {
      title: { ...empty.push.title, ...raw?.push?.title },
      subtitle: { ...empty.push.subtitle, ...raw?.push?.subtitle },
    },
    sms: { ...empty.sms, ...raw?.sms },
    flightAssistant: {
      title: { ...empty.flightAssistant.title, ...raw?.flightAssistant?.title },
      description: { ...empty.flightAssistant.description, ...raw?.flightAssistant?.description },
    },
  }
}
