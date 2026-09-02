import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon, type IconName } from './icons'

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className = '',
  ...props
}: {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-solid'
  size?: 'sm' | 'md'
  icon?: IconName
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-none whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.97]'
  const sizes = size === 'sm' ? 'h-7 px-2.5 text-[13px]' : 'h-9 px-3.5 text-sm'
  const variants: Record<string, string> = {
    primary:
      'bg-btn text-btn-fg shadow-[0_1px_2px_rgba(0,0,0,0.2)] hover:bg-btn-hover hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_6px_24px_-4px_var(--btn-glow)] hover:-translate-y-px',
    secondary: 'border border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-2',
    ghost: 'text-ink-muted hover:bg-surface-3 hover:text-ink',
    danger: 'text-red-600 hover:bg-red-500/10',
    'danger-solid': 'bg-red-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] hover:bg-red-700 hover:shadow-[0_6px_20px_-4px_rgba(220,38,38,0.5)] hover:-translate-y-px',
  }
  return (
    <button className={`${base} ${sizes} ${variants[variant]} ${className}`} {...props}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 15} />}
      {children}
    </button>
  )
}

export const IconButton = forwardRef<
  HTMLButtonElement,
  { icon: IconName; label: string; active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function IconButton({ icon, label, className = '', active, ...props }, ref) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-all duration-150 hover:bg-surface-3 hover:text-ink active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        active ? 'bg-accent-soft text-accent hover:bg-accent-soft' : ''
      } ${className}`}
      {...props}
    >
      <Icon name={icon} size={16} />
    </button>
  )
})

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: IconName
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-3 text-ink-faint">
        <Icon name={icon} size={20} />
      </div>
      <div className="space-y-1">
        <h3 className="text-[15px] font-medium text-ink">{title}</h3>
        <p className="max-w-xs text-sm text-ink-muted">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function OverflowMenu({
  items,
  align = 'right',
}: {
  items: { label: string; icon?: IconName; onClick: () => void; danger?: boolean }[]
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left?: number; right?: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function place() {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      if (align === 'right') {
        setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
      } else {
        setPos({ top: rect.bottom + 4, left: rect.left })
      }
    }
    place()
    function onDown(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) {
        return
      }
      setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, align])

  return (
    <>
      <IconButton
        ref={triggerRef}
        icon="more"
        label="More actions"
        active={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
      />
      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: pos.top, left: pos.left, right: pos.right }}
            className="animate-menu-in z-[70] min-w-[160px] origin-top-right rounded-lg border border-line bg-surface py-1 shadow-lg shadow-black/10"
            role="menu"
          >
            {items.map((item) => (
              <button
                key={item.label}
                role="menuitem"
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] transition-colors hover:bg-surface-3 ${
                  item.danger ? 'text-red-500' : 'text-ink'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(false)
                  item.onClick()
                }}
              >
                {item.icon && <Icon name={item.icon} size={14} />}
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}

export function Modal({
  title,
  children,
  onClose,
  width = 400,
}: {
  title: string
  children: ReactNode
  onClose: () => void
  width?: number
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--overlay)' }}
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ width }}
        className="animate-modal-in w-full max-w-full rounded-xl border border-line bg-surface p-5 shadow-2xl shadow-black/20"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="modal-title" className="text-[15px] font-semibold text-ink">
            {title}
          </h2>
          <IconButton icon="close" label="Close" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[13px] font-medium text-ink">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:outline-2 focus:outline-offset-0 focus:outline-accent/20'
