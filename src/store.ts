import { create } from 'zustand'
import { createSeedWorkspace } from './data/sample'
import { cloneCopy, emptyCopy, uid } from './lib/ids'
import { db, claimNewUser, fetchWorkspace, insertSeedEntities, type WorkspaceSettings } from './lib/db'
import { useAuthStore } from './authStore'
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

function currentUserId(): string | null {
  return useAuthStore.getState().session?.user.id ?? null
}

type Store = {
  folders: Folder[]
  projects: Project[]
  variations: Variation[]
  options: Option[]
  favorites: string[]
  recent: string[]

  hydrated: boolean
  hydrating: boolean

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

  loadWorkspace: (userId: string) => Promise<void>
  resetWorkspace: () => void

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

function syncTouchProject(id: string | null) {
  if (!id) return
  const userId = currentUserId()
  if (userId) db.updateProject(id, { updatedAt: Date.now() })
}

let settingsSyncTimer: ReturnType<typeof setTimeout> | undefined
function syncSettings(s: Pick<Store, 'favorites' | 'recent' | 'sidebarCollapsed' | 'theme'>) {
  const userId = currentUserId()
  if (!userId) return
  const settings: WorkspaceSettings = {
    favorites: s.favorites,
    recent: s.recent,
    sidebarCollapsed: s.sidebarCollapsed,
    theme: s.theme,
  }
  if (settingsSyncTimer) clearTimeout(settingsSyncTimer)
  settingsSyncTimer = setTimeout(() => db.upsertSettings(userId, settings), SAVE_DELAY)
}

const pendingOptionSaves = new Map<string, ReturnType<typeof setTimeout>>()
function syncOptionCopy(optionId: string, copy: CopyFields) {
  const userId = currentUserId()
  if (!userId) return
  const existing = pendingOptionSaves.get(optionId)
  if (existing) clearTimeout(existing)
  pendingOptionSaves.set(
    optionId,
    setTimeout(() => {
      pendingOptionSaves.delete(optionId)
      db.updateOption(optionId, { copy })
    }, SAVE_DELAY),
  )
}

export const useStore = create<Store>()((set, get) => ({
  folders: [],
  projects: [],
  variations: [],
  options: [],
  favorites: [],
  recent: [],

  hydrated: false,
  hydrating: false,

  selectedFolderId: null,
  selectedProjectId: null,
  selectedVariationId: null,
  selectedOptionId: null,

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

  loadWorkspace: async (userId) => {
    if (get().hydrating) return
    set({ hydrating: true })
    const workspace = await fetchWorkspace(userId)

    let folders = workspace.folders
    let projects = workspace.projects
    let variations = workspace.variations
    let options = workspace.options
    let settings: WorkspaceSettings | null = workspace.settings

    if (!settings) {
      // No settings row yet could mean either a brand-new account, or a concurrent
      // load already in flight for it — claimNewUser uses an atomic DB insert to
      // decide which, so at most one caller ever seeds the starter content.
      const seed = createSeedWorkspace()
      const starterSettings: WorkspaceSettings = {
        favorites: seed.projects[0] ? [seed.projects[0].id] : [],
        recent: seed.projects.slice(0, 2).map((p) => p.id),
        sidebarCollapsed: false,
        theme: getInitialTheme(),
      }
      const claimed = await claimNewUser(userId, starterSettings)
      if (claimed) {
        await insertSeedEntities(userId, seed)
        folders = seed.folders
        projects = seed.projects
        variations = seed.variations
        options = seed.options
        settings = starterSettings
      } else {
        // Another concurrent call already seeded this account — re-fetch its result.
        const fresh = await fetchWorkspace(userId)
        folders = fresh.folders
        projects = fresh.projects
        variations = fresh.variations
        options = fresh.options
        settings = fresh.settings ?? { favorites: [], recent: [], sidebarCollapsed: false, theme: getInitialTheme() }
      }
    }

    const firstFolder = folders[0]
    const firstProject = projects.find((p) => p.id === settings.recent[0]) ?? projects[0]
    const firstVariation = firstProject ? variations.find((v) => v.projectId === firstProject.id) : undefined
    const firstOption = firstVariation ? options.find((o) => o.variationId === firstVariation.id) : undefined

    set({
      folders,
      projects,
      variations,
      options,
      favorites: settings.favorites,
      recent: settings.recent,
      sidebarCollapsed: settings.sidebarCollapsed,
      theme: settings.theme,
      selectedFolderId: firstProject?.folderId ?? firstFolder?.id ?? null,
      selectedProjectId: firstProject?.id ?? null,
      selectedVariationId: firstVariation?.id ?? null,
      selectedOptionId: firstOption?.id ?? null,
      hydrated: true,
      hydrating: false,
    })
  },

  resetWorkspace: () => {
    if (saveTimer) clearTimeout(saveTimer)
    if (settingsSyncTimer) clearTimeout(settingsSyncTimer)
    pendingOptionSaves.forEach((t) => clearTimeout(t))
    pendingOptionSaves.clear()
    set({
      folders: [],
      projects: [],
      variations: [],
      options: [],
      favorites: [],
      recent: [],
      selectedFolderId: null,
      selectedProjectId: null,
      selectedVariationId: null,
      selectedOptionId: null,
      hydrated: false,
      hydrating: false,
    })
  },

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
  toggleSidebarCollapsed: () =>
    set((s) => {
      const next = { sidebarCollapsed: !s.sidebarCollapsed }
      syncSettings({ ...s, ...next })
      return next
    }),
  toggleTheme: () =>
    set((s) => {
      const next = { theme: (s.theme === 'dark' ? 'light' : 'dark') as Theme }
      syncSettings({ ...s, ...next })
      return next
    }),
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
    const nextRecent = [id, ...recent.filter((r) => r !== id)].slice(0, 12)
    set({
      selectedProjectId: id,
      selectedFolderId: project?.folderId ?? get().selectedFolderId,
      selectedVariationId: firstVar?.id ?? null,
      selectedOptionId: firstOpt?.id ?? null,
      recent: nextRecent,
      previewOpen: false,
      sidebarOpen: false,
      mobileTab: 'edit',
    })
    syncSettings({ ...get(), recent: nextRecent })
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
    const userId = currentUserId()
    if (userId) db.insertFolder(folder, userId)
    return folder.id
  },

  renameFolder: (id, name) => {
    const trimmed = name.trim()
    set((s) => ({ folders: s.folders.map((f) => (f.id === id ? { ...f, name: trimmed } : f)) }))
    get().touchSave()
    db.updateFolder(id, { name: trimmed })
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
      favorites: s.favorites.filter((f) => !projectIds.has(f)),
      recent: s.recent.filter((r) => !projectIds.has(r)),
    }))
    get().touchSave()
    db.deleteFolder(id)
    syncSettings(get())
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
    syncSettings(get())
    const userId = currentUserId()
    if (userId) {
      void (async () => {
        await db.insertProject(project, userId)
        await db.insertVariation(variation, userId)
        await db.insertOption(option, userId)
      })()
    }
    return project.id
  },

  renameProject: (id, name, description) => {
    const trimmedName = name.trim()
    const trimmedDesc = description !== undefined ? description.trim() : undefined
    const now = Date.now()
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, name: trimmedName, description: trimmedDesc !== undefined ? trimmedDesc : p.description, updatedAt: now } : p,
      ),
    }))
    get().touchSave()
    db.updateProject(id, { name: trimmedName, ...(trimmedDesc !== undefined ? { description: trimmedDesc } : {}), updatedAt: now })
  },

  moveProject: (id, folderId) => {
    const now = Date.now()
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, folderId, updatedAt: now } : p)),
      selectedFolderId: folderId,
    }))
    get().touchSave()
    get().toast('Project moved')
    db.updateProject(id, { folderId, updatedAt: now })
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
    const userId = currentUserId()
    if (userId) {
      void (async () => {
        await db.insertProject(project, userId)
        await Promise.all(newVars.map((v) => db.insertVariation(v, userId)))
        await Promise.all(newOpts.map((o) => db.insertOption(o, userId)))
      })()
    }
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
    db.deleteProject(id)
    syncSettings(get())
  },

  toggleFavorite: (id) => {
    set((s) => {
      const next = { favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] }
      syncSettings({ ...s, ...next })
      return next
    })
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
    syncTouchProject(projectId)
    const userId = currentUserId()
    if (userId) {
      void (async () => {
        await db.insertVariation(variation, userId)
        await db.insertOption(option, userId)
      })()
    }
    return variation.id
  },

  renameVariation: (id, name, description) => {
    const trimmedName = name.trim()
    const trimmedDesc = description !== undefined ? description.trim() : undefined
    set((s) => ({
      variations: s.variations.map((v) =>
        v.id === id ? { ...v, name: trimmedName, description: trimmedDesc !== undefined ? trimmedDesc : v.description } : v,
      ),
      projects: touchProject(s.projects, s.selectedProjectId),
    }))
    get().touchSave()
    syncTouchProject(get().selectedProjectId)
    db.updateVariation(id, { name: trimmedName, ...(trimmedDesc !== undefined ? { description: trimmedDesc } : {}) })
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
    syncTouchProject(selectedProjectId)
    const userId = currentUserId()
    if (userId) {
      void (async () => {
        await db.insertVariation(variation, userId)
        await Promise.all(newOpts.map((o) => db.insertOption(o, userId)))
      })()
    }
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
    syncTouchProject(get().selectedProjectId)
    db.deleteVariation(id)
  },

  createOption: (name) => {
    const variationId = get().selectedVariationId
    if (!variationId) return ''
    const option: Option = { id: uid(), variationId, name: name.trim() || 'New option', createdAt: Date.now(), copy: emptyCopy() }
    set((s) => ({ options: [...s.options, option], selectedOptionId: option.id, projects: touchProject(s.projects, s.selectedProjectId) }))
    get().touchSave()
    syncTouchProject(get().selectedProjectId)
    const userId = currentUserId()
    if (userId) db.insertOption(option, userId)
    return option.id
  },

  renameOption: (id, name) => {
    const trimmed = name.trim()
    set((s) => ({
      options: s.options.map((o) => (o.id === id ? { ...o, name: trimmed } : o)),
      projects: touchProject(s.projects, s.selectedProjectId),
    }))
    get().touchSave()
    syncTouchProject(get().selectedProjectId)
    db.updateOption(id, { name: trimmed })
  },

  duplicateOption: (id) => {
    const source = get().options.find((o) => o.id === id)
    if (!source) return id
    const option: Option = { ...source, id: uid(), name: `${source.name} (copy)`, createdAt: Date.now(), copy: cloneCopy(source.copy) }
    set((s) => ({ options: [...s.options, option], selectedOptionId: option.id, projects: touchProject(s.projects, s.selectedProjectId) }))
    get().touchSave()
    get().toast('Option duplicated')
    syncTouchProject(get().selectedProjectId)
    const userId = currentUserId()
    if (userId) db.insertOption(option, userId)
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
    syncTouchProject(get().selectedProjectId)
    db.updateOption(id, { variationId })
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
    syncTouchProject(get().selectedProjectId)
    db.deleteOption(id)
  },

  updateCopy: (optionId, updater) => {
    let nextCopy: CopyFields | undefined
    set((s) => ({
      options: s.options.map((o) => {
        if (o.id !== optionId) return o
        nextCopy = updater(o.copy)
        return { ...o, copy: nextCopy }
      }),
      projects: touchProject(s.projects, s.selectedProjectId),
      saveStatus: 'saving',
    }))
    get().touchSave()
    syncTouchProject(get().selectedProjectId)
    if (nextCopy) syncOptionCopy(optionId, nextCopy)
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
}))
