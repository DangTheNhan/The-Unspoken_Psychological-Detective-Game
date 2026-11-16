import { useCallback, useEffect, useState } from 'react'
import { httpClient } from '@/shared/api/httpClient'
import { ENDPOINTS } from '@/shared/api/endpoints'
import { useAuth } from '@/features/auth/state/useAuth'

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
    if (
      !window.confirm(
        `Thông báo bảo trì và tự dừng game của người chơi lúc ${new Date(startsAt).toLocaleString('vi-VN')}?`,
      )
    )
      return
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const { data } = await httpClient.put(ENDPOINTS.admin.maintenance, {
        startsAt: new Date(startsAt).toISOString(),
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
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Kết nối & Bảo trì</h1>
        <button
          type="button"
          onClick={refresh}
          className="rounded border border-stone-600 px-3 py-2 text-sm"
        >
          Làm mới
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-sm text-emerald-300">
          {success}
        </p>
      )}
      <section className="rounded border border-[#5c5266] bg-[#241f2b] p-5">
        <h2 className="text-lg font-semibold">
          Người chơi đang online {online ? `· ${online.onlineCount}` : ''}
        </h2>
        <p className="mt-2 text-xs text-stone-400">
          Tự cập nhật mỗi 5 giây. Mỗi tài khoản được tính một lần; mất tín hiệu quá 60 giây sẽ rời
          danh sách.
        </p>
        {!online ? (
          <p className="mt-4 text-sm">Đang tải trạng thái…</p>
        ) : online.players.length === 0 ? (
          <p className="mt-4 text-sm text-stone-400">Chưa có người chơi đang kết nối.</p>
        ) : (
          <ul className="mt-4 divide-y divide-stone-700">
            {online.players.map((player) => (
              <li key={player.userId} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                <strong>{player.username}</strong>
                <span className="text-emerald-300">
                  {player.area === 'PLAY' ? 'Đang ở trang game' : 'Đang truy cập website'}
                </span>
                <time className="text-stone-400">
                  {new Date(player.lastSeenAt).toLocaleTimeString('vi-VN')}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="rounded border border-[#5c5266] bg-[#241f2b] p-5">
        <h2 className="text-lg font-semibold">Lịch bảo trì</h2>
        <p role="status" className="mt-3 font-medium text-amber-300">
          {maintenance.active
            ? 'Đang bảo trì'
            : maintenance.scheduled
              ? `Đã lên lịch: ${new Date(maintenance.startsAt).toLocaleString('vi-VN')}`
              : 'Hệ thống đang mở'}
        </p>
        {(maintenance.active || maintenance.scheduled) && (
          <>
            <p className="mt-2 whitespace-pre-wrap text-sm text-stone-300">{maintenance.message}</p>
            <button
              disabled={busy}
              type="button"
              onClick={end}
              className="mt-4 rounded border border-amber-400 px-4 py-2 text-sm text-amber-300 disabled:opacity-50"
            >
              {maintenance.active ? 'Kết thúc bảo trì' : 'Hủy lịch bảo trì'}
            </button>
          </>
        )}
        {!maintenance.active && (
          <form onSubmit={schedule} className="mt-5 space-y-4 border-t border-stone-700 pt-5">
            <label className="block text-sm">
              Thời điểm bắt đầu
              <input
                type="datetime-local"
                step="1"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="mt-2 block w-full rounded border border-stone-600 bg-[#17151b] p-3"
              />
            </label>
            <p className="text-xs text-stone-400">
              Nhập theo múi giờ trên máy của bạn. Người chơi nhận thông báo trước và game tự dừng
              đến khi bạn mở lại.
            </p>
            <label className="block text-sm">
              Thông báo cho người chơi
              <textarea
                rows={3}
                required
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 block w-full rounded border border-stone-600 bg-[#17151b] p-3"
              />
            </label>
            <button
              disabled={busy}
              className="rounded bg-amber-400 px-4 py-2 text-sm font-semibold text-stone-950 disabled:opacity-50"
            >
              {busy ? 'Đang lưu…' : 'Công bố lịch bảo trì'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
