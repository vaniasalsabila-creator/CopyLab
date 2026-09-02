import { useMemo } from 'react'
import { useStore } from '../store'
import { Icon } from './icons'
import { OverflowMenu } from './ui'
import type { SidebarNav } from '../types'

const NAV_ITEMS: { id: SidebarNav; label: string; icon: 'layers' | 'clock' | 'star' }[] = [
  { id: 'all', label: 'All Projects', icon: 'layers' },
  { id: 'recent', label: 'Recent', icon: 'clock' },
  { id: 'favorites', label: 'Favorites', icon: 'star' },
]

export function Sidebar() {
  const sidebarOpen = useStore((s) => s.sidebarOpen)
  const setSidebarOpen = useStore((s) => s.setSidebarOpen)
  const collapsed = useStore((s) => s.sidebarCollapsed)

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 animate-overlay-in lg:hidden"
          style={{ background: 'var(--overlay)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col border-r border-line bg-surface transition-transform lg:static lg:z-auto lg:translate-x-0 lg:rounded-2xl lg:border lg:shadow-sm lg:shadow-black/[0.02] lg:transition-[width] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-[68px]' : 'lg:w-[240px]'}`}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>
    </>
  )
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const search = useStore((s) => s.search)
  const setSearch = useStore((s) => s.setSearch)
  const sidebarNav = useStore((s) => s.sidebarNav)
  const setSidebarNav = useStore((s) => s.setSidebarNav)
  const setSidebarOpen = useStore((s) => s.setSidebarOpen)
  const toggleSidebarCollapsed = useStore((s) => s.toggleSidebarCollapsed)
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const folders = useStore((s) => s.folders)
  const projects = useStore((s) => s.projects)
  const selectedFolderId = useStore((s) => s.selectedFolderId)
  const selectFolder = useStore((s) => s.selectFolder)
  const setModal = useStore((s) => s.setModal)
  const deleteFolder = useStore((s) => s.deleteFolder)

  const q = search.trim().toLowerCase()
  const visibleFolders = useMemo(() => {
    if (!q) return folders
    return folders.filter((f) => {
      if (f.name.toLowerCase().includes(q)) return true
      return projects.some((p) => p.folderId === f.id && (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)))
    })
  }, [folders, projects, q])

  return (
    <div className={`flex h-full flex-col gap-5 overflow-y-auto overflow-x-hidden px-3.5 py-5 ${collapsed ? 'lg:px-2' : ''}`}>
      <div className={`flex items-center justify-between gap-2 px-1.5 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
        <div className={`flex min-w-0 items-center gap-2 ${collapsed ? 'lg:gap-0' : ''}`}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-btn text-[13px] font-bold text-btn-fg">
            C
          </div>
          <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
            <div className="truncate text-[14px] font-semibold leading-tight text-ink">CopyLab</div>
            <div className="truncate text-[11px] leading-tight text-ink-faint">Copy Testing Workspace</div>
          </div>
        </div>
        <button
          className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-surface-3 hover:text-ink lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      <button
        onClick={toggleSidebarCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={`hidden items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink lg:flex ${
          collapsed ? 'lg:justify-center' : ''
        }`}
      >
        <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={15} />
        <span className={collapsed ? 'lg:hidden' : ''}>Collapse</span>
      </button>

      <label className={`relative block ${collapsed ? 'lg:hidden' : ''}`}>
        <span className="sr-only">Search projects</span>
        <Icon name="search" size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Search projects..."
          className="w-full rounded-md border border-line bg-surface-2 py-1.5 pl-8 pr-2.5 text-[13px] text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:bg-surface focus:outline-2 focus:outline-offset-0 focus:outline-accent/20"
        />
      </label>

      <nav className="space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setSidebarNav(item.id)}
            title={collapsed ? item.label : undefined}
            className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
              collapsed ? 'lg:justify-center' : ''
            } ${sidebarNav === item.id && !selectedFolderId ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:bg-surface-3 hover:text-ink'}`}
          >
            <Icon name={item.icon} size={15} className="shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div>
        <div className={`mb-1.5 flex items-center justify-between px-2.5 ${collapsed ? 'lg:hidden' : ''}`}>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Folders</span>
        </div>
        <div className="space-y-0.5">
          {visibleFolders.length === 0 && (
            <p className={`px-2.5 py-1 text-[13px] text-ink-faint ${collapsed ? 'lg:hidden' : ''}`}>No folders found.</p>
          )}
          {visibleFolders.map((folder) => {
            const count = projects.filter((p) => p.folderId === folder.id).length
            const active = selectedFolderId === folder.id
            return (
              <div
                key={folder.id}
                className={`group flex items-center gap-1 rounded-md pr-1 transition-colors ${collapsed ? 'lg:pr-0' : ''} ${
                  active ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:bg-surface-3 hover:text-ink'
                }`}
              >
                <button
                  onClick={() => selectFolder(folder.id)}
                  title={collapsed ? folder.name : undefined}
                  className={`flex flex-1 items-center gap-2 py-1.5 pl-2.5 text-left text-[13px] font-medium ${
                    collapsed ? 'lg:justify-center lg:pl-0' : ''
                  }`}
                >
                  <Icon name="folder" size={15} className="shrink-0" />
                  <span className={`flex-1 truncate ${collapsed ? 'lg:hidden' : ''}`}>{folder.name}</span>
                  <span className={`text-[11px] text-ink-faint ${collapsed ? 'lg:hidden' : ''}`}>{count}</span>
                </button>
                <div className={`opacity-0 transition-opacity group-hover:opacity-100 ${collapsed ? 'lg:hidden' : ''}`}>
                  <OverflowMenu
                    items={[
                      { label: 'Rename', icon: 'pencil', onClick: () => setModal({ type: 'folder-rename', folderId: folder.id }) },
                      {
                        label: 'Delete',
                        icon: 'trash',
                        danger: true,
                        onClick: () =>
                          setModal({
                            type: 'confirm-delete',
                            title: 'Delete folder?',
                            body: `"${folder.name}" and all ${count} project${count === 1 ? '' : 's'} inside it will be permanently deleted.`,
                            onConfirm: () => deleteFolder(folder.id),
                          }),
                      },
                    ]}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <button
          onClick={() => setModal({ type: 'folder-create' })}
          title={collapsed ? 'New Folder' : undefined}
          className={`mt-1.5 flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink ${
            collapsed ? 'lg:justify-center' : ''
          }`}
        >
          <Icon name="plus" size={14} className="shrink-0" />
          <span className={collapsed ? 'lg:hidden' : ''}>New Folder</span>
        </button>
      </div>

      <div className={`mt-auto flex items-center gap-2 ${collapsed ? 'lg:flex-col' : ''}`}>
        <div
          className={`flex flex-1 items-center gap-2 rounded-md border border-line px-2.5 py-2 ${
            collapsed ? 'lg:flex-none lg:justify-center lg:px-0' : ''
          }`}
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[11px] font-semibold text-ink-muted">
            U
          </div>
          <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
            <div className="truncate text-[12px] font-medium text-ink">Workspace member</div>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line text-ink-muted transition-all duration-150 hover:bg-surface-3 hover:text-ink active:scale-90"
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
        </button>
      </div>
    </div>
  )
}
