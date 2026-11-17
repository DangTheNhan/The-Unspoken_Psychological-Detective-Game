export function StatusBadge({ status }) {
  const normalized = String(status || '').toUpperCase()
  const labels = {
    RESOLVED: 'Đã khắc phục',
    PENDING: 'Chờ xử lý',
    ROLE_ADMIN: 'Quản trị viên',
    ROLE_PLAYER: 'Người chơi',
  }
  const tones = {
    RESOLVED: 'success',
    PENDING: 'pending',
    ROLE_ADMIN: 'admin',
    ROLE_PLAYER: 'neutral',
  }
  return (
    <span className={`admin-badge admin-badge--${tones[normalized] || 'neutral'}`}>
      {(normalized === 'RESOLVED' || normalized === 'PENDING') && (
        <span className="admin-badge-dot" aria-hidden="true" />
      )}
      {labels[normalized] || status || 'Không rõ'}
    </span>
  )
}
