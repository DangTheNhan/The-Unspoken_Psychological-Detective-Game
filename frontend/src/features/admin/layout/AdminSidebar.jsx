import { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminIcon } from '../components/AdminIcon'
import { ADMIN_NAV_ITEMS } from './adminNavigation'
export function AdminSidebar() {
  const [expanded, setExpanded] = useState(false)
  const toggleRef = useRef(null)
  const closeNavigation = () => {
    setExpanded(false)
    if (window.matchMedia('(max-width: 959px)').matches) toggleRef.current?.focus()
  }
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="admin-brand-mark" aria-hidden="true">
          U.
        </span>
        <div>
          <span className="admin-brand-kicker">K-ESTATE ARCHIVE</span>
          <p className="admin-brand-name">THE UNSPOKEN</p>
          <p className="admin-brand-description">Trung tâm Quản trị & Giám sát Điều tra</p>
        </div>
        <button
          ref={toggleRef}
          type="button"
          className="admin-nav-toggle"
          aria-expanded={expanded}
          aria-controls="admin-navigation"
          aria-label={expanded ? 'Đóng điều hướng quản trị' : 'Mở điều hướng quản trị'}
          onClick={() => setExpanded((value) => !value)}
        >
          <AdminIcon name={expanded ? 'close' : 'menu'} />
        </button>
      </div>
      <nav
        id="admin-navigation"
        aria-label="Điều hướng quản trị"
        className={`admin-navigation${expanded ? ' is-open' : ''}`}
      >
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={closeNavigation}
            className={({ isActive }) => `admin-nav-item${isActive ? ' is-active' : ''}`}
          >
            <AdminIcon name={item.icon} />
            <span className="admin-nav-copy">
              <span>{item.label}</span>
              <small>{item.sub}</small>
            </span>
            <span className="admin-nav-code">{item.code}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
