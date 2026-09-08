import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'

type AuthState = {
  session: Session | null
  initialized: boolean
  init: () => void
  signOut: () => Promise<void>
}

let started = false

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  initialized: false,
  init: () => {
    if (started) return
    started = true
    supabase.auth.getSession().then(({ data }) => set({ session: data.session, initialized: true }))
    supabase.auth.onAuthStateChange((_event, session) => set({ session, initialized: true }))
  },
  signOut: async () => {
    await supabase.auth.signOut()
  },
}))
