import { useStore } from '../store'

const VARIANTS = [
  { id: 'text', label: 'Text' },
  { id: 'image', label: 'Text + Image' },
] as const

export function WhatsAppVariantTabs({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const md = size === 'md'
  const variant = useStore((s) => s.whatsappVariant)
  const setVariant = useStore((s) => s.setWhatsappVariant)
  return (
    <div className={`flex w-fit ${md ? 'rounded-xl p-1' : 'rounded-md p-0.5'} bg-surface-3`} role="tablist" aria-label="WhatsApp variant">
      {VARIANTS.map((v) => (
        <button
          key={v.id}
          type="button"
          role="tab"
          aria-selected={variant === v.id}
          onClick={() => setVariant(v.id)}
          className={`font-medium transition-all ${
            md ? 'rounded-lg px-4 py-1.5 text-[13px]' : 'rounded px-2.5 py-1 text-[11px]'
          } ${variant === v.id ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}
        >
          {v.label}
        </button>
      ))}
    </div>
  )
}
