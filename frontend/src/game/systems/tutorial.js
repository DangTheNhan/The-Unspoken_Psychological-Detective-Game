/**
 * Tutorial phòng 201 (DEC-013) — máy trạng thái thuần: nhận sự kiện, trả trạng thái MỚI. Test được.
 *
 * Bước: move (đi tới vòng sáng) -> interact (xem 1 đồ vật) -> notebook (mở rồi đóng Sổ tay)
 *       -> exit (ra cửa) -> done.  Bỏ qua bất kỳ lúc nào -> skipped.
 * Trạng thái là một phần file lưu bình thường (DEC-013 Q-R9) — GameSession.flags.
 */
export const TUTORIAL_STEPS = Object.freeze(['move', 'interact', 'notebook', 'exit'])

export const TUTORIAL_EVENTS = Object.freeze({
  REACHED_MARKER: 'reached-marker',
  INSPECTED: 'inspected',
  NOTEBOOK_CLOSED: 'notebook-closed',
  EXITED: 'exited',
  SKIPPED: 'skipped',
})

/** Sự kiện làm hoàn thành từng bước. */
const COMPLETES = Object.freeze({
  move: TUTORIAL_EVENTS.REACHED_MARKER,
  interact: TUTORIAL_EVENTS.INSPECTED,
  notebook: TUTORIAL_EVENTS.NOTEBOOK_CLOSED,
  exit: TUTORIAL_EVENTS.EXITED,
})

export function createTutorialState() {
  return { step: TUTORIAL_STEPS[0], status: 'active' }
}

/** Đọc từ file lưu (có thể cũ/hỏng) -> luôn hợp lệ. */
export function normalizeTutorialState(raw) {
  if (!raw || typeof raw !== 'object') return createTutorialState()
  if (raw.status === 'done' || raw.status === 'skipped') return { step: null, status: raw.status }
  if (TUTORIAL_STEPS.includes(raw.step)) return { step: raw.step, status: 'active' }
  return createTutorialState()
}

export function isTutorialActive(state) {
  return state.status === 'active'
}

/**
 * @returns {object} trạng thái mới (cùng object nếu sự kiện không làm gì)
 */
export function advanceTutorial(state, event) {
  if (!isTutorialActive(state)) return state
  if (event === TUTORIAL_EVENTS.SKIPPED) return { step: null, status: 'skipped' }
  if (COMPLETES[state.step] !== event) return state
  const next = TUTORIAL_STEPS[TUTORIAL_STEPS.indexOf(state.step) + 1]
  return next ? { step: next, status: 'active' } : { step: null, status: 'done' }
}

/** Được ra cửa khi: tutorial xong/bỏ qua, hoặc đang ở bước cuối. */
export function canExit(state) {
  return !isTutorialActive(state) || state.step === 'exit'
}
