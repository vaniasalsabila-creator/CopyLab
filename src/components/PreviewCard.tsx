import type { CopyFields, Lang } from '../types'
import { countChars, LIMITS } from '../lib/chars'
import { CounterLabel } from './CharField'
import { FormattedText, InlineText } from './FormattedText'
import { Icon } from './icons'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const GRADIENT_BORDER = 'linear-gradient(115deg, #34d399, #38bdf8, #a78bfa, #34d399)'

function LangBlock({ children, lang }: { children: ReactNode; lang?: Lang }) {
  return (
    <div className="space-y-1">
      {lang && <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">{lang}</div>}
      {children}
    </div>
  )
}

const APP_ICON_SRC = '/ICON_TIKET15.png'

const WA_WALLPAPER =
  'radial-gradient(circle at 8px 8px, rgba(0,0,0,0.045) 1.4px, transparent 1.5px),' +
  'radial-gradient(circle at 22px 26px, rgba(0,0,0,0.035) 1px, transparent 1.1px)'

function ChatBubble({ text }: { text: string }) {
  return (
    <div className="relative ml-1.5 mr-6 max-w-full rounded-[18px] rounded-bl-none bg-white px-3.5 pb-1.5 pt-2.5 text-[13.5px] leading-[1.4] text-[#111b21]">
      <IosChatBubbleTail />
      {text ? (
        <FormattedText text={text} />
      ) : (
        <span className="italic text-[#8696a0]">No copy written yet.</span>
      )}
      <div className="mt-0.5 text-right text-[10.5px] text-[#667781]">9:41 AM</div>
    </div>
  )
}

/** Banners are authored at 2:1. In the chat list WhatsApp crops them to the bubble (~1.7:1); opened, they show in full. */
const BANNER_CHAT_ASPECT = 'aspect-[700/410]'
const BANNER_FULL_ASPECT = 'aspect-[2/1]'

function BannerPlaceholder({ src, aspect = BANNER_CHAT_ASPECT }: { src?: string; aspect?: string }) {
  if (src) return <img src={src} alt="" className={`block w-full object-cover ${aspect}`} />
  return (
    <div className={`flex w-full ${aspect} items-center justify-center bg-gradient-to-br from-[#fbd3e3] via-[#f7b6d2] to-[#e58fb8] text-[11px] font-medium text-white/90`}>
      Banner image
    </div>
  )
}

const WA_BRAND = '#00a884'

function IosChatBubbleTail() {
  return (
    <svg width="9" height="14" viewBox="0 0 9 14" className="absolute -left-[8px] bottom-0 text-white" aria-hidden="true">
      <path fill="currentColor" d="M9 0V14H0C5.5 13.4 8.6 9 9 0Z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 15 15 9M10 9h5v5" />
    </svg>
  )
}

/** Native-style WhatsApp card: banner on top, body text, "Read more", then a CTA row. */
function RichChatBubble({
  text,
  cta,
  banner,
  show,
  onOpen,
  carousel = false,
  tail = true,
}: {
  text: string
  cta: string
  banner: string
  show: CopyFields['whatsappShow']
  onOpen: () => void
  /** Fixed-width card inside a sideways-scrolling carousel row. */
  carousel?: boolean
  tail?: boolean
}) {
  return (
    <div
      className={`relative flex flex-col rounded-[18px] bg-white text-[#111b21] ${tail ? 'rounded-bl-none' : ''} ${
        carousel ? 'w-[calc(100%-68px)] shrink-0 snap-start' : 'mr-6 max-w-full'
      }`}
    >
      {tail && <IosChatBubbleTail />}
      {show.banner && (
        <button type="button" onClick={onOpen} className="block w-full cursor-pointer overflow-hidden rounded-t-[18px]">
          <BannerPlaceholder src={banner} />
        </button>
      )}
      <div className="flex flex-1 flex-col px-3.5 pb-3 pt-2.5 text-[13.5px] leading-[1.4]">
        {text ? (
          <div className="line-clamp-3">
            <FormattedText text={text} />
          </div>
        ) : (
          <span className="italic text-[#8696a0]">No copy written yet.</span>
        )}
        <button type="button" onClick={onOpen} className="mt-auto block self-start pt-3 text-[13.5px]" style={{ color: WA_BRAND }}>
          Read more
        </button>
      </div>
      {show.cta && (
        <div
          className="flex items-center justify-center gap-2 border-t border-[#e4e4e4] py-2.5 text-[13.5px]"
          style={{ color: WA_BRAND }}
        >
          <ExternalLinkIcon />
          {cta ? <InlineText text={cta} /> : <span className="italic text-[#8696a0]">No CTA yet</span>}
        </div>
      )}
    </div>
  )
}

function IntroBubble({ text }: { text: string }) {
  return (
    <div className="mr-6 max-w-full rounded-[18px] bg-white px-3.5 pb-1.5 pt-2.5 text-[13.5px] leading-[1.4] text-[#111b21]">
      {text ? <FormattedText text={text} /> : <span className="italic text-[#8696a0]">No intro written yet.</span>}
      <div className="text-right text-[10.5px] text-[#667781]">6.35 PM</div>
    </div>
  )
}

function ThumbIcon({ down }: { down?: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={down ? 'rotate-180' : ''} aria-hidden="true">
      <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3Zm0 0 4-8a2.5 2.5 0 0 1 2.5 2.5V9h5.3a2 2 0 0 1 2 2.3l-1.2 7a2 2 0 0 1-2 1.7H7" />
    </svg>
  )
}

/** What opens when the card is tapped: full 2:1 banner, full text, and the CTA as a green button. */
function MessageDetail({
  text,
  cta,
  banner,
  show,
  onClose,
}: {
  text: string
  cta: string
  banner: string
  show: CopyFields['whatsappShow']
  onClose: () => void
}) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-white">
      <div className="flex items-center gap-2 border-b border-[#eeeeee] px-3 py-2.5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e4e4e4] text-[#111b21]"
        >
          <Icon name="chevron-left" size={15} />
        </button>
        <div className="flex-1 text-center leading-tight">
          <div className="text-[14px] font-medium text-[#111b21]">tiket.com promo</div>
          <div className="text-[10.5px] text-[#54656f]">12/12/25, 6.35 PM</div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e4e4e4] text-[#111b21]">
          <Icon name="more" size={15} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {show.banner && (
          <div className="mt-6">
            <BannerPlaceholder src={banner} aspect={BANNER_FULL_ASPECT} />
          </div>
        )}
        <div className={`mx-3 border-t ${show.banner ? 'mt-6' : 'mt-3'} border-[#eeeeee] pt-4 text-[13.5px] leading-[1.45] text-[#111b21]`}>
          {text ? <FormattedText text={text} /> : <span className="italic text-[#8696a0]">No copy written yet.</span>}
        </div>
        {show.cta && (
          <div className="flex justify-end px-3 pb-3 pt-4">
            <div className="flex items-center gap-2 rounded-full bg-[#00a884] px-4 py-2 text-[13.5px] font-medium text-white">
              <ExternalLinkIcon />
              {cta ? <InlineText text={cta} /> : <span className="italic font-normal text-white/70">No CTA yet</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type PhoneWidth = 360 | 412
const PHONE_WIDTHS: PhoneWidth[] = [360, 412]

/** Lays the frame out at its real phone width, then scales it down to fit when the panel is narrower. */
function PhoneViewport({ width, children }: { width: PhoneWidth; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ scale: 1, height: 0 })

  useEffect(() => {
    const o = outer.current
    const i = inner.current
    if (!o || !i) return
    const measure = () => {
      const scale = Math.min(1, o.clientWidth / width)
      setFit({ scale, height: i.offsetHeight * scale })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(o)
    ro.observe(i)
    return () => ro.disconnect()
  }, [width])

  return (
    <div ref={outer} className="mx-auto w-full" style={{ maxWidth: width, height: fit.height || undefined }}>
      <div ref={inner} style={{ width, transform: `scale(${fit.scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  )
}

function IosWhatsAppFrame({ children, detail, reactions = true }: { children: ReactNode; detail?: ReactNode; reactions?: boolean }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#f0ece6] shadow-sm">
      {detail}
      <div className="flex items-center gap-2 bg-[#f6f3ee] px-3 py-2.5">
        <div className="flex h-8 items-center gap-0.5 rounded-full bg-white/80 pl-1.5 pr-2.5 text-[12px] font-medium text-[#111b21] shadow-sm">
          <Icon name="chevron-left" size={14} />
          174
        </div>
        <img src={APP_ICON_SRC} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
        <div className="flex min-w-0 flex-1 items-center gap-1 text-[14px] font-semibold text-[#111b21]">
          <span className="truncate">tiket.com promo</span>
          <Icon name="badge-check" size={13} className="shrink-0 text-[#1d9bf0]" />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#111b21] shadow-sm">
          <Icon name="more" size={16} />
        </div>
      </div>

      <div className="space-y-3 px-3 pb-3 pt-4" style={{ backgroundImage: WA_WALLPAPER, backgroundSize: '30px 34px' }}>
        <div className="flex justify-center">
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#111b21]">12 Dec 2025</span>
        </div>
        {children}
        <div className={`gap-2 ${reactions ? 'flex' : 'hidden'}`}>
          {[false, true].map((down) => (
            <div key={String(down)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#54656f]">
              <ThumbIcon down={down} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 pb-3 pt-1">
        <Icon name="plus" size={20} className="shrink-0 text-[#111b21]" />
        <div className="flex h-8 flex-1 items-center justify-end rounded-full border border-[#d9d5cf] bg-white px-2.5 text-[#54656f]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 12a8 8 0 1 0-8 8c4.5 0 8-3.5 8-8Z" />
            <path d="M20 12c-4.5 0-8 0-8 8" />
          </svg>
        </div>
        <Icon name="camera" size={20} className="shrink-0 text-[#111b21]" />
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: WA_BRAND }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function WhatsAppPreview({ copy, lang }: { copy: CopyFields; lang: Lang | 'both' }) {
  const [variant, setVariant] = useState<1 | 2>(1)
  const [phoneWidth, setPhoneWidth] = useState<PhoneWidth>(360)
  const [open, setOpen] = useState<{ lang: Lang; index: number } | null>(null)
  const langs: Lang[] = lang === 'both' ? ['en', 'id'] : [lang]
  const cardsFor = (l: Lang) => [
    { text: copy.whatsapp[l], cta: copy.whatsappCta[l], banner: copy.whatsappBanner[l] },
    ...(copy.whatsappShow.carousel
      ? copy.whatsappCards.map((c) => ({ text: c.text[l], cta: c.cta[l], banner: c.banner[l] }))
      : []),
  ]
  const openCard = open && langs.includes(open.lang) ? cardsFor(open.lang)[open.index] : undefined
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex rounded-md bg-surface-3 p-0.5">
          {([1, 2] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                variant === v ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {v === 1 ? 'Text' : 'Text + Image'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
          <div className="flex rounded-md bg-surface-3 p-0.5">
            {PHONE_WIDTHS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setPhoneWidth(w)}
                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                  phoneWidth === w ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>
        </div>
      </div>

    <div className="rounded-lg border border-line bg-surface-2 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
        <Icon name="whatsapp" size={13} className="text-[#25d366]" />
        WhatsApp Blast
      </div>

      <PhoneViewport width={phoneWidth}>
      {variant === 1 ? (
        <IosWhatsAppFrame reactions={false}>
          {langs.map((l) => (
            <ChatBubble key={l} text={copy.whatsapp[l]} />
          ))}
        </IosWhatsAppFrame>
      ) : (
        <IosWhatsAppFrame
          detail={
            openCard ? (
              <MessageDetail
                text={openCard.text}
                cta={openCard.cta}
                banner={openCard.banner}
                show={copy.whatsappShow}
                onClose={() => setOpen(null)}
              />
            ) : undefined
          }
        >
          {langs.map((l) => {
            const cards = cardsFor(l)
            return (
              <div key={l} className="space-y-1.5">
                {copy.whatsappShow.intro && <IntroBubble text={copy.whatsappIntro[l]} />}
                {cards.length > 1 ? (
                  <div className="-mx-3 flex snap-x scroll-pl-3 items-stretch gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none]">
                    {cards.map((c, i) => (
                      <RichChatBubble
                        key={i}
                        {...c}
                        show={copy.whatsappShow}
                        carousel
                        tail={i === 0}
                        onOpen={() => setOpen({ lang: l, index: i })}
                      />
                    ))}
                  </div>
                ) : (
                  <RichChatBubble {...cards[0]} show={copy.whatsappShow} onOpen={() => setOpen({ lang: l, index: 0 })} />
                )}
              </div>
            )
          })}
        </IosWhatsAppFrame>
      )}
      </PhoneViewport>

      <div className="mt-2.5 space-y-2">
        {langs.map((l) => (
          <LangBlock key={l} lang={lang === 'both' ? l : undefined}>
            <CounterLabel count={countChars(copy.whatsapp[l])} max={LIMITS.whatsapp} warnAt={LIMITS.whatsappWarn} />
            {variant === 2 && copy.whatsappShow.intro && (
              <CounterLabel count={countChars(copy.whatsappIntro[l])} max={LIMITS.whatsapp} warnAt={LIMITS.whatsappWarn} />
            )}
            {variant === 2 && copy.whatsappShow.cta && <CounterLabel count={countChars(copy.whatsappCta[l])} max={LIMITS.whatsappCta} />}
          </LangBlock>
        ))}
      </div>
    </div>
    </div>
  )
}

const LOCKSCREEN_DATE = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

const LOCKSCREEN_WALLPAPER = [
  'radial-gradient(ellipse 60% 45% at 18% 12%, rgba(163,224,201,0.65), transparent 60%)',
  'radial-gradient(ellipse 55% 50% at 80% 28%, rgba(74,102,189,0.65), transparent 60%)',
  'radial-gradient(ellipse 70% 55% at 30% 88%, rgba(58,140,125,0.55), transparent 65%)',
  'linear-gradient(165deg, #dcefe6 0%, #6c86b8 42%, #202c4a 78%, #10131f 100%)',
].join(',')

function LockScreenNotification({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative rounded-2xl bg-white/25 py-2.5 pl-2.5 pr-3 shadow-sm ring-1 ring-white/25 backdrop-blur-md">
      <span className="absolute right-3 top-2.5 text-[10px] text-white/60">1m ago</span>
      <div className="flex gap-2.5 pr-9">
        <img src={APP_ICON_SRC} alt="" className="h-8 w-8 shrink-0 rounded-[8px] object-cover shadow-sm" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold leading-snug text-white">
            {title ? <InlineText text={title} /> : <span className="italic font-normal text-white/50">No title yet</span>}
          </div>
          <div className="text-xs leading-snug text-white/85">
            {subtitle ? <FormattedText text={subtitle} /> : <span className="italic text-white/50">No subtitle yet</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PushPreview({ copy, lang }: { copy: CopyFields; lang: Lang | 'both' }) {
  const langs: Lang[] = lang === 'both' ? ['en', 'id'] : [lang]
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
        <Icon name="bell" size={13} />
        Push Notification
      </div>

      <div
        className="mx-auto w-[360px] overflow-hidden rounded-[26px] shadow-inner"
        style={{ backgroundImage: LOCKSCREEN_WALLPAPER }}
      >
        <div className="px-3.5 pb-5 pt-3">
          <div className="flex items-center justify-between text-white/90">
            <span className="text-[11px] font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <Icon name="signal" size={12} />
              <Icon name="wifi" size={13} />
              <Icon name="battery" size={15} />
            </div>
          </div>

          <div className="mt-2.5 text-center text-white">
            <div className="flex items-center justify-center gap-1.5 text-[10.5px] font-medium text-white/75">
              <span>{LOCKSCREEN_DATE}</span>
              <span aria-hidden="true">🌐</span>
              <span>9:41 AM</span>
            </div>
            <div className="text-[32px] font-semibold leading-none tracking-tight [text-shadow:0_1px_16px_rgba(0,0,0,0.25)]">
              9:41
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {langs.map((l) => (
              <LockScreenNotification key={l} title={copy.push.title[l]} subtitle={copy.push.subtitle[l]} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between px-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white/90 backdrop-blur-sm">
              <Icon name="flashlight" size={15} />
            </div>
            <div className="h-1 w-24 rounded-full bg-white/60" />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white/90 backdrop-blur-sm">
              <Icon name="camera" size={15} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2.5 space-y-2">
        {langs.map((l) => (
          <LangBlock key={l} lang={lang === 'both' ? l : undefined}>
            <div className="space-y-0.5">
              <CounterLabel count={countChars(copy.push.title[l])} max={LIMITS.pushTitle} />
              <CounterLabel count={countChars(copy.push.subtitle[l])} max={LIMITS.pushSubtitle} />
            </div>
          </LangBlock>
        ))}
      </div>
    </div>
  )
}

function SMSBubble({ text }: { text: string }) {
  return (
    <div className="relative max-w-[85%] rounded-2xl rounded-bl-sm bg-[#e9e9eb] px-3.5 py-2 text-[13px] leading-relaxed text-[#111111] shadow-[0_1px_0.5px_rgba(0,0,0,0.08)]">
      {text ? <FormattedText text={text} /> : <span className="italic text-[#8e8e93]">No copy written yet.</span>}
    </div>
  )
}

export function SMSPreview({ copy, lang }: { copy: CopyFields; lang: Lang | 'both' }) {
  const langs: Lang[] = lang === 'both' ? ['en', 'id'] : [lang]
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
        <Icon name="sms" size={13} />
        SMS
      </div>

      <div className="mx-auto w-[360px] overflow-hidden rounded-[26px] bg-white shadow-sm">
        <div className="px-3.5 pb-2 pt-3">
          <div className="flex items-center justify-between text-[#111111]">
            <span className="text-[11px] font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <Icon name="signal" size={12} />
              <Icon name="wifi" size={13} />
              <Icon name="battery" size={15} />
            </div>
          </div>
          <div className="mt-2 flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8e8e93] text-white">
              <Icon name="sms" size={16} />
            </div>
            <div className="mt-1 text-[12px] font-medium text-[#111111]">tiket.com</div>
            <div className="text-[10.5px] text-[#8e8e93]">Text Message</div>
          </div>
        </div>

        <div className="space-y-3 border-t border-[#e5e5ea] px-3 py-4">
          <div className="flex justify-center">
            <span className="text-[10.5px] font-medium text-[#8e8e93]">Today 9:41 AM</span>
          </div>
          {langs.map((l) => (
            <div key={l} className="flex justify-start">
              <SMSBubble text={copy.sms[l]} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2.5 space-y-2">
        {langs.map((l) => (
          <LangBlock key={l} lang={lang === 'both' ? l : undefined}>
            <CounterLabel count={countChars(copy.sms[l])} max={LIMITS.sms} warnAt={LIMITS.smsWarn} />
          </LangBlock>
        ))}
      </div>
    </div>
  )
}

function FlightAssistantCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[336px]">
      <div
        className="animate-gradient-snake rounded-[20px] p-[2px] shadow-[0_8px_20px_-8px_rgba(30,30,40,0.35)]"
        style={{ backgroundImage: GRADIENT_BORDER, backgroundSize: '300% 300%' }}
      >
        <div
          className="relative rounded-[18px] p-4"
          style={{ backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #fbfaff 55%, #f4f1fd 100%)' }}
        >
          <button
            type="button"
            aria-label="Dismiss"
            className="absolute right-4 top-4 flex h-4 w-4 items-center justify-center text-[#8b8f97] transition-colors hover:text-[#4b4d54]"
          >
            <Icon name="close" size={14} className="stroke-[2.25]" />
          </button>
          <div className="line-clamp-2 flex items-start gap-1 pr-7 text-[15px] font-bold leading-snug text-[#17181a]">
            {title ? <InlineText text={title} /> : <span className="italic font-normal text-[#9aa0a6]">No title yet</span>}
          </div>
          <div className="mt-2 flex items-end gap-3">
            <div className="line-clamp-3 min-w-0 flex-1 text-[12.5px] leading-[1.4] text-[#3c3d40]">
              {description ? (
                <FormattedText text={description} className="!space-y-0 [&_strong]:font-bold [&_strong]:text-[#17181a]" />
              ) : (
                <span className="italic text-[#9aa0a6]">No description yet</span>
              )}
            </div>
            <button
              type="button"
              className="shrink-0 rounded-full bg-gradient-to-br from-[#5b93f7] to-[#2f6fed] px-3 py-1.5 text-[11px] font-bold text-white shadow-[0_4px_10px_-2px_rgba(47,111,237,0.55)]"
            >
              Select
            </button>
          </div>
        </div>
      </div>
      <svg
        className="absolute -bottom-[8px] right-12 drop-shadow-sm"
        width="16"
        height="8"
        viewBox="0 0 16 8"
        aria-hidden="true"
      >
        <path d="M0 0h16L9 8Z" fill="#fbfaff" />
      </svg>
    </div>
  )
}

export function FlightAssistantPreview({ copy, lang }: { copy: CopyFields; lang: Lang | 'both' }) {
  const langs: Lang[] = lang === 'both' ? ['en', 'id'] : [lang]
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
        <Icon name="plane" size={13} />
        Flight Assistant
      </div>

      <div className="mx-auto w-[360px] overflow-hidden rounded-xl bg-[#d7dae4] px-3 py-5">
        {langs.map((l) => (
          <div key={l} className={l !== langs[0] ? 'mt-4' : ''}>
            <FlightAssistantCard title={copy.flightAssistant.title[l]} description={copy.flightAssistant.description[l]} />
          </div>
        ))}
      </div>

      <div className="mt-2.5 space-y-2">
        {langs.map((l) => (
          <LangBlock key={l} lang={lang === 'both' ? l : undefined}>
            <div className="space-y-0.5">
              <CounterLabel count={countChars(copy.flightAssistant.title[l])} max={LIMITS.flightAssistantTitle} />
              <CounterLabel count={countChars(copy.flightAssistant.description[l])} max={LIMITS.flightAssistantDescription} />
            </div>
          </LangBlock>
        ))}
      </div>
    </div>
  )
}
