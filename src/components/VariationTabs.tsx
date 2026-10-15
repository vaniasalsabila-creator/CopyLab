import { useEffect, useRef, useState } from 'react'
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

  const current = variations.find((v) => v.id === selectedVariationId)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
      <div className="flex w-44 shrink-0 items-center gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-btn text-[12px] font-semibold text-btn-fg shadow-sm">1</span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-ink">Variation</div>
          <div className="text-[11px] text-ink-faint">Version to test</div>
        </div>
      </div>

      <div ref={wrapRef} className="relative min-w-0">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 min-w-[220px] max-w-[320px] items-center justify-between gap-2 rounded-lg border border-line bg-surface px-3 text-[13px] font-medium text-ink shadow-sm shadow-black/[0.03] transition-all hover:border-line-strong focus-visible:outline-2 focus-visible:outline-accent/30"
        >
          <span className="truncate">{current?.name ?? 'Select variation'}</span>
          <Icon name="chevron-down" size={14} className={`shrink-0 text-ink-faint transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute left-0 top-full z-[60] mt-1 max-h-72 min-w-full overflow-y-auto rounded-lg border border-line bg-surface py-1 shadow-lg shadow-black/10"
          >
            {variations.map((v) => (
              <button
                key={v.id}
                role="option"
                aria-selected={v.id === selectedVariationId}
                onClick={() => {
                  selectVariation(v.id)
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] text-ink transition-colors hover:bg-surface-3"
              >
                <span className="w-3.5 shrink-0">{v.id === selectedVariationId && <Icon name="check" size={14} />}</span>
                <span className="truncate">{v.name}</span>
              </button>
            ))}
            <div className="my-1 border-t border-line" />
            <button
              onClick={() => {
                setOpen(false)
                setModal({ type: 'variation-create' })
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink"
            >
              <Icon name="plus" size={14} />
              Add Variation
            </button>
          </div>
        )}
      </div>

      {current && (
        <OverflowMenu
          items={[
            { label: 'Rename', icon: 'pencil', onClick: () => setModal({ type: 'variation-rename', variationId: current.id }) },
            { label: 'Duplicate', icon: 'copy', onClick: () => duplicateVariation(current.id) },
            {
              label: 'Delete',
              icon: 'trash',
              danger: true,
              onClick: () =>
                setModal({
                  type: 'confirm-delete',
                  title: 'Delete variation?',
                  body: `"${current.name}" and all of its options will be permanently deleted.`,
                  onConfirm: () => useStore.getState().deleteVariation(current.id),
                }),
            },
          ]}
        />
      )}
    </div>
  )
}
