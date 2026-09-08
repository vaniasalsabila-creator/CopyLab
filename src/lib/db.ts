import { supabase } from './supabaseClient'
import type { CopyFields, Folder, Option, Project, Variation } from '../types'

type FolderRow = { id: string; user_id: string; name: string; created_at: number }
type ProjectRow = {
  id: string
  user_id: string
  folder_id: string
  name: string
  description: string
  created_at: number
  updated_at: number
}
type VariationRow = { id: string; user_id: string; project_id: string; name: string; description: string; created_at: number }
type OptionRow = { id: string; user_id: string; variation_id: string; name: string; created_at: number; copy: CopyFields }
type UserSettingsRow = {
  user_id: string
  favorites: string[]
  recent: string[]
  sidebar_collapsed: boolean
  theme: string
}

function folderFromRow(r: FolderRow): Folder {
  return { id: r.id, name: r.name, createdAt: r.created_at }
}
function folderToRow(f: Folder, userId: string): FolderRow {
  return { id: f.id, user_id: userId, name: f.name, created_at: f.createdAt }
}

function projectFromRow(r: ProjectRow): Project {
  return { id: r.id, name: r.name, description: r.description, folderId: r.folder_id, createdAt: r.created_at, updatedAt: r.updated_at }
}
function projectToRow(p: Project, userId: string): ProjectRow {
  return {
    id: p.id,
    user_id: userId,
    folder_id: p.folderId,
    name: p.name,
    description: p.description,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }
}

function variationFromRow(r: VariationRow): Variation {
  return { id: r.id, projectId: r.project_id, name: r.name, description: r.description, createdAt: r.created_at }
}
function variationToRow(v: Variation, userId: string): VariationRow {
  return { id: v.id, user_id: userId, project_id: v.projectId, name: v.name, description: v.description, created_at: v.createdAt }
}

function optionFromRow(r: OptionRow): Option {
  return { id: r.id, variationId: r.variation_id, name: r.name, createdAt: r.created_at, copy: r.copy }
}
function optionToRow(o: Option, userId: string): OptionRow {
  return { id: o.id, user_id: userId, variation_id: o.variationId, name: o.name, created_at: o.createdAt, copy: o.copy }
}

export type WorkspaceSettings = { favorites: string[]; recent: string[]; sidebarCollapsed: boolean; theme: 'light' | 'dark' }

export type Workspace = {
  folders: Folder[]
  projects: Project[]
  variations: Variation[]
  options: Option[]
  settings: WorkspaceSettings | null
}

function logError(action: string, error: { message: string } | null) {
  if (error) console.error(`[supabase] ${action} failed:`, error.message)
  return error
}

export async function fetchWorkspace(userId: string): Promise<Workspace> {
  const [foldersRes, projectsRes, variationsRes, optionsRes, settingsRes] = await Promise.all([
    supabase.from('folders').select('*').eq('user_id', userId),
    supabase.from('projects').select('*').eq('user_id', userId),
    supabase.from('variations').select('*').eq('user_id', userId),
    supabase.from('options').select('*').eq('user_id', userId),
    supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
  ])
  logError('fetch folders', foldersRes.error)
  logError('fetch projects', projectsRes.error)
  logError('fetch variations', variationsRes.error)
  logError('fetch options', optionsRes.error)
  logError('fetch user_settings', settingsRes.error)

  const settingsRow = settingsRes.data as UserSettingsRow | null
  return {
    folders: (foldersRes.data as FolderRow[] | null)?.map(folderFromRow) ?? [],
    projects: (projectsRes.data as ProjectRow[] | null)?.map(projectFromRow) ?? [],
    variations: (variationsRes.data as VariationRow[] | null)?.map(variationFromRow) ?? [],
    options: (optionsRes.data as OptionRow[] | null)?.map(optionFromRow) ?? [],
    settings: settingsRow
      ? {
          favorites: settingsRow.favorites ?? [],
          recent: settingsRow.recent ?? [],
          sidebarCollapsed: settingsRow.sidebar_collapsed ?? false,
          theme: settingsRow.theme === 'dark' ? 'dark' : 'light',
        }
      : null,
  }
}

/**
 * Atomically claims "this user has never been seeded before" using a plain insert
 * (not upsert) on user_settings, whose user_id is a primary key — Postgres itself
 * rejects a second concurrent claim, so this is safe even if two seed attempts race
 * (e.g. a duplicate effect run), unlike a client-side "check then insert" which has
 * a time-of-check/time-of-use gap.
 */
export async function claimNewUser(userId: string, settings: WorkspaceSettings): Promise<boolean> {
  const { error } = await supabase.from('user_settings').insert({
    user_id: userId,
    favorites: settings.favorites,
    recent: settings.recent,
    sidebar_collapsed: settings.sidebarCollapsed,
    theme: settings.theme,
  })
  if (!error) return true
  if (error.code === '23505') return false // unique_violation — someone else already claimed it
  logError('claim new user', error)
  return false
}

export async function insertSeedEntities(userId: string, workspace: Omit<Workspace, 'settings'>) {
  const { folders, projects, variations, options } = workspace
  if (folders.length) logError('seed folders', (await supabase.from('folders').insert(folders.map((f) => folderToRow(f, userId)))).error)
  if (projects.length) logError('seed projects', (await supabase.from('projects').insert(projects.map((p) => projectToRow(p, userId)))).error)
  if (variations.length)
    logError('seed variations', (await supabase.from('variations').insert(variations.map((v) => variationToRow(v, userId)))).error)
  if (options.length) logError('seed options', (await supabase.from('options').insert(options.map((o) => optionToRow(o, userId)))).error)
}

export const db = {
  insertFolder: async (f: Folder, userId: string) => logError('insert folder', (await supabase.from('folders').insert(folderToRow(f, userId))).error),
  updateFolder: async (id: string, patch: Partial<Pick<Folder, 'name'>>) =>
    logError('update folder', (await supabase.from('folders').update(patch).eq('id', id)).error),
  deleteFolder: async (id: string) => logError('delete folder', (await supabase.from('folders').delete().eq('id', id)).error),

  insertProject: async (p: Project, userId: string) =>
    logError('insert project', (await supabase.from('projects').insert(projectToRow(p, userId))).error),
  updateProject: async (id: string, patch: Partial<Pick<Project, 'name' | 'description' | 'folderId' | 'updatedAt'>>) =>
    logError(
      'update project',
      (
        await supabase
          .from('projects')
          .update({
            ...(patch.name !== undefined ? { name: patch.name } : {}),
            ...(patch.description !== undefined ? { description: patch.description } : {}),
            ...(patch.folderId !== undefined ? { folder_id: patch.folderId } : {}),
            ...(patch.updatedAt !== undefined ? { updated_at: patch.updatedAt } : {}),
          })
          .eq('id', id)
      ).error,
    ),
  deleteProject: async (id: string) => logError('delete project', (await supabase.from('projects').delete().eq('id', id)).error),

  insertVariation: async (v: Variation, userId: string) =>
    logError('insert variation', (await supabase.from('variations').insert(variationToRow(v, userId))).error),
  updateVariation: async (id: string, patch: Partial<Pick<Variation, 'name' | 'description'>>) =>
    logError('update variation', (await supabase.from('variations').update(patch).eq('id', id)).error),
  deleteVariation: async (id: string) => logError('delete variation', (await supabase.from('variations').delete().eq('id', id)).error),

  insertOption: async (o: Option, userId: string) =>
    logError('insert option', (await supabase.from('options').insert(optionToRow(o, userId))).error),
  updateOption: async (id: string, patch: Partial<Pick<Option, 'name' | 'copy' | 'variationId'>>) =>
    logError(
      'update option',
      (
        await supabase
          .from('options')
          .update({
            ...(patch.name !== undefined ? { name: patch.name } : {}),
            ...(patch.copy !== undefined ? { copy: patch.copy } : {}),
            ...(patch.variationId !== undefined ? { variation_id: patch.variationId } : {}),
          })
          .eq('id', id)
      ).error,
    ),
  deleteOption: async (id: string) => logError('delete option', (await supabase.from('options').delete().eq('id', id)).error),

  upsertSettings: async (userId: string, settings: WorkspaceSettings) =>
    logError(
      'upsert user_settings',
      (
        await supabase.from('user_settings').upsert({
          user_id: userId,
          favorites: settings.favorites,
          recent: settings.recent,
          sidebar_collapsed: settings.sidebarCollapsed,
          theme: settings.theme,
        })
      ).error,
    ),
}
