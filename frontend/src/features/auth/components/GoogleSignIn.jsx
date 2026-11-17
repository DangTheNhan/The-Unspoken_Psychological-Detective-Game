import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../state/useAuth'
import { httpClient } from '@/shared/api/httpClient'
import { ENDPOINTS } from '@/shared/api/endpoints'
import { FormField } from '@/shared/ui/FormField'

let scriptPromise
function loadGoogle() {
  if (globalThis.google?.accounts?.id) return Promise.resolve(globalThis.google)
  if (!scriptPromise)
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.onload = () => resolve(globalThis.google)
      script.onerror = () => {
        script.remove()
        scriptPromise = null
        reject(new Error('Không tải được nút đăng nhập Google.'))
      }
      document.head.append(script)
    })
  return scriptPromise
}
export function GoogleSignIn({ onSuccess }) {
  const { authConfig, loginGoogle } = useAuth()
  const host = useRef(null)
  const success = useRef(onSuccess)
  useEffect(() => {
    success.current = onSuccess
  }, [onSuccess])
  const [error, setError] = useState('')
  const [pending, setPending] = useState(null)
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (!authConfig?.googleClientId) return
    let active = true
    ;(async () => {
      try {
        const [google, { data }] = await Promise.all([
          loadGoogle(),
          httpClient.post(ENDPOINTS.auth.googleChallenge),
        ])
        if (!active) return
        google.accounts.id.initialize({
          client_id: authConfig.googleClientId,
          nonce: data.nonce,
          auto_select: false,
          callback: async ({ credential }) => {
            if (!active) return
            setBusy(true)
            setError('')
            const input = { credential, nonce: data.nonce }
            try {
              success.current(await loginGoogle(input))
            } catch (err) {
              if (active) {
                setError(err.message)
                if (err.status === 409) setPending(input)
              }
            } finally {
              if (active) setBusy(false)
            }
          },
        })
        host.current.replaceChildren()
        google.accounts.id.renderButton(host.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: 280,
        })
      } catch (err) {
        if (active) setError(err.message)
      }
    })()
    return () => {
      active = false
    }
  }, [authConfig?.googleClientId, loginGoogle, attempt])
  const link = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      success.current(await loginGoogle({ ...pending, localPassword: password }))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      setPassword('')
    }
  }
  return (
    <section aria-label="Đăng nhập Google" className="mt-6 border-t border-stone-700 pt-5">
      {!authConfig ? (
        <p className="text-xs text-stone-400">Đang kiểm tra đăng nhập Google…</p>
      ) : !authConfig.googleClientId ? (
        <p className="text-xs text-stone-400">
          {authConfig.unavailable
            ? 'Chưa kết nối được máy chủ để kiểm tra Google.'
            : 'Đăng nhập Google chưa được cấu hình trên máy chủ.'}
        </p>
      ) : (
        <div ref={host} className={busy ? 'pointer-events-none opacity-50' : ''} />
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {pending && (
        <form onSubmit={link} className="mt-3 space-y-3">
          <FormField
            id="google-link-password"
            label="Mật khẩu tài khoản hiện tại"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button disabled={busy} className="rounded bg-amber-400 px-4 py-2 text-sm text-stone-950">
            Xác minh và liên kết Google
          </button>
        </form>
      )}
      {authConfig?.googleClientId && (
        <button
          type="button"
          disabled={busy}
          className="mt-3 text-xs text-stone-400 underline"
          onClick={() => {
            setPending(null)
            setError('')
            setAttempt((n) => n + 1)
          }}
        >
          Làm mới đăng nhập Google
        </button>
      )}
    </section>
  )
}
