import { useRef, type ReactNode } from 'react'
import { useStore } from '../store'
import { LIMITS } from '../lib/chars'
import { fileToBannerDataUrl } from '../lib/image'
import { CopyField } from './CharField'
import { CarouselEditor } from './CarouselEditor'
import { Button, EmptyState } from './ui'
import { WhatsAppVariantTabs } from './WhatsAppVariantTabs'
import type { Lang } from '../types'

function WhatsAppSection({
  title,
  on = true,
  onToggle,
  children,
}: {
  title: string
  on?: boolean
  onToggle?: (value: boolean) => void
  children: ReactNode
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2.5">
        <h3 className="text-[15px] font-semibold tracking-tight text-ink">
          {title}
        </h3>
        {onToggle && (
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={`Show ${title}`}
            onClick={() => onToggle(!on)}
            className={`relative h-[18px] w-8 shrink-0 rounded-full transition-colors ${on ? 'bg-[#007CFF]' : 'bg-line-strong'}`}
          >
            <span
              className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-all ${on ? 'left-[16px]' : 'left-0.5'}`}
            />
          </button>
        )}
      </div>
      {on ? children : <p className="text-xs text-ink-faint">Hidden in the preview.</p>}
    </div>
  )
}

const LANGS: Lang[] = ['en', 'id']

export function CopyEditor() {
  const option = useStore((s) => s.options.find((o) => o.id === s.selectedOptionId))
  const channel = useStore((s) => s.channel)
  const variant = useStore((s) => s.whatsappVariant)
  const isImage = variant === 'image'
  const updateCopy = useStore((s) => s.updateCopy)
  const setModal = useStore((s) => s.setModal)

  const fileRefs = useRef<Partial<Record<Lang, HTMLInputElement | null>>>({})
  const toast = useStore((s) => s.toast)

  async function onPickBanner(file: File | undefined, optionId: string, lang: Lang) {
    if (!file) return
    try {
      const dataUrl = await fileToBannerDataUrl(file)
      updateCopy(optionId, (c) => ({ ...c, whatsappBanner: { ...c.whatsappBanner, [lang]: dataUrl } }))
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed.')
    }
  }

  const show = option?.copy.whatsappShow ?? { intro: false, banner: true, cta: true, carousel: false }
  function setShow(key: 'intro' | 'banner' | 'carousel', value: boolean) {
    if (option) updateCopy(option.id, (c) => ({ ...c, whatsappShow: { ...c.whatsappShow, [key]: value } }))
  }

  const langs: Lang[] = LANGS

  if (!option) {
    return (
      <EmptyState
        icon="file"
        title="No options yet"
        description="Create an option to start exploring different copy directions."
        action={
          <Button variant="primary" icon="plus" onClick={() => setModal({ type: 'option-create' })}>
            Add Option
          </Button>
        }
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex-1 px-6 py-5">
        {channel === 'whatsapp' ? (
          <div className="space-y-7">
            <WhatsAppVariantTabs size="md" />
            {isImage && (
            <WhatsAppSection title="Text bubble above card" on={show.intro} onToggle={(v) => setShow('intro', v)}>
            <div className={`grid gap-5 ${langs.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`}>
              {langs.map((lang) => (
                <CopyField
                  key={lang}
                  label={lang === 'en' ? 'English' : 'Indonesian'}
                  value={option.copy.whatsappIntro[lang]}
                  onChange={(v) => updateCopy(option.id, (c) => ({ ...c, whatsappIntro: { ...c.whatsappIntro, [lang]: v } }))}
                  placeholder={lang === 'en' ? 'Hi there, ready for a getaway?' : 'Hai sobat, siap liburan lagi?'}
                  max={LIMITS.whatsapp}
                  warnAt={LIMITS.whatsappWarn}
                  minRows={3}
                />
              ))}
            </div>
            </WhatsAppSection>
            )}
            {isImage && (
            <WhatsAppSection title="Banner image" on={show.banner} onToggle={(v) => setShow('banner', v)}>
            <div className={`grid gap-5 ${langs.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`}>
              {langs.map((lang) => {
                const banner = option.copy.whatsappBanner[lang]
                return (
                  <div key={lang}>
                    <div className="mb-1.5 text-[13px] font-semibold text-ink-muted">{lang === 'en' ? 'English' : 'Indonesian'}</div>
                    <input
                      ref={(el) => {
                        fileRefs.current[lang] = el
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        onPickBanner(e.target.files?.[0], option.id, lang)
                        e.target.value = ''
                      }}
                    />
                    {banner ? (
                      <div className="min-w-0 space-y-2 rounded-lg border border-line p-2">
                        <img src={banner} alt="Banner" className="aspect-[16/9] w-full rounded-md object-cover" />
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => fileRefs.current[lang]?.click()}>
                            Replace
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              updateCopy(option.id, (c) => ({ ...c, whatsappBanner: { ...c.whatsappBanner, [lang]: '' } }))
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRefs.current[lang]?.click()}
                        className="w-full rounded-lg border border-dashed border-line px-4 py-6 text-center text-[13px] text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
                      >
                        Click to upload a banner image (2:1)
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
            </WhatsAppSection>
            )}
            <WhatsAppSection title="Message (card text)">
            <div className={`grid gap-5 ${langs.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`}>
              {langs.map((lang) => (
                <CopyField
                  key={lang}
                  label={lang === 'en' ? 'English' : 'Indonesian'}
                  value={option.copy.whatsapp[lang]}
                  onChange={(v) => updateCopy(option.id, (c) => ({ ...c, whatsapp: { ...c.whatsapp, [lang]: v } }))}
                  placeholder={lang === 'en' ? 'Enter your message' : 'Masukkan pesan Anda'}
                  max={LIMITS.whatsapp}
                  warnAt={LIMITS.whatsappWarn}
                  minRows={7}
                />
              ))}
            </div>
            </WhatsAppSection>
            <WhatsAppSection title="CTA Copy message">
            <div className={`grid gap-5 ${langs.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`}>
              {langs.map((lang) => (
                <CopyField
                  key={lang}
                  label={lang === 'en' ? 'English' : 'Indonesian'}
                  value={option.copy.whatsappCta[lang]}
                  onChange={(v) => updateCopy(option.id, (c) => ({ ...c, whatsappCta: { ...c.whatsappCta, [lang]: v } }))}
                  placeholder={lang === 'en' ? 'e.g. BUY 1 GET 4' : 'cth. BELI 1 DAPAT 4'}
                  max={LIMITS.whatsappCta}
                  multiline={false}
                />
              ))}
            </div>
            </WhatsAppSection>
            {isImage && (
            <WhatsAppSection title="Carousel" on={show.carousel} onToggle={(v) => setShow('carousel', v)}>
              <CarouselEditor option={option} langs={langs} />
            </WhatsAppSection>
            )}
          </div>
        ) : channel === 'push' ? (
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-[15px] font-semibold tracking-tight text-ink">Title</h3>
              <div className={`grid gap-5 ${langs.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`}>
                {langs.map((lang) => (
                  <CopyField
                    key={lang}
                    label={lang === 'en' ? 'English' : 'Indonesian'}
                    value={option.copy.push.title[lang]}
                    onChange={(v) => updateCopy(option.id, (c) => ({ ...c, push: { ...c.push, title: { ...c.push.title, [lang]: v } } }))}
                    placeholder={lang === 'en' ? 'Write your notification title...' : 'Tulis judul notifikasi...'}
                    max={LIMITS.pushTitle}
                    multiline={false}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-[15px] font-semibold tracking-tight text-ink">Subtitle</h3>
              <div className={`grid gap-5 ${langs.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`}>
                {langs.map((lang) => (
                  <CopyField
                    key={lang}
                    label={lang === 'en' ? 'English' : 'Indonesian'}
                    value={option.copy.push.subtitle[lang]}
                    onChange={(v) => updateCopy(option.id, (c) => ({ ...c, push: { ...c.push, subtitle: { ...c.push.subtitle, [lang]: v } } }))}
                    placeholder={lang === 'en' ? 'Write your notification subtitle...' : 'Tulis subjudul notifikasi...'}
                    max={LIMITS.pushSubtitle}
                    minRows={2}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : channel === 'sms' ? (
          <div>
            <h3 className="mb-3 text-[15px] font-semibold tracking-tight text-ink">SMS</h3>
            <div className={`grid gap-5 ${langs.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`}>
              {langs.map((lang) => (
                <CopyField
                  key={lang}
                  label={lang === 'en' ? 'English' : 'Indonesian'}
                  value={option.copy.sms[lang]}
                  onChange={(v) => updateCopy(option.id, (c) => ({ ...c, sms: { ...c.sms, [lang]: v } }))}
                  placeholder={lang === 'en' ? 'Enter your message' : 'Masukkan pesan Anda'}
                  max={LIMITS.sms}
                  warnAt={LIMITS.smsWarn}
                  minRows={4}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-[15px] font-semibold tracking-tight text-ink">Title</h3>
              <div className={`grid gap-5 ${langs.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`}>
                {langs.map((lang) => (
                  <CopyField
                    key={lang}
                    label={lang === 'en' ? 'English' : 'Indonesian'}
                    value={option.copy.flightAssistant.title[lang]}
                    onChange={(v) =>
                      updateCopy(option.id, (c) => ({
                        ...c,
                        flightAssistant: { ...c.flightAssistant, title: { ...c.flightAssistant.title, [lang]: v } },
                      }))
                    }
                    placeholder={lang === 'en' ? 'Best choice for you! ✨' : 'Pilihan terbaik untukmu! ✨'}
                    max={LIMITS.flightAssistantTitle}
                    minRows={2}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-[15px] font-semibold tracking-tight text-ink">Description</h3>
              <div className={`grid gap-5 ${langs.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`}>
                {langs.map((lang) => (
                  <CopyField
                    key={lang}
                    label={lang === 'en' ? 'English' : 'Indonesian'}
                    value={option.copy.flightAssistant.description[lang]}
                    onChange={(v) =>
                      updateCopy(option.id, (c) => ({
                        ...c,
                        flightAssistant: { ...c.flightAssistant, description: { ...c.flightAssistant.description, [lang]: v } },
                      }))
                    }
                    placeholder={lang === 'en' ? 'Enter your message' : 'Masukkan pesan Anda'}
                    max={LIMITS.flightAssistantDescription}
                    minRows={3}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
