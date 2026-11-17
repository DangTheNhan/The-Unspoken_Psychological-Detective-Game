export function StatCard({ code, label, value, subtitle, tone = 'amber' }) {
  return (
    <article className={`admin-stat admin-stat--${tone}`}>
      <div className="admin-stat-category">
        <span>{code}</span>
        <span className="admin-stat-dot" aria-hidden="true" />
      </div>
      <p className="admin-stat-value">{value}</p>
      <h3>{label}</h3>
      {subtitle && <p className="admin-stat-subtitle">{subtitle}</p>}
    </article>
  )
}
