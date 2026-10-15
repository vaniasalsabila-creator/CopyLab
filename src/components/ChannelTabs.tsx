import { useStore } from '../store'
import type { Channel } from '../types'

const CHANNEL_TABS: { id: Channel; label: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp Blast' },
  { id: 'push', label: 'Push Notification' },
  { id: 'sms', label: 'SMS' },
  { id: 'flightAssistant', label: 'Flight Assistant' },
]

export function ChannelTabs() {
  const channel = useStore((s) => s.channel)
  const setChannel = useStore((s) => s.setChannel)

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
      <div className="flex w-44 shrink-0 items-center gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-btn text-[12px] font-semibold text-btn-fg shadow-sm">3</span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-ink">Platform</div>
          <div className="text-[11px] text-ink-faint">Where copy is sent</div>
        </div>
      </div>
      <div className="flex flex-wrap rounded-lg bg-surface-3 p-0.5">
        {CHANNEL_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setChannel(tab.id)}
            className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
              channel === tab.id ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
