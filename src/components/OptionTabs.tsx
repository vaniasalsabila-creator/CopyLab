import { useStore } from '../store'
import { Icon } from './icons'
import { Button, OverflowMenu } from './ui'

export function OptionTabs() {
  const variationId = useStore((s) => s.selectedVariationId)
  const allOptions = useStore((s) => s.options)
  const options = allOptions.filter((o) => o.variationId === variationId)
  const selectedOptionId = useStore((s) => s.selectedOptionId)
  const selectOption = useStore((s) => s.selectOption)
  const setModal = useStore((s) => s.setModal)
  const duplicateOption = useStore((s) => s.duplicateOption)
  const openPreview = useStore((s) => s.openPreview)

  if (!variationId) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {options.map((o) => {
          const active = o.id === selectedOptionId
          return (
            <div
              key={o.id}
              className={`group flex shrink-0 items-center gap-1 rounded-md border px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                active ? 'border-accent/30 bg-accent-soft text-accent' : 'border-line text-ink-muted hover:border-line-strong hover:bg-surface-2'
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
          className="flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink"
        >
          <Icon name="plus" size={14} />
          Add Option
        </button>
      </div>
      {options.length > 0 && (
        <Button variant="primary" size="sm" icon="eye" onClick={() => openPreview()}>
          Preview Options
        </Button>
      )}
    </div>
  )
}
