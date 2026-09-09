import { useMemo } from 'react'
import { useStore } from '../store'
import { LIMITS } from '../lib/chars'
import { CopyField } from './CharField'
import { Button, EmptyState } from './ui'
import type { Channel, Lang } from '../types'

const CHANNEL_TABS: { id: Channel; label: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp Blast' },
  { id: 'push', label: 'Push Notification' },
  { id: 'sms', label: 'SMS' },
]

const LANG_TABS: { id: 'en' | 'id' | 'both'; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'id', label: 'ID' },
  { id: 'both', label: 'EN + ID' },
]

export function CopyEditor() {
  const option = useStore((s) => s.options.find((o) => o.id === s.selectedOptionId))
  const channel = useStore((s) => s.channel)
  const setChannel = useStore((s) => s.setChannel)
  const editorLang = useStore((s) => s.editorLang)
  const setEditorLang = useStore((s) => s.setEditorLang)
  const updateCopy = useStore((s) => s.updateCopy)
  const setModal = useStore((s) => s.setModal)

  const langs: Lang[] = useMemo(() => (editorLang === 'both' ? ['en', 'id'] : [editorLang]), [editorLang])

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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-3">
        <div className="flex rounded-lg bg-surface-3 p-0.5">
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
        <div className="flex rounded-lg bg-surface-3 p-0.5">
          {LANG_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setEditorLang(tab.id)}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                editorLang === tab.id ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 py-5">
        {channel === 'whatsapp' ? (
          <div>
            <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-faint">WhatsApp Blast</h3>
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
          </div>
        ) : channel === 'push' ? (
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-faint">Title</h3>
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
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-faint">Subtitle</h3>
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
        ) : (
          <div>
            <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-faint">SMS</h3>
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
        )}
      </div>
    </div>
  )
}
