import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/router/routePaths'
import { AuthCard } from '@/shared/ui/AuthCard'
import { FormField } from '@/shared/ui/FormField'
import { useAuth } from '../state/useAuth'
import { GoogleSignIn } from '../components/GoogleSignIn'

/** Đăng nhập bằng username + password (Project.docx §4.3). */
export function LoginPage() {
  const { login, notice } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', password: '' })
  const [status, setStatus] = useState({ loading: false, error: '' })

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })
    try {
      const session = await login(form)
      const requested = location.state?.from
      navigate(
        session.role === 'ROLE_ADMIN'
          ? typeof requested === 'string' && /^\/admin(?:\/|$)/.test(requested)
            ? requested
            : ROUTES.ADMIN
          : ROUTES.PLAY,
        { replace: true },
      )
    } catch (error) {
      setStatus({ loading: false, error: error.message })
    }
  }

  return (
    <AuthCard title="The Unspoken" subtitle="Psychological Detective Game">
      {notice && (
        <p role="status" className="mb-4 text-sm text-amber-300">
          {notice}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          id="username"
          name="username"
          label="Tên đăng nhập"
          value={form.username}
          onChange={updateField}
          autoComplete="username"
          required
        />
        <FormField
          id="password"
          name="password"
          type="password"
          label="Mật khẩu"
          value={form.password}
          onChange={updateField}
          autoComplete="current-password"
          required
        />
        <button
          type="submit"
          disabled={status.loading}
          className="rounded bg-amber-500 px-4 py-2 font-medium text-stone-950 hover:bg-amber-400 disabled:opacity-60"
        >
          {status.loading ? 'Đang kết nối…' : 'Đăng nhập'}
        </button>
        {status.error && (
          <p role="alert" className="text-sm text-red-400">
            {status.error}
          </p>
        )}
      </form>
      <Link
        to={ROUTES.FORGOT_PASSWORD}
        className="mt-4 inline-block text-sm text-amber-400 hover:underline"
      >
        Quên mật khẩu?
      </Link>
      <GoogleSignIn
        onSuccess={(session) =>
          navigate(session.role === 'ROLE_ADMIN' ? ROUTES.ADMIN : ROUTES.PLAY, { replace: true })
        }
      />
      <p className="mt-6 text-sm text-stone-400">
        Chưa có tài khoản?{' '}
        <Link to={ROUTES.REGISTER} className="text-amber-400 hover:underline">
          Đăng ký
        </Link>
      </p>
    </AuthCard>
  )
}
