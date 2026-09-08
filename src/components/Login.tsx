import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Button, Field, inputClass } from './ui'
import { Icon, Logo } from './icons'

type Mode = 'sign-in' | 'sign-up'

export function Login() {
  const [mode, setMode] = useState<Mode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sign-up-sent' | 'error'>('idle')
  const [error, setError] = useState('')

  function switchMode(next: Mode) {
    setMode(next)
    setStatus('idle')
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) return
    setStatus('submitting')
    setError('')

    if (mode === 'sign-in') {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) {
        setStatus('error')
        setError(error.message)
        return
      }
      // On success, the auth state listener in authStore picks up the session and the app re-renders.
    } else {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password })
      if (error) {
        setStatus('error')
        setError(error.message)
        return
      }
      if (!data.session) {
        // Email confirmation is required before the account can sign in.
        setStatus('sign-up-sent')
        return
      }
    }
  }

  return (
    <div className="flex h-full items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-[380px] rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <Logo size={28} />
          <span className="text-[15px] font-semibold text-ink">CopyLab</span>
        </div>

        {status === 'sign-up-sent' ? (
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Icon name="check" size={20} />
            </div>
            <h1 className="text-[15px] font-semibold text-ink">Confirm your email</h1>
            <p className="text-sm text-ink-muted">
              We sent a confirmation link to <span className="font-medium text-ink">{email}</span>. Click it, then come back and sign in.
            </p>
            <button type="button" onClick={() => switchMode('sign-in')} className="text-[13px] font-medium text-accent hover:underline">
              Back to sign in
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <h1 className="text-[15px] font-semibold text-ink">{mode === 'sign-in' ? 'Sign in' : 'Create an account'}</h1>
              <p className="mt-0.5 text-sm text-ink-muted">
                {mode === 'sign-in' ? 'Sign in with your email and password.' : 'Set a password to create your account.'}
              </p>
            </div>
            <Field label="Email">
              <input
                autoFocus
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@tiket.com"
                className={inputClass}
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                className={inputClass}
              />
            </Field>
            {status === 'error' && <p className="text-[13px] text-red-600">{error}</p>}
            <Button type="submit" variant="primary" className="w-full" disabled={status === 'submitting'}>
              {status === 'submitting' ? (mode === 'sign-in' ? 'Signing in…' : 'Creating account…') : mode === 'sign-in' ? 'Sign in' : 'Create account'}
            </Button>
            <p className="text-center text-[13px] text-ink-muted">
              {mode === 'sign-in' ? (
                <>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => switchMode('sign-up')} className="font-medium text-accent hover:underline">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchMode('sign-in')} className="font-medium text-accent hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
