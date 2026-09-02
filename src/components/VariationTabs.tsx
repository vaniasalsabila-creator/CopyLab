import { useStore } from '../store'
import { Icon } from './icons'
import { OverflowMenu } from './ui'

export function VariationTabs() {
  const projectId = useStore((s) => s.selectedProjectId)
  const allVariations = useStore((s) => s.variations)
  const variations = allVariations.filter((v) => v.projectId === projectId)
  const selectedVariationId = useStore((s) => s.selectedVariationId)
  const selectVariation = useStore((s) => s.selectVariation)
  const setModal = useStore((s) => s.setModal)
  const duplicateVariation = useStore((s) => s.duplicateVariation)

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-line px-6 pt-3">
      {variations.map((v) => {
        const active = v.id === selectedVariationId
        return (
          <div
            key={v.id}
            className={`group flex shrink-0 items-center gap-1 rounded-t-lg border-b-2 px-3 py-2 text-[13px] font-medium transition-colors ${
              active ? 'border-accent text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <button onClick={() => selectVariation(v.id)} className="max-w-[180px] truncate">
              {v.name}
            </button>
            <div className={`transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <OverflowMenu
                items={[
                  { label: 'Rename', icon: 'pencil', onClick: () => setModal({ type: 'variation-rename', variationId: v.id }) },
                  { label: 'Duplicate', icon: 'copy', onClick: () => duplicateVariation(v.id) },
                  {
                    label: 'Delete',
                    icon: 'trash',
                    danger: true,
                    onClick: () =>
                      setModal({
                        type: 'confirm-delete',
                        title: 'Delete variation?',
                        body: `"${v.name}" and all of its options will be permanently deleted.`,
                        onConfirm: () => useStore.getState().deleteVariation(v.id),
                      }),
                  },
                ]}
              />
            </div>
          </div>
        )
      })}
      <button
        onClick={() => setModal({ type: 'variation-create' })}
        className="mb-0.5 flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink"
      >
        <Icon name="plus" size={14} />
        Add Variation
      </button>
    </div>
  )
}
