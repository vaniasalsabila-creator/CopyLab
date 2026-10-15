import type { Channel } from '../types'

/**
 * Single source of truth for which channels are shown, and in what order.
 * Set `enabled: true` on Flight Assistant to bring it back everywhere
 * (tabs, preview mode and compare table). All its code is kept intact.
 */
export const CHANNELS: { id: Channel; label: string; previewLabel: string; enabled: boolean }[] = [
  { id: 'push', label: 'Push Notification', previewLabel: 'Push Notification', enabled: true },
  { id: 'whatsapp', label: 'WhatsApp Blast', previewLabel: 'WhatsApp', enabled: true },
  { id: 'sms', label: 'SMS', previewLabel: 'SMS', enabled: true },
  { id: 'flightAssistant', label: 'Flight Assistant', previewLabel: 'Flight Assistant', enabled: false },
]

export const ENABLED_CHANNELS = CHANNELS.filter((c) => c.enabled)
export const DEFAULT_CHANNEL: Channel = ENABLED_CHANNELS[0]!.id
export const isChannelEnabled = (id: Channel) => ENABLED_CHANNELS.some((c) => c.id === id)
