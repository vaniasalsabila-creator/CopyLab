import { useStore } from '../store'
import { Icon } from './icons'
import { OverflowMenu } from './ui'

export function OptionTabs() {
  const variationId = useStore((s) => s.selectedVariationId)
  const allOptions = useStore((s) => s.options)
  const options = allOptions.filter((o) => o.variationId === variationId)
  const selectedOptionId = useStore((s) => s.selectedOptionId)
  const selectOption = useStore((s) => s.selectOption)
  const setModal = useStore((s) => s.setModal)
  const duplicateOption = useStore((s) => s.duplicateOption)
  const variationName = useStore((s) => s.variations.find((v) => v.id === s.selectedVariationId)?.name)

  if (!variationId) return null

  return (
    <div className="flex flex-wrap items-start gap-x-4 gap-y-3 px-4 py-3">
      <div className="flex min-h-9 w-44 shrink-0 items-center gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-btn text-[12px] font-semibold text-btn-fg shadow-sm">2</span>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[13px] font-semibold text-ink">Options</div>
          <div className="truncate text-[11px] text-ink-faint" title={`Copy drafts in “${variationName}”`}>
            Drafts in “{variationName}”
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
        {options.map((o) => {
          const active = o.id === selectedOptionId
          return (
            <div
              key={o.id}
              className={`group flex shrink-0 items-center gap-1 h-9 rounded-lg border px-3 text-[13px] font-medium transition-all ${
                active ? 'border-accent/40 bg-accent-soft text-ink shadow-sm' : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink'
              }`}
            >
              <button onClick={() => selectOption(o.id)} className="max-w-[220px] truncate">
                {o.name}
              </button>
              <div className={`transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <OverflowMenu
                  items={[
                    { label: 'Rename', icon: 'pencil', onClick: () => setModal({ type: 'option-rename', optionId: o.id }) },
                    { label: 'Duplicate', icon: 'copy', onClick: () => duplicateOption(o.id) },
                    { label: 'Move', icon: 'move', onClick: () => setModal({ type: 'option-move', optionId: o.id }) },
                    {
                      label: 'Delete',
                      icon: 'trash',
                      danger: true,
                      onClick: () =>
                        setModal({
                          type: 'confirm-delete',
                          title: 'Delete option?',
                          body: `"${o.name}" and its copy will be permanently deleted.`,
                          onConfirm: () => useStore.getState().deleteOption(o.id),
                        }),
                    },
                  ]}
                />
              </div>
            </div>
          )
        })}
        <button
          onClick={() => setModal({ type: 'option-create' })}
          className="flex h-9 shrink-0 items-center gap-1 rounded-lg border border-dashed border-line-strong px-3 text-[13px] font-medium text-ink-muted transition-colors hover:border-accent/40 hover:bg-surface-3 hover:text-ink"
        >
          <Icon name="plus" size={14} />
          Add Option
        </button>
      </div>
    </div>
  )
}
