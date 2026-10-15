import { useRef } from 'react'
import { useStore } from '../store'
import { LIMITS } from '../lib/chars'
import { uid } from '../lib/ids'
import { fileToBannerDataUrl } from '../lib/image'
import { CopyField } from './CharField'
import { Button } from './ui'
import type { Lang, Option, WhatsAppCard } from '../types'

export const MAX_CAROUSEL_CARDS = 9

function emptyCard(): WhatsAppCard {
  return {
    id: uid(),
    text: { en: '', id: '' },
    cta: { en: '', id: '' },
    banner: { en: '', id: '' },
  }
}

function BannerUpload({ value, onChange }: { value: string; onChange: (dataUrl: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const toast = useStore((s) => s.toast)

  async function pick(file: File | undefined) {
    if (!file) return
    try {
      onChange(await fileToBannerDataUrl(file))
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed.')
    }
  }

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {value ? (
        <div className="min-w-0 space-y-2 rounded-lg border border-line p-2">
          <img src={value} alt="Banner" className="aspect-[2/1] w-full rounded-md object-cover" />
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => ref.current?.click()}>
              Replace
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onChange('')}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="w-full rounded-lg border border-dashed border-line px-4 py-5 text-center text-[13px] text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
        >
          Click to upload a banner image (2:1)
        </button>
      )}
    </div>
  )
}

/** Editor for the extra cards that sit beside the main card in a WhatsApp carousel. */
export function CarouselEditor({ option, langs }: { option: Option; langs: Lang[] }) {
  const updateCopy = useStore((s) => s.updateCopy)
  const cards = option.copy.whatsappCards
  const show = option.copy.whatsappShow

  function setCards(fn: (cards: WhatsAppCard[]) => WhatsAppCard[]) {
    updateCopy(option.id, (c) => ({ ...c, whatsappCards: fn(c.whatsappCards) }))
  }
  function patchCard(id: string, fn: (card: WhatsAppCard) => WhatsAppCard) {
    setCards((list) => list.map((card) => (card.id === id ? fn(card) : card)))
  }

  const grid = `grid gap-5 ${langs.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`
  const langLabel = (l: Lang) => (l === 'en' ? 'English' : 'Indonesian')

  return (
    <div className="space-y-4">
      <p className="text-xs text-ink-faint">
        The main card above is card 1. Add more cards to scroll sideways, up to {MAX_CAROUSEL_CARDS + 1} in total.
      </p>

      {cards.map((card, i) => (
        <div key={card.id} className="space-y-4 rounded-lg border border-line p-4">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold text-ink">Card {i + 2}</div>
            <Button variant="ghost" size="sm" icon="trash" onClick={() => setCards((list) => list.filter((c) => c.id !== card.id))}>
              Remove
            </Button>
          </div>

          {show.banner && (
            <div className={grid}>
              {langs.map((l) => (
                <div key={l}>
                  <div className="mb-1.5 text-xs font-medium text-ink-muted">Banner · {langLabel(l)}</div>
                  <BannerUpload
                    value={card.banner[l]}
                    onChange={(v) => patchCard(card.id, (c) => ({ ...c, banner: { ...c.banner, [l]: v } }))}
                  />
                </div>
              ))}
            </div>
          )}

          <div className={grid}>
            {langs.map((l) => (
              <CopyField
                key={l}
                label={`Message · ${langLabel(l)}`}
                value={card.text[l]}
                onChange={(v) => patchCard(card.id, (c) => ({ ...c, text: { ...c.text, [l]: v } }))}
                placeholder={l === 'en' ? 'Enter your message' : 'Masukkan pesan Anda'}
                max={LIMITS.whatsapp}
                warnAt={LIMITS.whatsappWarn}
                minRows={3}
              />
            ))}
          </div>

          {show.cta && (
            <div className={grid}>
              {langs.map((l) => (
                <CopyField
                  key={l}
                  label={`CTA · ${langLabel(l)}`}
                  value={card.cta[l]}
                  onChange={(v) => patchCard(card.id, (c) => ({ ...c, cta: { ...c.cta, [l]: v } }))}
                  placeholder={l === 'en' ? 'e.g. BUY 1 GET 4' : 'cth. BELI 1 DAPAT 4'}
                  max={LIMITS.whatsappCta}
                  multiline={false}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {cards.length < MAX_CAROUSEL_CARDS && (
        <Button variant="secondary" size="sm" icon="plus" onClick={() => setCards((list) => [...list, emptyCard()])}>
          Add card
        </Button>
      )}
    </div>
  )
}
