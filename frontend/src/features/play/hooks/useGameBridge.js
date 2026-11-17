import { useEffect, useState } from 'react'
import { GAME_EVENTS } from '@/game/constants/gameEvents'
import { EventBus } from '@/game/core/EventBus'
import { createLogger } from '@/shared/logger/logger'
import { persistProgress, readLocalBackup } from '../services/saveService'
import { loadStoryText } from '../services/storyTextService'
import { translate } from '@/game/systems/i18n'
import { loadGameProgress } from '../api/gameApi'
import { progressCandidates } from '../services/progressSelection'

const log = createLogger('GameBridge')

/** Báo Phaser: trình duyệt có bản lưu không (MainMenu mờ "Tiếp tục điều tra" / hỏi trước khi ghi đè). */
function announceSaveAvailability(username, remoteAvailable = false) {
  EventBus.emit(GAME_EVENTS.SAVE_AVAILABILITY, {
    hasSave: remoteAvailable || readLocalBackup(username) !== null,
  })
}

/**
 * Lắng nghe sự kiện từ Phaser và xử lý phía React (gọi API, localStorage).
 * Trả về thông báo trạng thái gần nhất để hiển thị trên trang.
 * Gửi SAVE_AVAILABILITY khi mở trang và sau mỗi lần lưu (DEC-012). Game đã được tạo trước
 * (useLayoutEffect của PhaserGame chạy trước useEffect này) nên runtime đã nghe sẵn.
 * @param {{ userId?: number|null }} options
 */
export function useGameBridge({ userId = null, username } = {}) {
  const [statusMessage, setStatusMessage] = useState('')
  const [contentWarning, setContentWarning] = useState(null)
  const [loadChoices, setLoadChoices] = useState(null)
  const chooseProgress = (snapshot) => {
    setLoadChoices(null)
    EventBus.emit(GAME_EVENTS.CONTROL_REQUEST, { action: 'resume' })
    if (snapshot) EventBus.emit(GAME_EVENTS.LOAD_RESULT, snapshot)
  }

  useEffect(() => {
    let active = true
    let remoteAvailable = false
    let loadingProgress = false
    let latestRequest = null
    const onStoryTextRequested = async (input) => {
      latestRequest = input.requestId
      const result = await loadStoryText(input)
      if (!active || latestRequest !== input.requestId) return
      setContentWarning(
        ['cached', 'offlineBase', 'rejected'].includes(result.status)
          ? { status: result.status, language: input.language }
          : null,
      )
      EventBus.emit(GAME_EVENTS.STORY_TEXT_RESULT, { requestId: input.requestId, ...result })
    }
    const onSettingsChanged = (settings) => {
      setContentWarning((previous) =>
        previous ? { ...previous, language: settings.language } : null,
      )
    }
    EventBus.on(GAME_EVENTS.STORY_TEXT_REQUESTED, onStoryTextRequested)
    EventBus.on(GAME_EVENTS.SETTINGS_CHANGED, onSettingsChanged)
    const onSaveRequested = async ({ reason, snapshot, localOnly = false }) => {
      try {
        const result = await persistProgress(snapshot, { userId, username, reason, localOnly })
        if (!active) return
        remoteAvailable ||= result.remote
        announceSaveAvailability(username, remoteAvailable)
        // Báo kết quả cho Sổ tay trong game (DEC-013: nút Lưu nằm trong Sổ tay)
        EventBus.emit(GAME_EVENTS.SAVE_RESULT, { ok: true, remote: result.remote })
        setStatusMessage(
          result.remote
            ? 'Đã lưu tiến trình lên máy chủ.'
            : 'Đã lưu tạm trên trình duyệt (offline).',
        )
      } catch (error) {
        log.error('Lưu thất bại', error)
        EventBus.emit(GAME_EVENTS.SAVE_RESULT, { ok: false, remote: false, message: error.message })
        setStatusMessage(`Lưu thất bại: ${error.message}`)
      }
    }
    // PENDING(ISS-05, ISS-29): tải bản lưu server.
    const onLoadRequested = async () => {
      if (loadingProgress) return
      loadingProgress = true
      const local = readLocalBackup(username)
      let remote = null
      try {
        if (userId) remote = await loadGameProgress(userId)
      } catch (error) {
        if (error.status !== 404)
          setStatusMessage(
            local
              ? 'Chưa lấy được bản lưu máy chủ; đang dùng bản trên trình duyệt.'
              : 'Chưa lấy được bản lưu máy chủ. Hãy thử lại khi kết nối ổn định.',
          )
      }
      loadingProgress = false
      if (!active) return
      const result = progressCandidates(local, remote)
      if (result.conflict) setLoadChoices(result.conflict)
      else if (result.snapshot) EventBus.emit(GAME_EVENTS.LOAD_RESULT, result.snapshot)
    }
    const onCheckpointReload = () =>
      setStatusMessage('Tải checkpoint: chờ định nghĩa checkpoint (ISS-05).')

    announceSaveAvailability(username)
    if (userId)
      loadGameProgress(userId)
        .then(() => {
          if (!active) return
          remoteAvailable = true
          announceSaveAvailability(username, true)
        })
        .catch(() => {})
    EventBus.on(GAME_EVENTS.SAVE_REQUESTED, onSaveRequested)
    EventBus.on(GAME_EVENTS.LOAD_REQUESTED, onLoadRequested)
    EventBus.on(GAME_EVENTS.CHECKPOINT_RELOAD_REQUESTED, onCheckpointReload)
    return () => {
      active = false
      EventBus.off(GAME_EVENTS.STORY_TEXT_REQUESTED, onStoryTextRequested)
      EventBus.off(GAME_EVENTS.SETTINGS_CHANGED, onSettingsChanged)
      EventBus.off(GAME_EVENTS.SAVE_REQUESTED, onSaveRequested)
      EventBus.off(GAME_EVENTS.LOAD_REQUESTED, onLoadRequested)
      EventBus.off(GAME_EVENTS.CHECKPOINT_RELOAD_REQUESTED, onCheckpointReload)
    }
  }, [userId, username])

  return {
    statusMessage,
    contentWarning: contentWarning
      ? translate(contentWarning.language, `storyContent.${contentWarning.status}`)
      : '',
    loadChoices,
    chooseProgress,
  }
}
