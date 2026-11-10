import { CREDIBILITY, FIRST_CHAPTER } from '../constants/gameplay'
import { applyPenalty, isDepleted } from '../systems/credibility'
import { addEntry, createEmptyNotebook } from '../systems/notebook'
import { normalizeTutorialState } from '../systems/tutorial'

/**
 * Trạng thái một lượt chơi — nguồn sự thật duy nhất cho chapter / uy tín / sổ tay.
 * JS thuần (không Phaser, không React) -> test được, debug được qua console:
 *   window.__THE_UNSPOKEN__.runtime.session
 */
export class GameSession {
  constructor({
    chapter = FIRST_CHAPTER,
    credibility = CREDIBILITY.START,
    notebook = createEmptyNotebook(),
    tutorial = undefined,
  } = {}) {
    this.chapter = chapter
    this.credibility = credibility
    this.notebook = notebook
    // Tutorial phòng 201 (DEC-013): một phần file lưu bình thường (Q-R9)
    this.tutorial = normalizeTutorialState(tutorial)
  }

  /** §3.3: trừ uy tín; trả về { value, depleted } để scene quyết định chuyển Bad Ending. */
  penalize(penalty) {
    this.credibility = applyPenalty(this.credibility, penalty)
    return { value: this.credibility, depleted: isDepleted(this.credibility) }
  }

  /** @returns {boolean} true nếu entry mới được thêm (false nếu trùng). */
  addNotebookEntry(tabId, entry) {
    const next = addEntry(this.notebook, tabId, entry)
    const added = next !== this.notebook
    this.notebook = next
    return added
  }

  /**
   * Snapshot khớp payload POST /api/game/save (Project.docx §4.3) — trừ userId do React bổ sung.
   * saveDataJson: trạng thái Notebook serialize thành chuỗi JSON (§2.1).
   * PENDING(ISS-06): schema chi tiết của saveDataJson.
   */
  toSaveSnapshot() {
    return {
      currentChapter: this.chapter,
      credibilityScore: this.credibility,
      saveDataJson: JSON.stringify({ notebook: this.notebook, tutorial: this.tutorial }),
    }
  }

  static fromSaveSnapshot({ currentChapter, credibilityScore, saveDataJson }) {
    const data = saveDataJson ? JSON.parse(saveDataJson) : {}
    return new GameSession({
      chapter: currentChapter,
      credibility: credibilityScore,
      notebook: data.notebook ?? createEmptyNotebook(),
      tutorial: data.tutorial,
    })
  }
}
