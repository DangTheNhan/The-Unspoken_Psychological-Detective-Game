import { useEffect, useState } from 'react'
import { GAME_EVENTS } from '@/game/constants/gameEvents'
import { EventBus } from '@/game/core/EventBus'
import { createLogger } from '@/shared/logger/logger'
import { persistProgress, readLocalBackup } from '../services/saveService'
import { loadStoryText } from '../services/storyTextService'
import { translate } from '@/game/systems/i18n'

const log = createLogger('GameBridge')

/** Báo Phaser: trình duyệt có bản lưu không (MainMenu mờ "Tiếp tục điều tra" / hỏi trước khi ghi đè). */
function announceSaveAvailability(username) {
  EventBus.emit(GAME_EVENTS.SAVE_AVAILABILITY, { hasSave: readLocalBackup(username) !== null })
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

  useEffect(() => {
    let active = true
    let latestRequest = null
    let lastContentStatus = null
    const onStoryTextRequested = async (input) => {
      latestRequest = input.requestId
      const result = await loadStoryText(input)
      if (!active || latestRequest !== input.requestId) return
      lastContentStatus = result.status
      setStatusMessage(translate(input.language, `storyContent.${result.status}`))
      EventBus.emit(GAME_EVENTS.STORY_TEXT_RESULT, { requestId: input.requestId, ...result })
    }
    const onSettingsChanged = (settings) => {
      if (lastContentStatus)
        setStatusMessage(translate(settings.language, `storyContent.${lastContentStatus}`))
    }
    EventBus.on(GAME_EVENTS.STORY_TEXT_REQUESTED, onStoryTextRequested)
    EventBus.on(GAME_EVENTS.SETTINGS_CHANGED, onSettingsChanged)
    const onSaveRequested = async ({ reason, snapshot }) => {
      try {
        const result = await persistProgress(snapshot, { userId, username, reason })
        announceSaveAvailability(username)
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
    const onLoadRequested = () => {
      const snapshot = readLocalBackup(username)
      if (snapshot) EventBus.emit(GAME_EVENTS.LOAD_RESULT, snapshot)
    }
    const onCheckpointReload = () =>
      setStatusMessage('Tải checkpoint: chờ định nghĩa checkpoint (ISS-05).')

    announceSaveAvailability(username)
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

  return { statusMessage }
}
