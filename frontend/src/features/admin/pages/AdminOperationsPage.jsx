import { useCallback, useEffect, useState } from 'react'
import { httpClient } from '@/shared/api/httpClient'
import { ENDPOINTS } from '@/shared/api/endpoints'
import { useAuth } from '@/features/auth/state/useAuth'
import {
  formatVietnamDateTime,
  formatVietnamTime,
  vietnamDateTimeToIso,
} from '@/shared/time/vietnamTime'

export function AdminOperationsPage() {
  const { maintenance, receiveSystem } = useAuth()
  const [online, setOnline] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState('')
  const refresh = useCallback(async () => {
    try {
      const results = await Promise.all([
        httpClient.get(ENDPOINTS.admin.online),
        httpClient.get(ENDPOINTS.admin.maintenance),
      ])
      setOnline(results[0].data)
      receiveSystem(results[1].data)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [receiveSystem])
  useEffect(() => {
    let active = true
    Promise.all([
      httpClient.get(ENDPOINTS.admin.online),
      httpClient.get(ENDPOINTS.admin.maintenance),
    ])
      .then((results) => {
        if (active) {
          setOnline(results[0].data)
          receiveSystem(results[1].data)
        }
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
    const timer = setInterval(refresh, 5000)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [refresh, receiveSystem])
  const schedule = async (event) => {
    event.preventDefault()
    const utc = vietnamDateTimeToIso(startsAt)
    if (!utc) {
      setError('Thời điểm bắt đầu không hợp lệ. Hãy nhập ngày giờ Việt Nam.')
      return
    }
    if (
      !window.confirm(
        `Thông báo bảo trì và tự dừng game của người chơi lúc ${formatVietnamDateTime(utc)} (giờ Việt Nam)?`,
      )
    )
      return
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const { data } = await httpClient.put(ENDPOINTS.admin.maintenance, {
        startsAt: utc,
        message,
      })
      receiveSystem(data)
      setSuccess('Đã công bố lịch và thông báo bảo trì.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  const end = async () => {
    if (!window.confirm('Hủy lịch hoặc kết thúc bảo trì và mở lại game cho người chơi?')) return
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const { data } = await httpClient.delete(ENDPOINTS.admin.maintenance)
      receiveSystem(data)
      setSuccess('Đã mở lại hệ thống.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="admin-page admin-operations">
      <div className="admin-page-heading flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Kết nối & Bảo trì</h1>
        <button
          type="button"
          onClick={refresh}
          className="rounded border border-[var(--admin-line)] px-3 py-2 text-sm"
        >
          Làm mới
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-[var(--admin-danger)]">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-sm text-[var(--admin-success)]">
          {success}
        </p>
      )}
      <section className="admin-panel border border-[var(--admin-line)] bg-[var(--admin-surface)] p-5">
        <h2 className="text-lg font-semibold">
          Người chơi đang online {online ? `· ${online.onlineCount}` : ''}
        </h2>
        <details className="mt-2 text-xs text-[var(--admin-muted)]">
          <summary className="cursor-pointer">Cách cập nhật trạng thái</summary>
          <p className="mt-2">
            Tự cập nhật mỗi 5 giây. Mỗi tài khoản được tính một lần; mất tín hiệu quá 60 giây sẽ rời
            danh sách.
          </p>
        </details>
        {!online ? (
          <p className="mt-4 text-sm">Đang tải trạng thái…</p>
        ) : online.players.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--admin-muted)]">Chưa có người chơi đang kết nối.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--admin-line)]">
            {online.players.map((player) => (
              <li key={player.userId} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                <strong>{player.username}</strong>
                <span className="text-[var(--admin-success)]">
                  {player.area === 'PLAY' ? 'Đang ở trang game' : 'Đang truy cập website'}
                </span>
                <time className="text-[var(--admin-muted)]">
                  {formatVietnamTime(player.lastSeenAt)} (giờ Việt Nam)
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="admin-panel border border-[var(--admin-line)] bg-[var(--admin-surface)] p-5">
        <h2 className="text-lg font-semibold">Lịch bảo trì</h2>
        <p role="status" className="mt-3 font-medium text-[var(--admin-accent)]">
          {maintenance.active
            ? 'Đang bảo trì'
            : maintenance.scheduled
              ? `Đã lên lịch: ${formatVietnamDateTime(maintenance.startsAt)} (giờ Việt Nam)`
              : 'Hệ thống đang mở'}
        </p>
        {(maintenance.active || maintenance.scheduled) && (
          <>
            <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--admin-ink)]">
              {maintenance.message}
            </p>
            <button
              disabled={busy}
              type="button"
              onClick={end}
              className="mt-4 rounded border border-[var(--admin-accent-border)] px-4 py-2 text-sm text-[var(--admin-accent)] disabled:opacity-50"
            >
              {maintenance.active ? 'Kết thúc bảo trì' : 'Hủy lịch bảo trì'}
            </button>
          </>
        )}
        {!maintenance.active && (
          <form
            onSubmit={schedule}
            className="mt-5 space-y-4 border-t border-[var(--admin-line)] pt-5"
          >
            <label className="block text-sm">
              Thời điểm bắt đầu
              <input
                type="datetime-local"
                step="1"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="mt-2 block w-full rounded border border-[var(--admin-line)] bg-[var(--admin-surface-soft)] p-3"
              />
            </label>
            <p className="text-xs text-[var(--admin-muted)]">
              Nhập theo giờ Việt Nam (UTC+7), kể cả khi máy đang dùng múi giờ khác. Người chơi nhận
              thông báo trước và game tự dừng đến khi bạn mở lại.
            </p>
            <label className="block text-sm">
              Thông báo cho người chơi
              <textarea
                rows={3}
                required
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 block w-full rounded border border-[var(--admin-line)] bg-[var(--admin-surface-soft)] p-3"
              />
            </label>
            <button
              disabled={busy}
              className="rounded bg-[var(--admin-accent)] px-4 py-2 text-sm font-semibold text-[var(--admin-on-accent)] disabled:opacity-50"
            >
              {busy ? 'Đang lưu…' : 'Công bố lịch bảo trì'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
