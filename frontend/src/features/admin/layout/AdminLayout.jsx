import { Link, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/app/router/routePaths'
import { useAuth } from '@/features/auth/state/useAuth'
import { StatusBadge } from '../components/StatusBadge'
import { AdminIcon } from '../components/AdminIcon'
import { AdminSidebar } from './AdminSidebar'
import { ADMIN_NAV_ITEMS } from './adminNavigation'
import './admin.css'
export function AdminLayout() {
  const { session, logout } = useAuth()
  const { pathname } = useLocation()
  const currentPage = ADMIN_NAV_ITEMS.find((item) => item.to === pathname)
  return (
    <div className="admin-shell">
      <a className="admin-skip-link" href="#admin-main">
        Đến nội dung chính
      </a>
      <AdminSidebar />
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-account">
            <span className="admin-avatar" aria-hidden="true">
              {session?.username?.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <span className="admin-account-label">Quản trị viên:</span>
              <strong>{session?.username}</strong>
            </div>
            <StatusBadge status={session?.role} />
          </div>
          <div className="admin-topbar-actions">
            <Link to={ROUTES.PLAY} className="admin-return-link">
              ← Quay lại trò chơi
            </Link>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Đăng xuất khỏi trang quản trị?')) logout()
              }}
              className="admin-logout"
            >
              Đăng xuất
            </button>
          </div>
        </header>
        <main id="admin-main" tabIndex={-1} className="admin-main">
          <nav className="admin-breadcrumb" aria-label="Vị trí hiện tại">
            <span>Quản trị</span>
            <AdminIcon name="chevron" size={12} />
            <span aria-current="page">{currentPage?.label}</span>
          </nav>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
