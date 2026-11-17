import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthCard } from '@/shared/ui/AuthCard'
import { FormField } from '@/shared/ui/FormField'
import { ROUTES } from '@/app/router/routePaths'
import { httpClient } from '@/shared/api/httpClient'
import { ENDPOINTS } from '@/shared/api/endpoints'
import { useAuth } from '../state/useAuth'

export function PasswordRecoveryPage({ reset = false }) {
  const { authConfig, loadConfiguration } = useAuth()
  const [token] = useState(() => new URLSearchParams(location.hash.slice(1)).get('token') ?? '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [status, setStatus] = useState({ busy: false, message: '', error: '' })
  useEffect(() => {
    if (reset && location.hash)
      history.replaceState(history.state, '', location.pathname + location.search)
  }, [reset])
  const submit = async (event) => {
    event.preventDefault()
    if (reset && password !== confirmation) {
      setStatus({ busy: false, message: '', error: 'Hai mật khẩu chưa khớp.' })
      return
    }
    setStatus({ busy: true, message: '', error: '' })
    try {
      const { data } = await httpClient.post(
        reset ? ENDPOINTS.auth.reset : ENDPOINTS.auth.forgot,
        reset ? { token, password } : { email },
      )
      setStatus({ busy: false, message: data.message, error: '' })
      setPassword('')
      setConfirmation('')
    } catch (error) {
      setStatus({ busy: false, message: '', error: error.message })
    }
  }
  const unavailable = !reset && !authConfig?.passwordResetEnabled
  return (
    <AuthCard
      title={reset ? 'Đặt mật khẩu mới' : 'Khôi phục mật khẩu'}
      subtitle="THE UNSPOKEN · TÀI KHOẢN"
    >
      <p className="mb-5 text-sm text-stone-400">
        {reset
          ? 'Liên kết chỉ sử dụng một lần. Sau khi đổi mật khẩu, hãy đăng nhập lại trên các thiết bị.'
          : 'Nhập email đã đăng ký để nhận liên kết đặt mật khẩu mới.'}
      </p>
      {unavailable && (
        <p role="status" className="mb-4 text-sm text-amber-300">
          {authConfig
            ? 'Dịch vụ email chưa sẵn sàng trên máy chủ.'
            : 'Đang kiểm tra dịch vụ email…'}
        </p>
      )}
      {reset && !token && (
        <p role="alert" className="mb-4 text-sm text-red-300">
          Thiếu liên kết khôi phục. Hãy yêu cầu một email mới.
        </p>
      )}
      <form onSubmit={submit} className="space-y-4">
        {reset ? (
          <>
            <FormField
              id="new-password"
              type="password"
              label="Mật khẩu mới"
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FormField
              id="confirm-password"
              type="password"
              label="Nhập lại mật khẩu mới"
              autoComplete="new-password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              required
            />
            <p className="text-xs text-stone-400">Ít nhất 8 ký tự; tối đa 72 byte UTF-8.</p>
          </>
        ) : (
          <FormField
            id="recovery-email"
            type="email"
            label="Email đã đăng ký"
            maxLength={100}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        <button
          disabled={status.busy || unavailable || (reset && (!token || Boolean(status.message)))}
          className="w-full rounded bg-amber-400 px-4 py-2 font-medium text-stone-950 disabled:opacity-50"
        >
          {status.busy ? 'Đang xử lý…' : reset ? 'Lưu mật khẩu mới' : 'Gửi liên kết khôi phục'}
        </button>
      </form>
      {status.error && (
        <p role="alert" className="mt-4 text-sm text-red-300">
          {status.error}
        </p>
      )}
      {status.message && (
        <p role="status" className="mt-4 text-sm text-emerald-300">
          {status.message}
        </p>
      )}
      {unavailable && (
        <button
          type="button"
          onClick={loadConfiguration}
          className="mt-4 text-xs text-stone-400 underline"
        >
          Kiểm tra lại dịch vụ email
        </button>
      )}
      <Link to={ROUTES.LOGIN} className="mt-5 block text-sm text-amber-400 hover:underline">
        ← Quay lại đăng nhập
      </Link>
    </AuthCard>
  )
}
