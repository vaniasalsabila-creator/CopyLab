import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useStore } from '../store'
import { Button, Field, inputClass } from './ui'
import { Icon, Logo } from './icons'

type Mode = 'sign-in' | 'sign-up'

const FEATURES = [
  { title: 'Draft variations side by side', desc: 'Write and iterate on multiple copy options in one view.' },
  { title: 'Compare tone, length, and CTAs', desc: 'See what changes between versions at a glance.' },
  { title: 'Keep your team in sync', desc: 'Every project and edit is saved to your workspace automatically.' },
]

export function Login() {
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const [mode, setMode] = useState<Mode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="relative flex h-full min-h-screen w-full overflow-hidden bg-canvas">
      <div className="app-texture" aria-hidden="true" />

      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-muted shadow-sm transition-all duration-150 hover:text-ink hover:shadow-md active:scale-90"
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
      </button>

      {/* Brand panel — intentionally fixed-dark regardless of app theme, like a permanent brand statement */}
      <div className="relative hidden w-[44%] shrink-0 flex-col justify-between overflow-hidden bg-[#0c0c0f] px-12 py-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(circle at 20% 15%, rgba(255,255,255,0.14), transparent 45%), radial-gradient(circle at 85% 85%, rgba(255,255,255,0.08), transparent 50%)',
          }}
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-2">
          <Logo size={30} className="!bg-white !text-[#0c0c0f]" />
          <span className="text-[16px] font-semibold">CopyLab</span>
        </div>

        <div className="relative space-y-9">
          <div className="space-y-3">
            <h2 className="max-w-sm text-[28px] font-semibold leading-tight tracking-tight">
              The workspace for sharper CRM copy.
            </h2>
            <p className="max-w-sm text-[14px] text-white/65">
              Draft, test, and compare messaging across email, push, and SMS — all in one place.
            </p>
          </div>
          <ul className="space-y-4">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon name="check" size={12} />
                </span>
                <span>
                  <span className="block text-[13.5px] font-medium">{f.title}</span>
                  <span className="block text-[13px] text-white/55">{f.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[12px] text-white/40">© {new Date().getFullYear()} CopyLab</p>
      </div>

      {/* Form panel */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[380px]">
          <div className="mb-7 flex items-center gap-2 lg:hidden">
            <Logo size={28} />
            <span className="text-[15px] font-semibold text-ink">CopyLab</span>
          </div>

          <div className="animate-card-in rounded-2xl border border-line bg-surface/90 p-7 shadow-xl shadow-black/[0.06] backdrop-blur-sm supports-[backdrop-filter]:bg-surface/80">
            {status === 'sign-up-sent' ? (
              <div className="space-y-3 py-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon name="check" size={22} />
                </div>
                <h1 className="text-[16px] font-semibold text-ink">Confirm your email</h1>
                <p className="text-sm text-ink-muted">
                  We sent a confirmation link to <span className="font-medium text-ink">{email}</span>. Click it, then come back and sign in.
                </p>
                <button
                  type="button"
                  onClick={() => switchMode('sign-in')}
                  className="text-[13px] font-medium text-accent hover:underline"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <h1 className="text-[19px] font-semibold tracking-tight text-ink">
                    {mode === 'sign-in' ? 'Welcome back' : 'Create your account'}
                  </h1>
                  <p className="mt-1 text-[13.5px] text-ink-muted">
                    {mode === 'sign-in' ? 'Sign in to continue to CopyLab.' : 'Set a password to get started.'}
                  </p>
                </div>

                <Field label="Email">
                  <div className="relative">
                    <Icon
                      name="mail"
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
                    />
                    <input
                      autoFocus
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@tiket.com"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>

                <Field label="Password">
                  <div className="relative">
                    <Icon
                      name="lock"
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                      className={`${inputClass} pl-9 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-ink-faint transition-colors hover:text-ink-muted"
                    >
                      <Icon name={showPassword ? 'eye-off' : 'eye'} size={15} />
                    </button>
                  </div>
                </Field>

                {status === 'error' && (
                  <p className="flex items-start gap-1.5 rounded-md bg-red-500/10 px-3 py-2 text-[13px] text-red-600">
                    <Icon name="alert" size={14} className="mt-0.5 shrink-0" />
                    {error}
                  </p>
                )}

                <Button type="submit" variant="primary" className="w-full" disabled={status === 'submitting'}>
                  {status === 'submitting' && (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
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
      </div>
    </div>
  )
}
