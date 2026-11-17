import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ROUTES } from '@/app/router/routePaths'
import { useAuth } from '@/features/auth/state/useAuth'
import { PhaserGame } from '../components/PhaserGame'
import { useGameBridge } from '../hooks/useGameBridge'
import { EventBus } from '@/game/core/EventBus'
import { GAME_EVENTS } from '@/game/constants/gameEvents'
import { translate } from '@/game/systems/i18n'
import { Modal } from '@/shared/ui/Modal'
import { BugReportDialog } from '@/features/bug-report/BugReportDialog'
import { formatVietnamDateTime } from '@/shared/time/vietnamTime'

const control = (action, reason) => EventBus.emit(GAME_EVENTS.CONTROL_REQUEST, { action, reason })

/** Trang chơi: khung web (React) bao quanh canvas game (Phaser). */
export function GamePlayPage() {
  const { session, logout, maintenance, registerExitHandler } = useAuth()
  const [controls, setControls] = useState({ menuOpen: false, playing: false })
  const [reportOpen, setReportOpen] = useState(false)
  const [language, setLanguage] = useState('vi')
  const t = (key) => translate(language, key)
  const { statusMessage, contentWarning, loadChoices, chooseProgress } = useGameBridge({
    userId: session?.userId ?? null,
    username: session?.username,
  })
  const isAdmin = session?.role === 'ROLE_ADMIN'
  const maintenanceActive = maintenance.active && !isAdmin
  const overlayOpen = reportOpen || Boolean(loadChoices) || controls.menuOpen || maintenanceActive
  useEffect(() => {
    if (!overlayOpen) return undefined
    control('lock-input', 'react-overlay')
    return () => control('unlock-input', 'react-overlay')
  }, [overlayOpen])
  useEffect(
    () =>
      registerExitHandler((nextSession) =>
        EventBus.emit(GAME_EVENTS.CONTROL_REQUEST, {
          action: nextSession?.username === session?.username ? 'unblock' : 'block',
          reason: 'session',
        }),
      ),
    [registerExitHandler, session?.username],
  )
  useEffect(() => {
    if (loadChoices) EventBus.emit(GAME_EVENTS.CONTROL_REQUEST, { action: 'pause' })
  }, [loadChoices])
  useEffect(() => {
    const update = (data) => {
      setControls(data)
      if (data.language) setLanguage(data.language)
    }
    const settings = (data) => setLanguage(data.language)
    const report = () => {
      EventBus.emit(GAME_EVENTS.CONTROL_REQUEST, { action: 'pause' })
      setReportOpen(true)
    }
    EventBus.on(GAME_EVENTS.CONTROL_STATE, update)
    EventBus.on(GAME_EVENTS.SETTINGS_CHANGED, settings)
    EventBus.on(GAME_EVENTS.REPORT_REQUESTED, report)
    return () => {
      EventBus.off(GAME_EVENTS.CONTROL_STATE, update)
      EventBus.off(GAME_EVENTS.SETTINGS_CHANGED, settings)
      EventBus.off(GAME_EVENTS.REPORT_REQUESTED, report)
    }
  }, [])
  useEffect(() => {
    EventBus.emit(GAME_EVENTS.CONTROL_REQUEST, {
      action: maintenanceActive ? 'block' : 'unblock',
      reason: 'maintenance',
    })
  }, [maintenanceActive])

  return (
    <div className="flex min-h-screen flex-col items-center gap-3 p-4">
      <header className="flex w-full max-w-[1280px] items-center justify-between text-sm text-stone-400">
        <span>
          Thám tử: <strong className="text-stone-200">{session?.username}</strong>
          {isAdmin && (
            <span className="ml-2 rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-300">
              ADMIN
            </span>
          )}
        </span>
        <nav className="flex flex-wrap items-center gap-4">
          {isAdmin && (
            <Link
              to={ROUTES.ADMIN}
              className="rounded border border-amber-400/50 bg-[#241f2b] px-3 py-1 font-mono text-xs tracking-wider text-amber-300 transition hover:bg-amber-400 hover:text-[#17151b]"
            >
              HỒ SƠ QUẢN TRỊ →
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Đăng xuất khỏi The Unspoken? Các bản lưu đã có vẫn được giữ trên trình duyệt.',
                )
              )
                logout()
            }}
            className="hover:text-amber-400"
          >
            Đăng xuất
          </button>
        </nav>
      </header>
      {maintenance.scheduled && (
        <aside
          role="status"
          className="w-full max-w-[1280px] border-l-2 border-amber-400 bg-[#241f2b] p-4 text-sm text-amber-200"
        >
          <strong>Bảo trì lúc {formatVietnamDateTime(maintenance.startsAt)} (giờ Việt Nam)</strong>
          <p className="mt-1 whitespace-pre-wrap">{maintenance.message}</p>
          <p className="mt-1 text-xs text-stone-400">
            Còn {maintenance.remainingSeconds} giây. Game sẽ tự dừng khi đến giờ.
          </p>
        </aside>
      )}
      {maintenanceActive && (
        <section
          role="alert"
          className="w-full max-w-[1280px] rounded border border-amber-400/50 bg-[#241f2b] p-6"
        >
          <h1 className="text-xl font-semibold text-amber-300">Game tạm dừng để bảo trì</h1>
          <p className="mt-3 whitespace-pre-wrap">{maintenance.message}</p>
          <p className="mt-3 text-sm text-stone-400">
            Bản lưu đã có được giữ nguyên. Trạng thái lưu của phiên hiển thị bên dưới. Game sẽ mở
            lại khi quản trị viên kết thúc bảo trì.
          </p>
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="mt-4 text-sm text-amber-300 underline"
          >
            Gửi báo lỗi
          </button>
        </section>
      )}
      <div
        inert={maintenanceActive || undefined}
        className={
          maintenanceActive
            ? 'pointer-events-none w-full max-w-[1280px] opacity-30'
            : 'w-full max-w-[1280px]'
        }
      >
        <PhaserGame key={session?.username} />
      </div>
      {contentWarning && (
        <p role="status" className="text-sm text-amber-200">
          {contentWarning}
        </p>
      )}
      <p role="status" className="min-h-5 text-sm text-stone-400">
        {statusMessage}
      </p>
      {controls.menuOpen && !reportOpen && !maintenanceActive && !loadChoices && (
        <Modal title={t('pause.title')} onClose={() => control('resume')}>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => control('resume')}
              className="rounded bg-amber-400 px-4 py-2 text-left text-stone-950"
            >
              {t('pause.resume')}
            </button>
            <button
              type="button"
              onClick={() => control('settings')}
              className="rounded border border-stone-600 px-4 py-2 text-left"
            >
              {t('pause.settings')}
            </button>
            {controls.canSkipTutorial && (
              <button
                type="button"
                onClick={() => control('skip-tutorial')}
                className="rounded border border-stone-600 px-4 py-2 text-left"
              >
                {t('pause.skipTutorial')}
              </button>
            )}
            {controls.playing && (
              <button
                type="button"
                onClick={() => control('menu')}
                className="rounded border border-stone-600 px-4 py-2 text-left"
              >
                {t('pause.menu')}
              </button>
            )}
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="rounded border border-stone-600 px-4 py-2 text-left"
            >
              {t('menu.report')}
            </button>
            <p className="mt-2 text-xs leading-relaxed text-stone-400">{t('pause.note')}</p>
          </div>
        </Modal>
      )}
      {loadChoices && !maintenanceActive && (
        <Modal title="Chọn tiến độ để tiếp tục" onClose={() => chooseProgress(null)}>
          <p className="mb-4 text-sm text-stone-400">
            Bản lưu trên trình duyệt và máy chủ khác nhau. Chọn bản muốn chơi; thao tác này chưa ghi
            đè bản còn lại.
          </p>
          <div className="space-y-3">
            {[
              ['Trên trình duyệt', loadChoices.local],
              ['Trên máy chủ', loadChoices.remote],
            ].map(([label, snapshot]) => (
              <button
                type="button"
                key={label}
                onClick={() => chooseProgress(snapshot)}
                className="block w-full rounded border border-stone-600 p-4 text-left hover:border-amber-400"
              >
                <strong>{label}</strong>
                <span className="mt-1 block text-sm text-stone-400">
                  Chương {snapshot.currentChapter} · Uy tín {snapshot.credibilityScore}
                </span>
                <span className="mt-1 block text-xs text-stone-500">
                  {snapshot.savedAt ?? snapshot.updatedAt ?? ''}
                </span>
              </button>
            ))}
          </div>
        </Modal>
      )}
      {reportOpen && (
        <BugReportDialog
          onClose={() => {
            setReportOpen(false)
            if (controls.inMainMenu) control('resume')
          }}
        />
      )}
    </div>
  )
}
