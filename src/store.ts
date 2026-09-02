import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SAMPLE_FOLDERS, SAMPLE_OPTIONS, SAMPLE_PROJECTS, SAMPLE_VARIATIONS } from './data/sample'
import { cloneCopy, emptyCopy, uid } from './lib/ids'
import type {
  Channel,
  CopyFields,
  EditorLang,
  Folder,
  Lang,
  MobileTab,
  Modal,
  Option,
  PreviewView,
  Project,
  SidebarNav,
  Theme,
  Toast,
  Variation,
} from './types'

const SAVE_DELAY = 700

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

type Store = {
  folders: Folder[]
  projects: Project[]
  variations: Variation[]
  options: Option[]
  favorites: string[]
  recent: string[]

  selectedFolderId: string | null
  selectedProjectId: string | null
  selectedVariationId: string | null
  selectedOptionId: string | null

  sidebarNav: SidebarNav
  search: string
  channel: Channel
  editorLang: EditorLang

  previewOpen: boolean
  previewOptionIds: string[]
  previewChannel: Channel
  previewLang: Lang
  previewView: PreviewView

  mobileTab: MobileTab
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  theme: Theme

  saveStatus: 'saved' | 'saving'
  lastSavedAt: number | null
  toasts: Toast[]
  modal: Modal

  setSearch: (q: string) => void
  setSidebarNav: (nav: SidebarNav) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebarCollapsed: () => void
  toggleTheme: () => void
  setChannel: (channel: Channel) => void
  setEditorLang: (lang: EditorLang) => void
  setPreviewChannel: (channel: Channel) => void
  setPreviewLang: (lang: Lang) => void
  setPreviewView: (view: PreviewView) => void
  setMobileTab: (tab: MobileTab) => void
  setModal: (modal: Modal) => void
  toast: (message: string) => void
  dismissToast: (id: string) => void

  selectFolder: (id: string | null) => void
  selectProject: (id: string | null) => void
  selectVariation: (id: string) => void
  selectOption: (id: string) => void

  createFolder: (name: string) => string
  renameFolder: (id: string, name: string) => void
  deleteFolder: (id: string) => void

  createProject: (input: { name: string; description: string; folderId: string }) => string
  renameProject: (id: string, name: string, description?: string) => void
  moveProject: (id: string, folderId: string) => void
  duplicateProject: (id: string) => string
  deleteProject: (id: string) => void
  toggleFavorite: (id: string) => void

  createVariation: (name: string, description: string) => string
  renameVariation: (id: string, name: string, description?: string) => void
  duplicateVariation: (id: string) => string
  deleteVariation: (id: string) => void

  createOption: (name: string) => string
  renameOption: (id: string, name: string) => void
  duplicateOption: (id: string) => string
  moveOption: (id: string, variationId: string) => void
  deleteOption: (id: string) => void

  updateCopy: (optionId: string, updater: (copy: CopyFields) => CopyFields) => void
  touchSave: () => void

  openPreview: (optionIds?: string[]) => void
  closePreview: () => void
  togglePreviewOption: (id: string) => void
}

let saveTimer: ReturnType<typeof setTimeout> | undefined

function touchProject(projects: Project[], id: string | null): Project[] {
  if (!id) return projects
  const now = Date.now()
  return projects.map((p) => (p.id === id ? { ...p, updatedAt: now } : p))
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      folders: SAMPLE_FOLDERS,
      projects: SAMPLE_PROJECTS,
      variations: SAMPLE_VARIATIONS,
      options: SAMPLE_OPTIONS,
      favorites: ['project-segment-11'],
      recent: ['project-segment-11', 'project-flight-retarget'],

      selectedFolderId: 'folder-insurance',
      selectedProjectId: 'project-segment-11',
      selectedVariationId: 'var-benefit',
      selectedOptionId: 'opt-bh-1',

      sidebarNav: 'all',
      search: '',
      channel: 'whatsapp',
      editorLang: 'both',

      previewOpen: false,
      previewOptionIds: [],
      previewChannel: 'whatsapp',
      previewLang: 'en',
      previewView: 'preview',

      mobileTab: 'edit',
      sidebarOpen: false,
      sidebarCollapsed: false,
      theme: getInitialTheme(),

      saveStatus: 'saved',
      lastSavedAt: Date.now(),
      toasts: [],
      modal: null,

      setSearch: (search) => set({ search }),
      setSidebarNav: (sidebarNav) =>
        set({
          sidebarNav,
          selectedFolderId: null,
          selectedProjectId: null,
          selectedVariationId: null,
          selectedOptionId: null,
          previewOpen: false,
          sidebarOpen: false,
        }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setChannel: (channel) => set({ channel }),
      setEditorLang: (editorLang) => set({ editorLang }),
      setPreviewChannel: (previewChannel) => set({ previewChannel }),
      setPreviewLang: (previewLang) => set({ previewLang }),
      setPreviewView: (previewView) => set({ previewView }),
      setMobileTab: (mobileTab) => set({ mobileTab }),
      setModal: (modal) => set({ modal }),

      toast: (message) => {
        const id = uid()
        set((s) => ({ toasts: [...s.toasts, { id, message }] }))
        window.setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
        }, 2200)
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      selectFolder: (id) =>
        set({
          selectedFolderId: id,
          selectedProjectId: null,
          selectedVariationId: null,
          selectedOptionId: null,
          sidebarNav: 'all',
          previewOpen: false,
          sidebarOpen: false,
        }),

      selectProject: (id) => {
        if (!id) {
          set({ selectedProjectId: null, selectedVariationId: null, selectedOptionId: null, previewOpen: false })
          return
        }
        const { variations, options, projects, recent } = get()
        const vars = variations.filter((v) => v.projectId === id)
        const firstVar = vars[0]
        const firstOpt = firstVar ? options.find((o) => o.variationId === firstVar.id) : undefined
        const project = projects.find((p) => p.id === id)
        set({
          selectedProjectId: id,
          selectedFolderId: project?.folderId ?? get().selectedFolderId,
          selectedVariationId: firstVar?.id ?? null,
          selectedOptionId: firstOpt?.id ?? null,
          recent: [id, ...recent.filter((r) => r !== id)].slice(0, 12),
          previewOpen: false,
          sidebarOpen: false,
          mobileTab: 'edit',
        })
      },

      selectVariation: (id) => {
        const opts = get().options.filter((o) => o.variationId === id)
        set({ selectedVariationId: id, selectedOptionId: opts[0]?.id ?? null, previewOpen: false })
      },

      selectOption: (id) => set({ selectedOptionId: id }),

      createFolder: (name) => {
        const folder: Folder = { id: uid(), name: name.trim(), createdAt: Date.now() }
        set((s) => ({ folders: [...s.folders, folder], selectedFolderId: folder.id, sidebarNav: 'all' }))
        get().touchSave()
        get().toast('Folder created')
        return folder.id
      },

      renameFolder: (id, name) => {
        set((s) => ({ folders: s.folders.map((f) => (f.id === id ? { ...f, name: name.trim() } : f)) }))
        get().touchSave()
      },

      deleteFolder: (id) => {
        const { projects } = get()
        const projectIds = new Set(projects.filter((p) => p.folderId === id).map((p) => p.id))
        set((s) => ({
          folders: s.folders.filter((f) => f.id !== id),
          projects: s.projects.filter((p) => p.folderId !== id),
          variations: s.variations.filter((v) => !projectIds.has(v.projectId)),
          options: s.options.filter((o) => {
            const v = s.variations.find((x) => x.id === o.variationId)
            return v ? !projectIds.has(v.projectId) : false
          }),
          selectedFolderId: s.selectedFolderId === id ? null : s.selectedFolderId,
          selectedProjectId: s.selectedProjectId && projectIds.has(s.selectedProjectId) ? null : s.selectedProjectId,
        }))
        get().touchSave()
      },

      createProject: ({ name, description, folderId }) => {
        const now = Date.now()
        const project: Project = { id: uid(), name: name.trim(), description: description.trim(), folderId, createdAt: now, updatedAt: now }
        const variation: Variation = { id: uid(), projectId: project.id, name: 'Control', description: '', createdAt: now }
        const option: Option = { id: uid(), variationId: variation.id, name: 'Option 1', createdAt: now, copy: emptyCopy() }
        set((s) => ({
          projects: [...s.projects, project],
          variations: [...s.variations, variation],
          options: [...s.options, option],
          selectedFolderId: folderId,
          selectedProjectId: project.id,
          selectedVariationId: variation.id,
          selectedOptionId: option.id,
          recent: [project.id, ...s.recent].slice(0, 12),
        }))
        get().touchSave()
        get().toast('Project created')
        return project.id
      },

      renameProject: (id, name, description) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? { ...p, name: name.trim(), description: description !== undefined ? description.trim() : p.description, updatedAt: Date.now() }
              : p,
          ),
        }))
        get().touchSave()
      },

      moveProject: (id, folderId) => {
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, folderId, updatedAt: Date.now() } : p)),
          selectedFolderId: folderId,
        }))
        get().touchSave()
        get().toast('Project moved')
      },

      duplicateProject: (id) => {
        const { projects, variations, options } = get()
        const source = projects.find((p) => p.id === id)
        if (!source) return id
        const now = Date.now()
        const project: Project = { ...source, id: uid(), name: `${source.name} (copy)`, createdAt: now, updatedAt: now }
        const varMap = new Map<string, string>()
        const newVars: Variation[] = variations
          .filter((v) => v.projectId === id)
          .map((v) => {
            const nid = uid()
            varMap.set(v.id, nid)
            return { ...v, id: nid, projectId: project.id, createdAt: now }
          })
        const newOpts: Option[] = options
          .filter((o) => varMap.has(o.variationId))
          .map((o) => ({ ...o, id: uid(), variationId: varMap.get(o.variationId)!, createdAt: now, copy: cloneCopy(o.copy) }))
        set((s) => ({
          projects: [...s.projects, project],
          variations: [...s.variations, ...newVars],
          options: [...s.options, ...newOpts],
          selectedProjectId: project.id,
          selectedVariationId: newVars[0]?.id ?? null,
          selectedOptionId: newOpts[0]?.id ?? null,
        }))
        get().touchSave()
        get().toast('Project duplicated')
        return project.id
      },

      deleteProject: (id) => {
        set((s) => {
          const varIds = new Set(s.variations.filter((v) => v.projectId === id).map((v) => v.id))
          return {
            projects: s.projects.filter((p) => p.id !== id),
            variations: s.variations.filter((v) => v.projectId !== id),
            options: s.options.filter((o) => !varIds.has(o.variationId)),
            selectedProjectId: s.selectedProjectId === id ? null : s.selectedProjectId,
            favorites: s.favorites.filter((f) => f !== id),
            recent: s.recent.filter((r) => r !== id),
          }
        })
        get().touchSave()
        get().toast('Project deleted')
      },

      toggleFavorite: (id) => {
        set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] }))
      },

      createVariation: (name, description) => {
        const projectId = get().selectedProjectId
        if (!projectId) return ''
        const now = Date.now()
        const variation: Variation = { id: uid(), projectId, name: name.trim() || 'New variation', description: description.trim(), createdAt: now }
        const option: Option = { id: uid(), variationId: variation.id, name: 'Option 1', createdAt: now, copy: emptyCopy() }
        set((s) => ({
          variations: [...s.variations, variation],
          options: [...s.options, option],
          selectedVariationId: variation.id,
          selectedOptionId: option.id,
          projects: touchProject(s.projects, projectId),
        }))
        get().touchSave()
        return variation.id
      },

      renameVariation: (id, name, description) => {
        set((s) => ({
          variations: s.variations.map((v) =>
            v.id === id ? { ...v, name: name.trim(), description: description !== undefined ? description.trim() : v.description } : v,
          ),
          projects: touchProject(s.projects, s.selectedProjectId),
        }))
        get().touchSave()
      },

      duplicateVariation: (id) => {
        const { variations, options, selectedProjectId } = get()
        const source = variations.find((v) => v.id === id)
        if (!source) return id
        const now = Date.now()
        const variation: Variation = { ...source, id: uid(), name: `${source.name} (copy)`, createdAt: now }
        const newOpts = options
          .filter((o) => o.variationId === id)
          .map((o) => ({ ...o, id: uid(), variationId: variation.id, createdAt: now, copy: cloneCopy(o.copy) }))
        set((s) => ({
          variations: [...s.variations, variation],
          options: [...s.options, ...newOpts],
          selectedVariationId: variation.id,
          selectedOptionId: newOpts[0]?.id ?? null,
          projects: touchProject(s.projects, selectedProjectId),
        }))
        get().touchSave()
        get().toast('Variation duplicated')
        return variation.id
      },

      deleteVariation: (id) => {
        set((s) => {
          const remaining = s.variations.filter((v) => v.id !== id && v.projectId === s.selectedProjectId)
          const next = remaining[0]
          const nextOpt = next ? s.options.find((o) => o.variationId === next.id) : undefined
          return {
            variations: s.variations.filter((v) => v.id !== id),
            options: s.options.filter((o) => o.variationId !== id),
            selectedVariationId: s.selectedVariationId === id ? (next?.id ?? null) : s.selectedVariationId,
            selectedOptionId: s.selectedVariationId === id ? (nextOpt?.id ?? null) : s.selectedOptionId,
            projects: touchProject(s.projects, s.selectedProjectId),
          }
        })
        get().touchSave()
        get().toast('Variation deleted')
      },

      createOption: (name) => {
        const variationId = get().selectedVariationId
        if (!variationId) return ''
        const option: Option = { id: uid(), variationId, name: name.trim() || 'New option', createdAt: Date.now(), copy: emptyCopy() }
        set((s) => ({ options: [...s.options, option], selectedOptionId: option.id, projects: touchProject(s.projects, s.selectedProjectId) }))
        get().touchSave()
        return option.id
      },

      renameOption: (id, name) => {
        set((s) => ({
          options: s.options.map((o) => (o.id === id ? { ...o, name: name.trim() } : o)),
          projects: touchProject(s.projects, s.selectedProjectId),
        }))
        get().touchSave()
      },

      duplicateOption: (id) => {
        const source = get().options.find((o) => o.id === id)
        if (!source) return id
        const option: Option = { ...source, id: uid(), name: `${source.name} (copy)`, createdAt: Date.now(), copy: cloneCopy(source.copy) }
        set((s) => ({ options: [...s.options, option], selectedOptionId: option.id, projects: touchProject(s.projects, s.selectedProjectId) }))
        get().touchSave()
        get().toast('Option duplicated')
        return option.id
      },

      moveOption: (id, variationId) => {
        set((s) => ({
          options: s.options.map((o) => (o.id === id ? { ...o, variationId } : o)),
          selectedVariationId: variationId,
          selectedOptionId: id,
          projects: touchProject(s.projects, s.selectedProjectId),
        }))
        get().touchSave()
        get().toast('Option moved')
      },

      deleteOption: (id) => {
        set((s) => {
          const target = s.options.find((o) => o.id === id)
          const remaining = s.options.filter((o) => o.id !== id && o.variationId === target?.variationId)
          return {
            options: s.options.filter((o) => o.id !== id),
            selectedOptionId: s.selectedOptionId === id ? (remaining[0]?.id ?? null) : s.selectedOptionId,
            previewOptionIds: s.previewOptionIds.filter((x) => x !== id),
            projects: touchProject(s.projects, s.selectedProjectId),
          }
        })
        get().touchSave()
        get().toast('Option deleted')
      },

      updateCopy: (optionId, updater) => {
        set((s) => ({
          options: s.options.map((o) => (o.id === optionId ? { ...o, copy: updater(o.copy) } : o)),
          projects: touchProject(s.projects, s.selectedProjectId),
          saveStatus: 'saving',
        }))
        get().touchSave()
      },

      touchSave: () => {
        set({ saveStatus: 'saving' })
        if (saveTimer) clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
          set({ saveStatus: 'saved', lastSavedAt: Date.now() })
        }, SAVE_DELAY)
      },

      openPreview: (optionIds) => {
        const { selectedVariationId, options, channel, editorLang } = get()
        const ids = optionIds ?? options.filter((o) => o.variationId === selectedVariationId).map((o) => o.id)
        set({
          previewOpen: true,
          previewOptionIds: ids,
          previewView: 'preview',
          previewChannel: channel,
          previewLang: editorLang === 'id' ? 'id' : 'en',
          mobileTab: 'preview',
        })
      },

      closePreview: () => set({ previewOpen: false, mobileTab: 'edit' }),

      togglePreviewOption: (id) =>
        set((s) => ({
          previewOptionIds: s.previewOptionIds.includes(id) ? s.previewOptionIds.filter((x) => x !== id) : [...s.previewOptionIds, id],
        })),
    }),
    {
      name: 'copylab-workspace',
      partialize: (s) => ({
        folders: s.folders,
        projects: s.projects,
        variations: s.variations,
        options: s.options,
        favorites: s.favorites,
        recent: s.recent,
        selectedFolderId: s.selectedFolderId,
        selectedProjectId: s.selectedProjectId,
        selectedVariationId: s.selectedVariationId,
        selectedOptionId: s.selectedOptionId,
        lastSavedAt: s.lastSavedAt,
        sidebarCollapsed: s.sidebarCollapsed,
        theme: s.theme,
      }),
    },
  ),
)
