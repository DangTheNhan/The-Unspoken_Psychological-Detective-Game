import Phaser from 'phaser'
import { SCENE_KEYS } from '../constants/sceneKeys'
import { getRuntime } from '../core/runtime'
import { LANGUAGE_NAMES } from '../data/uiText'
import { createTranslator } from '../systems/i18n'
import {
  DIALOGUE_TEXT_SIZES,
  LANGUAGES,
  TEXT_SPEEDS,
  applySettingChange,
  createDefaultSettings,
  toSoundManagerState,
} from '../systems/settings'
import { IconButton } from '../ui/IconButton'
import { PanelButton } from '../ui/PanelButton'
import { SegmentedControl } from '../ui/SegmentedControl'
import { Slider } from '../ui/Slider'
import { Toggle } from '../ui/Toggle'
import { COLORS, MENU_COLORS, menuTextStyle } from '../ui/theme'

/** Bảng 880 px giữa khung 1280×720 (bản thiết kế DEC-012). */
const PANEL = Object.freeze({ W: 880, H: 520, PAD_X: 40, RADIUS: 10 })
const ROW_HEIGHT = 72
const TAB_GAP = 32

/**
 * Các dòng của từng tab — DEC-012: tab Hiển thị đã bỏ (game chạy trên web).
 * kind: 'slider' | 'toggle' | 'choice'; choices: danh sách giá trị hợp lệ (systems/settings.js).
 */
const TABS = Object.freeze([
  {
    id: 'audio',
    labelKey: 'settings.tab.audio',
    rows: [
      { key: 'masterVolume', kind: 'slider' },
      { key: 'musicVolume', kind: 'slider' },
      { key: 'sfxVolume', kind: 'slider' },
      { key: 'muteAll', kind: 'toggle' },
    ],
  },
  {
    id: 'game',
    labelKey: 'settings.tab.game',
    rows: [
      { key: 'language', kind: 'choice', choices: LANGUAGES, hintKey: 'settings.language.hint' },
      { key: 'textSpeed', kind: 'choice', choices: TEXT_SPEEDS },
      { key: 'autoAdvance', kind: 'toggle', hintKey: 'settings.autoAdvance.hint' },
      { key: 'dialogueTextSize', kind: 'choice', choices: DIALOGUE_TEXT_SIZES },
    ],
  },
])

/**
 * Màn Cài đặt (DEC-012) — lớp phủ mở từ MainMenu (launch + pause).
 * Làm trên BẢN NHÁP: chỉ khi bấm "Lưu" mới ghi vào runtime.settings (localStorage) và phát
 * SETTINGS_CHANGED. Esc / nút X = đóng không lưu (âm lượng nghe thử được trả về như cũ).
 * Đổi ngôn ngữ trong bản nháp -> nhãn của bảng đổi ngay để xem trước.
 * data: { returnTo?: string } — scene cần resume khi đóng.
 */
export class SettingsScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.SETTINGS)
  }

  init(data) {
    this.returnTo = data?.returnTo ?? null
    this.tabIndex = 0
  }

  create() {
    this.runtime = getRuntime(this)
    this.saved = this.runtime.settings.get()
    this.draft = { ...this.saved }
    this.layer = null
    this.render()

    // Esc = đóng không lưu · ← → = đổi tab
    this.input.keyboard?.on('keydown-ESC', () => this.close(false))
    this.input.keyboard?.on('keydown-LEFT', () => this.switchTab(Math.max(0, this.tabIndex - 1)))
    this.input.keyboard?.on('keydown-RIGHT', () =>
      this.switchTab(Math.min(TABS.length - 1, this.tabIndex + 1)),
    )
  }

  /** Vẽ lại toàn bộ bảng (đổi tab / đổi ngôn ngữ / khôi phục mặc định). Bảng nhỏ nên vẽ lại rẻ. */
  render() {
    this.layer?.destroy()
    const layer = this.add.container(0, 0)
    this.layer = layer
    const t = createTranslator(this.draft.language)
    const { width, height } = this.scale
    const left = (width - PANEL.W) / 2
    const top = (height - PANEL.H) / 2
    const right = left + PANEL.W - PANEL.PAD_X
    const contentLeft = left + PANEL.PAD_X

    const shade = this.add.rectangle(0, 0, width, height, MENU_COLORS.overlay, 0.82).setOrigin(0)
    shade.setInteractive() // chặn bấm xuyên xuống menu
    const panel = this.add
      .rectangle(left, top, PANEL.W, PANEL.H, COLORS.panel)
      .setOrigin(0)
      .setRounded(PANEL.RADIUS)
      .setStrokeStyle(1, COLORS.panelBorder)
    layer.add([shade, panel])

    // Tiêu đề + nhãn nhỏ + nút đóng
    const title = this.add.text(
      contentLeft,
      top + 26,
      t('settings.title'),
      menuTextStyle({ font: 'display', size: 32, weight: 700 }),
    )
    const kicker = this.add
      .text(
        title.x + title.width + 16,
        title.y + title.height - 14,
        t('settings.kicker'),
        menuTextStyle({ font: 'mono', size: 12, letterSpacing: 2 }),
      )
      .setColor(COLORS.mutedHex)
      .setOrigin(0, 1)
    const close = new IconButton(this, {
      x: left + PANEL.W - 28 - 22,
      y: top + 24 + 22,
      icon: 'close',
      bordered: false,
      onClick: () => this.close(false),
    })
    layer.add([title, kicker, close])

    // Tab
    const tabsTop = top + 84
    const tabLine = this.add.rectangle(
      contentLeft,
      tabsTop + 48,
      right - contentLeft,
      1,
      MENU_COLORS.divider,
    )
    layer.add(tabLine.setOrigin(0))
    let tabX = contentLeft
    TABS.forEach((tab, index) => {
      const selected = index === this.tabIndex
      const label = this.add
        .text(tabX + 4, tabsTop + 24, t(tab.labelKey), menuTextStyle({ size: 15, weight: 500 }))
        .setColor(selected ? COLORS.accentHex : COLORS.mutedHex)
        .setOrigin(0, 0.5)
      const tabWidth = label.width + 8
      const hit = this.add
        .zone(tabX, tabsTop, tabWidth, 48)
        .setOrigin(0)
        .setInteractive({ useHandCursor: true })
      hit.on('pointerover', () => !selected && label.setColor(COLORS.textHex))
      hit.on('pointerout', () => !selected && label.setColor(COLORS.mutedHex))
      hit.on('pointerup', () => this.switchTab(index))
      layer.add([label, hit])
      if (selected) {
        layer.add(this.add.rectangle(tabX, tabsTop + 47, tabWidth, 2, COLORS.accent).setOrigin(0))
      }
      tabX += tabWidth + TAB_GAP
    })

    // Các dòng thiết lập
    let rowTop = tabsTop + 56
    const rows = TABS[this.tabIndex].rows
    rows.forEach((row, index) => {
      const isLast = index === rows.length - 1 // dòng cuối sát vạch chân bảng -> không kẻ thêm
      layer.add(this.buildRow(row, t, { contentLeft, right, rowTop, divider: !isLast }))
      rowTop += ROW_HEIGHT
    })

    // Chân bảng
    const footerTop = top + PANEL.H - 86
    layer.add(this.add.rectangle(left, footerTop, PANEL.W, 1, MENU_COLORS.divider).setOrigin(0))
    const buttonY = footerTop + 20
    const save = new PanelButton(this, {
      label: t('settings.save'),
      variant: 'primary',
      onClick: () => this.close(true),
    })
    save.setPosition(right - save.width, buttonY)
    const reset = new PanelButton(this, {
      label: t('settings.reset'),
      onClick: () => this.resetDraft(),
    })
    reset.setPosition(save.x - 12 - reset.width, buttonY)
    const hint = this.add
      .text(
        contentLeft,
        buttonY + 22,
        t('settings.escHint'),
        menuTextStyle({ font: 'mono', size: 12 }),
      )
      .setColor(COLORS.mutedHex)
      .setOrigin(0, 0.5)
    layer.add([save, reset, hint])
  }

  /** Một dòng: nhãn (+ gợi ý) bên trái, điều khiển canh phải. */
  buildRow(row, t, { contentLeft, right, rowTop, divider }) {
    const parts = []
    const midY = rowTop + ROW_HEIGHT / 2
    const labelKey = `settings.${row.key}`
    const label = this.add.text(
      contentLeft,
      midY,
      t(labelKey),
      menuTextStyle({ size: 16, weight: 500 }),
    )
    if (row.hintKey) {
      label.setOrigin(0, 1).setY(midY + 2)
      const hint = this.add
        .text(contentLeft, midY + 4, t(row.hintKey), menuTextStyle({ size: 12 }))
        .setColor(COLORS.mutedHex)
      parts.push(hint)
    } else {
      label.setOrigin(0, 0.5)
    }
    parts.push(label)

    const value = this.draft[row.key]
    const onChange = (next) => this.changeDraft(row.key, next)
    let control
    if (row.kind === 'slider') {
      control = new Slider(this, { value, onChange })
    } else if (row.kind === 'toggle') {
      control = new Toggle(this, {
        value,
        labels: { on: t('settings.on'), off: t('settings.off') },
        onChange,
      })
    } else {
      const options = row.choices.map((choice) => ({
        value: choice,
        label: row.key === 'language' ? LANGUAGE_NAMES[choice] : t(`${labelKey}.${choice}`),
      }))
      control = new SegmentedControl(this, { options, value, onChange })
    }
    control.setPosition(right - control.width, midY - control.height / 2)
    parts.push(control)

    if (divider) {
      const line = this.add
        .rectangle(
          contentLeft,
          rowTop + ROW_HEIGHT - 1,
          right - contentLeft,
          1,
          MENU_COLORS.rowDivider,
        )
        .setOrigin(0)
      parts.push(line)
    }
    return parts
  }

  changeDraft(key, value) {
    this.draft = applySettingChange(this.draft, key, value)
    // Nghe thử âm lượng ngay (chưa lưu); đổi ngôn ngữ -> vẽ lại nhãn
    Object.assign(this.sound, toSoundManagerState(this.draft))
    if (key === 'language') this.render()
  }

  resetDraft() {
    this.draft = createDefaultSettings()
    Object.assign(this.sound, toSoundManagerState(this.draft))
    this.render()
  }

  switchTab(index) {
    if (index === this.tabIndex) return
    this.tabIndex = index
    this.render()
  }

  /** @param {boolean} save true = Lưu; false = bỏ bản nháp */
  close(save) {
    if (save) {
      // set() ghi localStorage + phát SETTINGS_CHANGED (index.js áp dụng âm thanh, MainMenu vẽ lại)
      this.runtime.settings.set(this.draft)
    } else {
      Object.assign(this.sound, toSoundManagerState(this.saved))
    }
    this.scene.stop()
    if (this.returnTo) this.scene.resume(this.returnTo)
  }
}
