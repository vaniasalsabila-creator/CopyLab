export type Channel = 'whatsapp' | 'push'
export type Lang = 'en' | 'id'
export type EditorLang = 'en' | 'id' | 'both'
export type PreviewView = 'preview' | 'compare'
export type SidebarNav = 'all' | 'recent' | 'favorites'
export type MobileTab = 'edit' | 'preview' | 'compare'
export type Theme = 'light' | 'dark'

export type Folder = {
  id: string
  name: string
  createdAt: number
}

export type Project = {
  id: string
  name: string
  description: string
  folderId: string
  createdAt: number
  updatedAt: number
}

export type Variation = {
  id: string
  projectId: string
  name: string
  description: string
  createdAt: number
}

export type CopyFields = {
  whatsapp: { en: string; id: string }
  push: {
    title: { en: string; id: string }
    subtitle: { en: string; id: string }
  }
}

export type Option = {
  id: string
  variationId: string
  name: string
  createdAt: number
  copy: CopyFields
}

export type Toast = {
  id: string
  message: string
}

export type Modal =
  | { type: 'folder-create' }
  | { type: 'folder-rename'; folderId: string }
  | { type: 'project-create'; folderId?: string }
  | { type: 'project-rename'; projectId: string }
  | { type: 'project-move'; projectId: string }
  | { type: 'variation-create' }
  | { type: 'variation-rename'; variationId: string }
  | { type: 'option-create' }
  | { type: 'option-rename'; optionId: string }
  | { type: 'option-move'; optionId: string }
  | { type: 'confirm-delete'; title: string; body: string; onConfirm: () => void }
  | null
