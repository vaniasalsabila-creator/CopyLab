import type { CopyFields, Lang } from '../types'
import { countChars, LIMITS } from '../lib/chars'
import { CounterLabel } from './CharField'
import { Icon } from './icons'
import type { ReactNode } from 'react'

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

function ChatBubbleTail() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" className="absolute -left-2 top-0 text-white" aria-hidden="true">
      <path fill="currentColor" d="M8 0C8 0 4.5 0.2 4 3C3.6 5.3 6 9 0 13H8V0Z" />
    </svg>
  )
}

function ChatBubble({ text }: { text: string }) {
  return (
    <div className="relative ml-1.5 max-w-full rounded-lg rounded-tl-none bg-white px-2.5 py-[7px] text-[13px] leading-relaxed text-[#111b21] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]">
      <ChatBubbleTail />
      {text ? (
        <span className="whitespace-pre-wrap break-words">{text}</span>
      ) : (
        <span className="italic text-[#8696a0]">No copy written yet.</span>
      )}
      <div className="mt-0.5 text-right text-[10.5px] text-[#667781]">9:41 AM</div>
    </div>
  )
}

export function WhatsAppPreview({ copy, lang }: { copy: CopyFields; lang: Lang | 'both' }) {
  const langs: Lang[] = lang === 'both' ? ['en', 'id'] : [lang]
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
        <Icon name="whatsapp" size={13} className="text-[#25d366]" />
        WhatsApp Blast
      </div>

      <div className="mx-auto w-[360px] overflow-hidden rounded-xl shadow-sm">
        <div className="flex items-center gap-2 bg-[#075E54] px-3 py-2.5 text-white">
          <img src={APP_ICON_SRC} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[13px] font-medium leading-tight">
              <span className="truncate">tiket.com</span>
              <Icon name="badge-check" size={12} className="shrink-0 text-[#53bdeb]" />
            </div>
            <div className="text-[10.5px] leading-tight text-white/70">Business Account</div>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-white/80">
            <Icon name="video" size={16} />
            <Icon name="phone" size={14} />
          </div>
        </div>

        <div
          className="space-y-3 px-3 py-4"
          style={{ backgroundColor: '#e9ded2', backgroundImage: WA_WALLPAPER, backgroundSize: '30px 34px' }}
        >
          <div className="flex justify-center">
            <span className="rounded-md bg-white/70 px-2.5 py-1 text-[10.5px] font-medium text-[#54656f] shadow-sm">Today</span>
          </div>
          {langs.map((l) => (
            <ChatBubble key={l} text={copy.whatsapp[l]} />
          ))}
        </div>
      </div>

      <div className="mt-2.5 space-y-2">
        {langs.map((l) => (
          <LangBlock key={l} lang={lang === 'both' ? l : undefined}>
            <CounterLabel count={countChars(copy.whatsapp[l])} max={LIMITS.whatsapp} warnAt={LIMITS.whatsappWarn} />
          </LangBlock>
        ))}
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
            {title || <span className="italic font-normal text-white/50">No title yet</span>}
          </div>
          <div className="text-xs leading-snug text-white/85">
            {subtitle || <span className="italic text-white/50">No subtitle yet</span>}
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
