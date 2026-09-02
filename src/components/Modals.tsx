import { useState } from 'react'
import { useStore } from '../store'
import { Button, Field, inputClass, Modal } from './ui'

export function Modals() {
  const modal = useStore((s) => s.modal)
  const setModal = useStore((s) => s.setModal)

  if (!modal) return null
  const close = () => setModal(null)

  switch (modal.type) {
    case 'folder-create':
      return <FolderForm onClose={close} />
    case 'folder-rename':
      return <FolderForm onClose={close} folderId={modal.folderId} />
    case 'project-create':
      return <ProjectForm onClose={close} defaultFolderId={modal.folderId} />
    case 'project-rename':
      return <ProjectForm onClose={close} projectId={modal.projectId} />
    case 'project-move':
      return <ProjectMoveForm onClose={close} projectId={modal.projectId} />
    case 'variation-create':
      return <VariationForm onClose={close} />
    case 'variation-rename':
      return <VariationForm onClose={close} variationId={modal.variationId} />
    case 'option-create':
      return <OptionForm onClose={close} />
    case 'option-rename':
      return <OptionForm onClose={close} optionId={modal.optionId} />
    case 'option-move':
      return <OptionMoveForm onClose={close} optionId={modal.optionId} />
    case 'confirm-delete':
      return <ConfirmDeleteForm onClose={close} title={modal.title} body={modal.body} onConfirm={modal.onConfirm} />
    default:
      return null
  }
}

function FolderForm({ onClose, folderId }: { onClose: () => void; folderId?: string }) {
  const folder = useStore((s) => s.folders.find((f) => f.id === folderId))
  const createFolder = useStore((s) => s.createFolder)
  const renameFolder = useStore((s) => s.renameFolder)
  const [name, setName] = useState(folder?.name ?? '')

  function submit() {
    if (!name.trim()) return
    if (folder) renameFolder(folder.id, name)
    else createFolder(name)
    onClose()
  }

  return (
    <Modal title={folder ? 'Rename folder' : 'New Folder'} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Field label="Folder Name">
          <input autoFocus className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Insurance" />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!name.trim()}>
            {folder ? 'Save' : 'Create Folder'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function ProjectForm({ onClose, projectId, defaultFolderId }: { onClose: () => void; projectId?: string; defaultFolderId?: string }) {
  const project = useStore((s) => s.projects.find((p) => p.id === projectId))
  const folders = useStore((s) => s.folders)
  const createProject = useStore((s) => s.createProject)
  const renameProject = useStore((s) => s.renameProject)
  const [name, setName] = useState(project?.name ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [folderId, setFolderId] = useState(project?.folderId ?? defaultFolderId ?? folders[0]?.id ?? '')

  function submit() {
    if (!name.trim() || !folderId) return
    if (project) renameProject(project.id, name, description)
    else createProject({ name, description, folderId })
    onClose()
  }

  return (
    <Modal title={project ? 'Rename project' : 'New Project'} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Field label="Project Name">
          <input
            autoFocus
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Insurance AB Testing — Segment 1.1"
          />
        </Field>
        <Field label="Description">
          <input
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Uninsured non-buyers / first timers"
          />
        </Field>
        {!project && (
          <Field label="Folder">
            <select className={inputClass} value={folderId} onChange={(e) => setFolderId(e.target.value)}>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!name.trim() || !folderId}>
            {project ? 'Save' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function ProjectMoveForm({ onClose, projectId }: { onClose: () => void; projectId: string }) {
  const project = useStore((s) => s.projects.find((p) => p.id === projectId))
  const folders = useStore((s) => s.folders)
  const moveProject = useStore((s) => s.moveProject)
  const [folderId, setFolderId] = useState(project?.folderId ?? folders[0]?.id ?? '')

  return (
    <Modal title="Move project" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!folderId) return
          moveProject(projectId, folderId)
          onClose()
        }}
      >
        <Field label="Folder">
          <select autoFocus className={inputClass} value={folderId} onChange={(e) => setFolderId(e.target.value)}>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Move
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function VariationForm({ onClose, variationId }: { onClose: () => void; variationId?: string }) {
  const variation = useStore((s) => s.variations.find((v) => v.id === variationId))
  const createVariation = useStore((s) => s.createVariation)
  const renameVariation = useStore((s) => s.renameVariation)
  const [name, setName] = useState(variation?.name ?? '')
  const [description, setDescription] = useState(variation?.description ?? '')

  function submit() {
    if (!name.trim()) return
    if (variation) renameVariation(variation.id, name, description)
    else createVariation(name, description)
    onClose()
  }

  return (
    <Modal title={variation ? 'Rename variation' : 'Add Variation'} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Field label="Name">
          <input autoFocus className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Benefit Highlight" />
        </Field>
        <Field label="Description">
          <input
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Focus on FDS benefits."
          />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!name.trim()}>
            {variation ? 'Save' : 'Add Variation'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function OptionForm({ onClose, optionId }: { onClose: () => void; optionId?: string }) {
  const option = useStore((s) => s.options.find((o) => o.id === optionId))
  const createOption = useStore((s) => s.createOption)
  const renameOption = useStore((s) => s.renameOption)
  const [name, setName] = useState(option?.name ?? '')

  function submit() {
    if (!name.trim()) return
    if (option) renameOption(option.id, name)
    else createOption(name)
    onClose()
  }

  return (
    <Modal title={option ? 'Rename option' : 'Add Option'} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Field label="Option Name">
          <input autoFocus className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Option 1 — Recommended" />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!name.trim()}>
            {option ? 'Save' : 'Add Option'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function OptionMoveForm({ onClose, optionId }: { onClose: () => void; optionId: string }) {
  const option = useStore((s) => s.options.find((o) => o.id === optionId))
  const projectId = useStore((s) => s.selectedProjectId)
  const allVariations = useStore((s) => s.variations)
  const variations = allVariations.filter((v) => v.projectId === projectId)
  const moveOption = useStore((s) => s.moveOption)
  const [variationId, setVariationId] = useState(option?.variationId ?? variations[0]?.id ?? '')

  return (
    <Modal title="Move option" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!variationId) return
          moveOption(optionId, variationId)
          onClose()
        }}
      >
        <Field label="Variation">
          <select autoFocus className={inputClass} value={variationId} onChange={(e) => setVariationId(e.target.value)}>
            {variations.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Move
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function ConfirmDeleteForm({
  onClose,
  title,
  body,
  onConfirm,
}: {
  onClose: () => void
  title: string
  body: string
  onConfirm: () => void
}) {
  return (
    <Modal title={title} onClose={onClose} width={380}>
      <p className="mb-4 text-sm text-ink-muted">{body}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger-solid"
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  )
}
