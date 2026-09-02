import { useStore } from '../store'
import { WhatsAppPreview, PushPreview } from './PreviewCard'
import { Button } from './ui'
import { Icon } from './icons'

export function PreviewPanel() {
  const option = useStore((s) => s.options.find((o) => o.id === s.selectedOptionId))
  const channel = useStore((s) => s.channel)
  const editorLang = useStore((s) => s.editorLang)
  const openPreview = useStore((s) => s.openPreview)
  const optionCount = useStore((s) => s.options.filter((o) => o.variationId === s.selectedVariationId).length)

  return (
    <aside className="hidden w-[424px] shrink-0 flex-col border-l border-line bg-surface lg:flex">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <h2 className="text-[13px] font-semibold text-ink">Live Preview</h2>
          <p className="text-xs text-ink-faint">How this option looks right now</p>
        </div>
        <Icon name="eye" size={16} className="text-ink-faint" />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {option ? (
          channel === 'whatsapp' ? (
            <WhatsAppPreview copy={option.copy} lang={editorLang} />
          ) : (
            <PushPreview copy={option.copy} lang={editorLang} />
          )
        ) : (
          <p className="text-sm text-ink-faint">Select an option to preview it here.</p>
        )}
      </div>
      {optionCount > 1 && (
        <div className="border-t border-line p-4">
          <Button variant="secondary" size="sm" icon="grid" className="w-full" onClick={() => openPreview()}>
            Compare all {optionCount} options
          </Button>
        </div>
      )}
    </aside>
  )
}
