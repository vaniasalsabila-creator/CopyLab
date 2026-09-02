import { useStore } from '../store'
import { formatRelative } from '../lib/time'
import { Icon } from './icons'
import { Button, EmptyState, IconButton, OverflowMenu } from './ui'
import { VariationTabs } from './VariationTabs'
import { OptionTabs } from './OptionTabs'
import { CopyEditor } from './CopyEditor'
import { PreviewPanel } from './PreviewPanel'

export function Workspace() {
  const project = useStore((s) => s.projects.find((p) => p.id === s.selectedProjectId))
  const folder = useStore((s) => s.folders.find((f) => f.id === project?.folderId))
  const variation = useStore((s) => s.variations.find((v) => v.id === s.selectedVariationId))
  const option = useStore((s) => s.options.find((o) => o.id === s.selectedOptionId))
  const allVariations = useStore((s) => s.variations)
  const projectId = useStore((s) => s.selectedProjectId)
  const variations = allVariations.filter((v) => v.projectId === projectId)
  const favorites = useStore((s) => s.favorites)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const setModal = useStore((s) => s.setModal)
  const duplicateProject = useStore((s) => s.duplicateProject)
  const selectFolder = useStore((s) => s.selectFolder)
  const saveStatus = useStore((s) => s.saveStatus)
  const lastSavedAt = useStore((s) => s.lastSavedAt)
  const toast = useStore((s) => s.toast)

  if (!project) return null
  const isFavorite = favorites.includes(project.id)

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="border-b border-line px-6 py-4">
          <nav className="mb-2.5 flex flex-wrap items-center gap-1 text-xs text-ink-faint" aria-label="Breadcrumb">
            <button onClick={() => useStore.getState().setSidebarNav('all')} className="transition-colors hover:text-ink">
              All Projects
            </button>
            {folder && (
              <>
                <Icon name="chevron-right" size={11} />
                <button onClick={() => selectFolder(folder.id)} className="transition-colors hover:text-ink">
                  {folder.name}
                </button>
              </>
            )}
            <Icon name="chevron-right" size={11} />
            <span className="text-ink">{project.name}</span>
            {variation && (
              <>
                <Icon name="chevron-right" size={11} />
                <span className="text-ink">{variation.name}</span>
              </>
            )}
            {option && (
              <>
                <Icon name="chevron-right" size={11} />
                <span className="text-ink">{option.name}</span>
              </>
            )}
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight text-ink">{project.name}</h1>
              {project.description && <p className="mt-0.5 text-sm text-ink-muted">{project.description}</p>}
            </div>
            <div className="flex items-center gap-1">
              <span className="mr-1 hidden text-xs text-ink-faint sm:inline">
                {saveStatus === 'saving' ? 'Saving...' : lastSavedAt ? `Last saved ${formatRelative(lastSavedAt)}` : ''}
              </span>
              <IconButton
                icon={isFavorite ? 'star-filled' : 'star'}
                label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                active={isFavorite}
                onClick={() => toggleFavorite(project.id)}
              />
              <IconButton
                icon="share"
                label="Share"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href)
                    toast('Link copied ✓')
                  } catch {
                    toast('Could not copy link')
                  }
                }}
              />
              <OverflowMenu
                items={[
                  { label: 'Rename', icon: 'pencil', onClick: () => setModal({ type: 'project-rename', projectId: project.id }) },
                  { label: 'Move', icon: 'move', onClick: () => setModal({ type: 'project-move', projectId: project.id }) },
                  { label: 'Duplicate', icon: 'copy', onClick: () => duplicateProject(project.id) },
                  {
                    label: 'Delete',
                    icon: 'trash',
                    danger: true,
                    onClick: () =>
                      setModal({
                        type: 'confirm-delete',
                        title: 'Delete project?',
                        body: `"${project.name}" and everything inside it will be permanently deleted.`,
                        onConfirm: () => {
                          useStore.getState().deleteProject(project.id)
                        },
                      }),
                  },
                ]}
              />
              <Button variant="primary" size="sm" icon="save" onClick={() => useStore.getState().touchSave()}>
                Save
              </Button>
            </div>
          </div>
        </div>

        {variations.length === 0 ? (
          <EmptyState
            icon="layers"
            title="No variations yet"
            description="Add a variation to start comparing different messaging approaches."
            action={
              <Button variant="primary" icon="plus" onClick={() => setModal({ type: 'variation-create' })}>
                Add Variation
              </Button>
            }
          />
        ) : (
          <>
            <VariationTabs />
            {variation?.description && (
              <p className="border-b border-line px-6 pb-2 pt-2 text-[13px] text-ink-muted">{variation.description}</p>
            )}
            <OptionTabs />
            <CopyEditor />
          </>
        )}
      </div>
      {variations.length > 0 && <PreviewPanel />}
    </div>
  )
}
