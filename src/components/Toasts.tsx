import { useStore } from '../store'
import { Icon } from './icons'

export function Toasts() {
  const toasts = useStore((s) => s.toasts)
  if (toasts.length === 0) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex flex-col items-center gap-2 px-4" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast-in pointer-events-auto flex items-center gap-2 rounded-full bg-btn px-3.5 py-2 text-[13px] font-medium text-btn-fg shadow-[0_4px_20px_-2px_var(--btn-glow),0_2px_8px_rgba(0,0,0,0.25)]"
        >
          <Icon name="check" size={14} />
          {t.message}
        </div>
      ))}
    </div>
  )
}
