import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchAdminEvidence, fetchAdminUserSave, fetchAdminUsers } from '../api/adminApi'
import { SaveJsonModal } from '../components/SaveJsonModal'
import { StatusBadge } from '../components/StatusBadge'
import { formatVietnamDateTime } from '@/shared/time/vietnamTime'

/**
 * Trang 2: Quản lý Người dùng & Xem tiến trình Sổ tay điều tra.
 */
export function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [evidenceCatalog, setEvidenceCatalog] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSave, setSelectedSave] = useState(null)
  const [inspectLoadingId, setInspectLoadingId] = useState(null)
  const inspectTriggerRef = useRef(null)

  const loadUsers = useCallback(async () => {
    try {
      const [usersData, evidenceData] = await Promise.all([
        fetchAdminUsers(),
        fetchAdminEvidence().catch(() => []),
      ])
      setUsers(usersData)
      setEvidenceCatalog(evidenceData)
      setError('')
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách người dùng.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    Promise.all([fetchAdminUsers(), fetchAdminEvidence().catch(() => [])])
      .then(([usersData, evidenceData]) => {
        if (!active) return
        setUsers(usersData)
        setEvidenceCatalog(evidenceData)
        setError('')
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || 'Không thể tải danh sách người dùng.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        String(u.id).includes(q),
    )
  }, [users, search])

  const handleInspectSave = async (userId) => {
    setInspectLoadingId(userId)
    setError('')
    try {
      const detail = await fetchAdminUserSave(userId)
      setSelectedSave(detail)
    } catch (err) {
      setError(err.message || 'Không thể tải hồ sơ lưu của người chơi này.')
    } finally {
      setInspectLoadingId(null)
    }
  }

  return (
    <div className="admin-page space-y-6">
      <div className="admin-page-heading flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--admin-accent)]">
            Quản lý tài khoản
          </span>
          <h1 className="mt-0.5 text-2xl font-bold text-[var(--admin-ink)]">
            Danh sách Thám tử & Tiến trình Điều tra
          </h1>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          className="admin-panel border border-[var(--admin-line)] bg-[var(--admin-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--admin-ink)] transition hover:border-[var(--admin-accent-border)] hover:text-[var(--admin-accent)]"
        >
          ↻ Làm mới danh sách
        </button>
      </div>

      <div className="admin-toolbar flex flex-wrap items-center justify-between gap-3 admin-panel border border-[var(--admin-line)] bg-[var(--admin-surface)] p-4">
        <input
          type="search"
          aria-label="Tìm tài khoản theo tên, email hoặc mã ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên tài khoản, email hoặc mã ID..."
          className="w-full max-w-md rounded border border-[var(--admin-line)] bg-[var(--admin-surface-soft)] px-3.5 py-2 text-sm text-[var(--admin-ink)] placeholder-[var(--admin-subtle)] focus:border-[var(--admin-accent-border)] "
        />
        <span className="text-xs text-[var(--admin-muted)]">
          Hiển thị <strong className="text-[var(--admin-ink)]">{filteredUsers.length}</strong> /{' '}
          {users.length} tài khoản
        </span>
      </div>

      {error && (
        <div className="rounded border border-[var(--admin-danger-border)] bg-[var(--admin-danger-wash)] p-4 text-xs text-[var(--admin-danger)]">
          {error}
        </div>
      )}

      <div
        className="admin-table-shell"
        tabIndex={0}
        role="region"
        aria-label="Danh sách tài khoản"
      >
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-line)] bg-[var(--admin-surface-soft)] text-xs font-semibold uppercase text-[var(--admin-muted)]">
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Tài khoản</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Tiến độ chương</th>
              <th className="px-4 py-3">Điểm uy tín</th>
              <th className="px-4 py-3">Cập nhật gần nhất (giờ Việt Nam)</th>
              <th className="px-4 py-3 text-right">Hồ sơ điều tra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-line)]">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[var(--admin-muted)]">
                  Đang tải danh sách tài khoản…
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[var(--admin-muted)]">
                  Không tìm thấy tài khoản phù hợp.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="transition hover:bg-[var(--admin-hover)]">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--admin-muted)]">#{u.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[var(--admin-ink)]">{u.username}</div>
                    <div className="text-xs text-[var(--admin-muted)]">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.role} />
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {u.hasSave ? (
                      <span className="font-medium text-[var(--admin-accent)]">
                        Chương {u.currentChapter}
                      </span>
                    ) : (
                      <span className="text-[var(--admin-subtle)]">Chưa bắt đầu</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {u.hasSave ? (
                      <span
                        className={
                          u.credibilityScore <= 30
                            ? 'font-bold text-[var(--admin-danger)]'
                            : 'font-semibold text-[var(--admin-success)]'
                        }
                      >
                        {u.credibilityScore} / 100
                      </span>
                    ) : (
                      <span className="text-[var(--admin-subtle)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--admin-muted)]">
                    {formatVietnamDateTime(u.lastSavedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.hasSave ? (
                      <button
                        type="button"
                        disabled={inspectLoadingId === u.id}
                        onClickCapture={(event) => {
                          inspectTriggerRef.current = event.currentTarget
                        }}
                        onClick={() => handleInspectSave(u.id)}
                        className="rounded border border-[var(--admin-accent-border)] bg-[var(--admin-accent-wash)] px-3 py-1 text-xs font-medium text-[var(--admin-accent)] transition hover:bg-[var(--admin-accent-strong)] hover:text-[var(--admin-on-accent)] disabled:opacity-50"
                      >
                        {inspectLoadingId === u.id ? 'Đang mở…' : 'Xem sổ tay'}
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--admin-subtle)]">Chưa có dữ liệu</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SaveJsonModal
        saveDetail={selectedSave}
        evidenceCatalog={evidenceCatalog}
        returnFocusRef={inspectTriggerRef}
        onClose={() => setSelectedSave(null)}
      />
    </div>
  )
}
