import { useCallback, useEffect, useState } from 'react'
import { fetchAdminBugReports, updateAdminBugStatus } from '../api/adminApi'
import { StatusBadge } from '../components/StatusBadge'
import { formatVietnamDateTime, formatVietnamTime } from '@/shared/time/vietnamTime'

const POLL_INTERVAL_MS = 5000

/**
 * Trang 3: Quản lý Phản hồi & Báo cáo lỗi Thời gian thực.
 */
export function AdminBugReportsPage() {
  const [reports, setReports] = useState([])
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [livePoll, setLivePoll] = useState(true)
  const [lastSyncedAt, setLastSyncedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState('')

  const loadReports = useCallback(async () => {
    try {
      const data = await fetchAdminBugReports(statusFilter)
      setReports(data)
      setLastSyncedAt(formatVietnamTime(Date.now()))
      setError('')
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách báo cáo lỗi.')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    let active = true
    fetchAdminBugReports(statusFilter)
      .then((data) => {
        if (!active) return
        setReports(data)
        setLastSyncedAt(formatVietnamTime(Date.now()))
        setError('')
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || 'Không thể tải danh sách báo cáo lỗi.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [statusFilter])

  useEffect(() => {
    if (!livePoll) return undefined
    const timer = setInterval(() => {
      loadReports()
    }, POLL_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [livePoll, loadReports])

  const handleToggleStatus = async (report) => {
    const nextStatus = report.status === 'PENDING' ? 'RESOLVED' : 'PENDING'
    setUpdatingId(report.id)
    setError('')
    try {
      const updated = await updateAdminBugStatus(report.id, nextStatus)
      setReports((prev) => prev.map((item) => (item.id === report.id ? updated : item)))
    } catch (err) {
      setError(err.message || 'Không thể cập nhật trạng thái báo cáo lỗi.')
    } finally {
      setUpdatingId(null)
    }
  }

  const filterLabels = {
    ALL: 'Tất cả báo cáo',
    PENDING: 'Chờ xử lý',
    RESOLVED: 'Đã khắc phục',
  }

  return (
    <div className="admin-page space-y-6">
      <div className="admin-page-heading flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--admin-accent)]">
            Hỗ trợ & Vận hành
          </span>
          <h1 className="mt-0.5 text-2xl font-bold text-[var(--admin-ink)]">
            Quản lý Phản hồi Lỗi từ Người chơi
          </h1>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setLivePoll((v) => !v)}
              aria-pressed={livePoll}
              className={`flex items-center gap-2 rounded border px-3 py-1.5 text-xs font-medium transition ${
                livePoll
                  ? 'border-[var(--admin-success-border)] bg-[var(--admin-success-wash)] text-[var(--admin-success)]'
                  : 'border-[var(--admin-line)] bg-[var(--admin-surface)] text-[var(--admin-muted)]'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  livePoll ? 'bg-[var(--admin-success)]' : 'bg-[var(--admin-subtle)]'
                }`}
              />
              {livePoll ? 'Tự động cập nhật: Bật' : 'Tự động cập nhật: Tắt'}
            </button>

            <button
              type="button"
              onClick={loadReports}
              className="admin-panel border border-[var(--admin-line)] bg-[var(--admin-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--admin-ink)] transition hover:border-[var(--admin-accent-border)] hover:text-[var(--admin-accent)]"
            >
              ↻ Làm mới ngay
            </button>
          </div>
          <details className="mt-2 text-xs text-[var(--admin-muted)]">
            <summary className="cursor-pointer">Cách cập nhật báo lỗi</summary>
            <p className="mt-2">Khi bật, danh sách tự cập nhật mỗi 5 giây.</p>
          </details>
        </div>
      </div>

      <div className="admin-toolbar flex flex-wrap items-center justify-between gap-3 admin-panel border border-[var(--admin-line)] bg-[var(--admin-surface)] p-4">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'RESOLVED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              aria-pressed={statusFilter === st}
              className={`rounded px-3.5 py-1.5 text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-[var(--admin-accent)] font-semibold text-[var(--admin-on-accent)]'
                  : 'border border-[var(--admin-line)] bg-[var(--admin-surface-soft)] text-[var(--admin-muted)] hover:text-[var(--admin-ink)]'
              }`}
            >
              {filterLabels[st]}
            </button>
          ))}
        </div>

        <span className="text-xs text-[var(--admin-muted)]">
          Đồng bộ lúc (giờ Việt Nam):{' '}
          <strong className="text-[var(--admin-ink)]">{lastSyncedAt || '—'}</strong> · Tổng cộng:{' '}
          <strong className="text-[var(--admin-accent)]">{reports.length}</strong> phản hồi
        </span>
      </div>

      {error && (
        <div className="rounded border border-[var(--admin-danger-border)] bg-[var(--admin-danger-wash)] p-4 text-xs text-[var(--admin-danger)]">
          {error}
        </div>
      )}

      <div className="admin-table-shell" tabIndex={0} role="region" aria-label="Danh sách báo lỗi">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-line)] bg-[var(--admin-surface-soft)] text-xs font-semibold uppercase text-[var(--admin-muted)]">
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Người gửi</th>
              <th className="px-4 py-3">Nội dung phản hồi</th>
              <th className="px-4 py-3">Thời gian gửi</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Xử lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-line)]">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-[var(--admin-muted)]">
                  Đang tải danh sách báo cáo lỗi…
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-[var(--admin-muted)]">
                  Chưa có báo cáo lỗi nào trong mục này.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="transition hover:bg-[var(--admin-hover)]">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--admin-muted)]">
                    #{report.id}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-[var(--admin-ink)]">
                    {report.username}
                    {report.userId && (
                      <span className="ml-1 text-[var(--admin-muted)]">(#{report.userId})</span>
                    )}
                  </td>
                  <td className="max-w-md px-4 py-3 text-sm leading-relaxed text-[var(--admin-ink)]">
                    {report.reportContent}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--admin-muted)]">
                    {formatVietnamDateTime(report.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {report.status === 'PENDING' ? (
                      <button
                        type="button"
                        disabled={updatingId === report.id}
                        onClick={() => handleToggleStatus(report)}
                        className="rounded border border-[var(--admin-success-border)] bg-[var(--admin-success-wash)] px-3 py-1 text-xs font-medium text-[var(--admin-success)] transition hover:bg-[var(--admin-success)] hover:text-[var(--admin-on-accent)] disabled:opacity-50"
                      >
                        ✓ Đánh dấu đã sửa
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={updatingId === report.id}
                        onClick={() => handleToggleStatus(report)}
                        className="rounded border border-[var(--admin-line)] bg-[var(--admin-surface-soft)] px-3 py-1 text-xs text-[var(--admin-muted)] transition hover:border-[var(--admin-accent-border)] hover:text-[var(--admin-accent)] disabled:opacity-50"
                      >
                        ↺ Mở lại báo cáo
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
