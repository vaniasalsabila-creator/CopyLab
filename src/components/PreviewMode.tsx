import { useStore } from '../store'
import { IconButton } from './ui'
import { WhatsAppPreview, PushPreview, SMSPreview } from './PreviewCard'
import { CompareTable } from './CompareTable'

export function PreviewMode() {
  const previewOpen = useStore((s) => s.previewOpen)
  const variation = useStore((s) => s.variations.find((v) => v.id === s.selectedVariationId))
  const optionsRaw = useStore((s) => s.options)
  const selectedVariationId = useStore((s) => s.selectedVariationId)
  const allOptions = optionsRaw.filter((o) => o.variationId === selectedVariationId)
  const previewOptionIds = useStore((s) => s.previewOptionIds)
  const togglePreviewOption = useStore((s) => s.togglePreviewOption)
  const previewChannel = useStore((s) => s.previewChannel)
  const setPreviewChannel = useStore((s) => s.setPreviewChannel)
  const previewLang = useStore((s) => s.previewLang)
  const setPreviewLang = useStore((s) => s.setPreviewLang)
  const previewView = useStore((s) => s.previewView)
  const setPreviewView = useStore((s) => s.setPreviewView)
  const closePreview = useStore((s) => s.closePreview)

  if (!previewOpen || !variation) return null

  const selectedOptions = allOptions.filter((o) => previewOptionIds.includes(o.id))

  return (
    <div className="fixed inset-0 z-40 flex animate-overlay-in flex-col bg-canvas">
      <div className="border-b border-line bg-surface px-5 py-4 sm:px-8">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-ink">{variation.name} — Preview</h1>
            <p className="mt-0.5 text-sm text-ink-muted">Compare how your copy looks across different options.</p>
          </div>
          <IconButton icon="close" label="Close preview" onClick={closePreview} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            label="Channel"
            value={previewChannel}
            onChange={(v) => setPreviewChannel(v as typeof previewChannel)}
            options={[
              { id: 'whatsapp', label: 'WhatsApp' },
              { id: 'push', label: 'Push Notification' },
              { id: 'sms', label: 'SMS' },
            ]}
          />
          <SegmentedControl
            label="Language"
            value={previewLang}
            onChange={(v) => setPreviewLang(v as typeof previewLang)}
            options={[
              { id: 'en', label: 'EN' },
              { id: 'id', label: 'ID' },
            ]}
          />
          <SegmentedControl
            label="View"
            value={previewView}
            onChange={(v) => setPreviewView(v as typeof previewView)}
            options={[
              { id: 'preview', label: 'Preview' },
              { id: 'compare', label: 'Compare' },
            ]}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <span className="text-xs font-medium text-ink-faint">Options:</span>
          {allOptions.map((o) => {
            const checked = previewOptionIds.includes(o.id)
            return (
              <label
                key={o.id}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  checked ? 'border-accent/30 bg-accent-soft text-accent' : 'border-line text-ink-muted hover:border-line-strong'
                }`}
              >
                <input type="checkbox" checked={checked} onChange={() => togglePreviewOption(o.id)} className="h-3 w-3 accent-accent" />
                {o.name}
              </label>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-8">
        {selectedOptions.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-faint">Select at least one option above to preview it.</p>
        ) : previewView === 'preview' ? (
          <div className="flex snap-x flex-wrap gap-4 overflow-x-auto pb-2 sm:snap-none">
            {selectedOptions.map((o) => (
              <div key={o.id} className="w-[408px] shrink-0 snap-start rounded-xl border border-line bg-surface p-3 transition-shadow hover:shadow-md hover:shadow-black/[0.04]">
                <div className="mb-2 truncate text-[13px] font-semibold text-ink">{o.name}</div>
                {previewChannel === 'whatsapp' ? (
                  <WhatsAppPreview copy={o.copy} lang={previewLang} />
                ) : previewChannel === 'push' ? (
                  <PushPreview copy={o.copy} lang={previewLang} />
                ) : (
                  <SMSPreview copy={o.copy} lang={previewLang} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <CompareTable options={selectedOptions} />
        )}
      </div>
    </div>
  )
}

function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { id: T; label: string }[]
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="hidden text-xs font-medium text-ink-faint sm:inline">{label}</span>
      <div className="flex rounded-lg bg-surface-3 p-0.5" role="tablist" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.id}
            role="tab"
            aria-selected={value === opt.id}
            onClick={() => onChange(opt.id)}
            className={`rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
              value === opt.id ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
