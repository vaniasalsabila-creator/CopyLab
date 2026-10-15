import type { CopyFields } from '../types'

export function uid(): string {
  return crypto.randomUUID()
}

export function emptyCopy(): CopyFields {
  return {
    whatsapp: { en: '', id: '' },
    whatsappIntro: { en: '', id: '' },
    whatsappCta: { en: '', id: '' },
    whatsappShow: { intro: false, banner: true, cta: true, carousel: false },
    whatsappCards: [],
    whatsappBanner: { en: '', id: '' },
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
    whatsappIntro: { ...empty.whatsappIntro, ...raw?.whatsappIntro },
    whatsappCta: { ...empty.whatsappCta, ...raw?.whatsappCta },
    whatsappShow: { ...empty.whatsappShow, ...raw?.whatsappShow },
    whatsappCards: Array.isArray(raw?.whatsappCards)
      ? raw.whatsappCards.map((c) => ({
          id: c?.id ?? uid(),
          text: { en: c?.text?.en ?? '', id: c?.text?.id ?? '' },
          cta: { en: c?.cta?.en ?? '', id: c?.cta?.id ?? '' },
          banner: { en: c?.banner?.en ?? '', id: c?.banner?.id ?? '' },
        }))
      : [],
    // Older copy stored a single shared banner string; use it for both languages.
    whatsappBanner:
      typeof raw?.whatsappBanner === 'string'
        ? { en: raw.whatsappBanner, id: raw.whatsappBanner }
        : { ...empty.whatsappBanner, ...raw?.whatsappBanner },
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
