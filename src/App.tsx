import { useEffect } from 'react'
import { useStore } from './store'
import { Sidebar } from './components/Sidebar'
import { ProjectList } from './components/ProjectList'
import { Workspace } from './components/Workspace'
import { PreviewMode } from './components/PreviewMode'
import { Modals } from './components/Modals'
import { Toasts } from './components/Toasts'
import { Icon } from './components/icons'
import type { MobileTab } from './types'

export default function App() {
  const theme = useStore((s) => s.theme)
  const selectedProjectId = useStore((s) => s.selectedProjectId)
  const project = useStore((s) => s.projects.find((p) => p.id === s.selectedProjectId))
  const variation = useStore((s) => s.variations.find((v) => v.id === s.selectedVariationId))
  const option = useStore((s) => s.options.find((o) => o.id === s.selectedOptionId))
  const setSidebarOpen = useStore((s) => s.setSidebarOpen)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const mobileTab = useStore((s) => s.mobileTab)
  const setMobileTab = useStore((s) => s.setMobileTab)
  const previewOpen = useStore((s) => s.previewOpen)
  const previewView = useStore((s) => s.previewView)
  const setPreviewView = useStore((s) => s.setPreviewView)
  const openPreview = useStore((s) => s.openPreview)
  const closePreview = useStore((s) => s.closePreview)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  function onMobileTab(tab: MobileTab) {
    setMobileTab(tab)
    if (tab === 'edit') closePreview()
    if (tab === 'preview') {
      setPreviewView('preview')
      openPreview()
    }
    if (tab === 'compare') {
      setPreviewView('compare')
      openPreview()
    }
  }

  return (
    <div className="relative flex h-full flex-col bg-canvas">
      <div className="app-texture" aria-hidden="true" />

      <header className="relative z-10 flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Icon name="menu" size={18} />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-btn text-[11px] font-bold text-btn-fg">C</div>
            <span className="text-[14px] font-semibold text-ink">CopyLab</span>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink"
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
        </button>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 gap-4 p-4">
        <Sidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm shadow-black/[0.02]">
          {selectedProjectId && project && (
            <div className="truncate border-b border-line bg-surface-2 px-4 py-1.5 text-xs text-ink-muted lg:hidden">
              {[project.name, variation?.name, option?.name].filter(Boolean).join(' / ')}
            </div>
          )}
          {selectedProjectId && (
            <div className="flex border-b border-line lg:hidden" role="tablist" aria-label="Workspace views">
              {(
                [
                  { id: 'edit', label: 'Edit' },
                  { id: 'preview', label: 'Preview' },
                  { id: 'compare', label: 'Compare' },
                ] as const
              ).map((t) => {
                const active = t.id === 'edit' ? mobileTab === 'edit' && !previewOpen : previewOpen && previewView === t.id
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => onMobileTab(t.id)}
                    className={`flex-1 border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors ${
                      active ? 'border-accent text-ink' : 'border-transparent text-ink-muted'
                    }`}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          )}
          <main className="flex min-h-0 flex-1 overflow-hidden">
            {selectedProjectId ? <Workspace /> : <div className="w-full overflow-y-auto"><ProjectList /></div>}
          </main>
        </div>
      </div>

      <PreviewMode />
      <Modals />
      <Toasts />
    </div>
  )
}
