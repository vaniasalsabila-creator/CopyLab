import { useMemo } from 'react'
import { useStore } from '../store'
import { formatDate } from '../lib/time'
import { Icon } from './icons'
import { Button, EmptyState, OverflowMenu } from './ui'
import type { Project } from '../types'

export function ProjectList() {
  const folders = useStore((s) => s.folders)
  const projects = useStore((s) => s.projects)
  const selectedFolderId = useStore((s) => s.selectedFolderId)
  const sidebarNav = useStore((s) => s.sidebarNav)
  const favorites = useStore((s) => s.favorites)
  const recent = useStore((s) => s.recent)
  const search = useStore((s) => s.search)
  const setModal = useStore((s) => s.setModal)

  const q = search.trim().toLowerCase()

  const { title, description, list } = useMemo(() => {
    let list = projects
    let title = 'All Projects'
    let description = 'Every copy testing project in your workspace.'

    if (selectedFolderId) {
      const folder = folders.find((f) => f.id === selectedFolderId)
      list = projects.filter((p) => p.folderId === selectedFolderId)
      title = folder?.name ?? 'Folder'
      description = `Projects inside ${folder?.name ?? 'this folder'}.`
    } else if (sidebarNav === 'recent') {
      list = recent.map((id) => projects.find((p) => p.id === id)).filter((p): p is Project => Boolean(p))
      title = 'Recent'
      description = 'Projects you opened most recently.'
    } else if (sidebarNav === 'favorites') {
      list = projects.filter((p) => favorites.includes(p.id))
      title = 'Favorites'
      description = 'Projects you starred for quick access.'
    }

    if (q) {
      list = list.filter((p) => {
        const folder = folders.find((f) => f.id === p.folderId)
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (folder?.name.toLowerCase().includes(q) ?? false)
        )
      })
    }

    return { title, description, list }
  }, [projects, folders, selectedFolderId, sidebarNav, favorites, recent, q])

  if (folders.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <EmptyState
          icon="folder"
          title="Create your first folder"
          description="Organize your copy projects into folders."
          action={
            <Button variant="primary" icon="plus" onClick={() => setModal({ type: 'folder-create' })}>
              New Folder
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 lg:px-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-1 text-sm text-ink-muted">{description}</p>
        </div>
        <Button variant="primary" icon="plus" onClick={() => setModal({ type: 'project-create', folderId: selectedFolderId ?? undefined })}>
          New Project
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line-strong">
          <EmptyState
            icon="file"
            title={q ? 'No matching projects' : 'No projects yet'}
            description={q ? 'Try a different search term.' : 'Create a project to start writing and testing your copy.'}
            action={
              !q ? (
                <Button variant="primary" icon="plus" onClick={() => setModal({ type: 'project-create', folderId: selectedFolderId ?? undefined })}>
                  New Project
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <ul className="space-y-2.5">
          {list.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const folder = useStore((s) => s.folders.find((f) => f.id === project.folderId))
  const favorites = useStore((s) => s.favorites)
  const selectProject = useStore((s) => s.selectProject)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const setModal = useStore((s) => s.setModal)
  const duplicateProject = useStore((s) => s.duplicateProject)
  const isFavorite = favorites.includes(project.id)

  return (
    <li className="group relative rounded-xl border border-line bg-surface transition-all duration-150 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md hover:shadow-black/[0.04]">
      <button onClick={() => selectProject(project.id)} className="block w-full px-4 py-3.5 pr-24 text-left">
        <div className="mb-1 flex items-center gap-2 text-xs text-ink-faint">
          {folder && (
            <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5">
              <Icon name="folder" size={10} />
              {folder.name}
            </span>
          )}
        </div>
        <h2 className="truncate text-[15px] font-semibold text-ink">{project.name}</h2>
        <p className="mt-0.5 truncate text-sm text-ink-muted">{project.description}</p>
        <p className="mt-2 text-xs text-ink-faint">Updated {formatDate(project.updatedAt)}</p>
      </button>
      <div className="absolute right-3 top-3.5 flex items-center gap-0.5">
        <button
          onClick={() => toggleFavorite(project.id)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150 hover:bg-surface-3 active:scale-90 ${isFavorite ? 'text-amber-500' : 'text-ink-faint'}`}
        >
          <Icon name={isFavorite ? 'star-filled' : 'star'} size={15} />
        </button>
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
                  onConfirm: () => useStore.getState().deleteProject(project.id),
                }),
            },
          ]}
        />
      </div>
    </li>
  )
}
