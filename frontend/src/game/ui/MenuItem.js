import Phaser from 'phaser'
import { COLORS, DEPTH, MENU_COLORS, menuTextStyle } from './theme'

export const MENU_ITEM = Object.freeze({ WIDTH: 470, HEIGHT: 52, INDENT: 22, SHIFT: 6 })

/**
 * Một mục của menu chính (DEC-012): số thứ tự kiểu hồ sơ "01" + nhãn.
 * Đang chọn: chữ hổ phách, dịch phải 6 px, hiện vạch dọc bên trái.
 * Bị khóa: chữ xám + ghi chú (vd "Chưa có bản lưu"), không bấm được.
 * Container gốc tại (x, y) = góc trên-trái của vùng bấm.
 */
export class MenuItem extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ x: number, y: number, number: string, label: string, note?: string,
   *           onHover?: () => void, onSelect?: () => void }} options
   */
  constructor(scene, { x, y, number, label, note = '', onHover, onSelect }) {
    super(scene, x, y)
    this.enabled = true
    this.selected = false // KHÔNG dùng tên `active`: GameObject.active là cờ nội bộ của Phaser
    this.onSelect = onSelect

    const midY = MENU_ITEM.HEIGHT / 2
    this.bar = scene.add.rectangle(0, midY, 3, 20, COLORS.accent).setOrigin(0, 0.5).setAlpha(0)
    this.content = scene.add.container(MENU_ITEM.INDENT, 0)
    this.numberText = scene.add
      .text(0, midY + 3, number, menuTextStyle({ font: 'mono', size: 12, letterSpacing: 1 }))
      .setColor(COLORS.mutedHex)
      .setOrigin(0, 0.5)
    this.labelText = scene.add
      .text(this.numberText.width + 18, midY, label, menuTextStyle({ size: 22, weight: 500 }))
      .setOrigin(0, 0.5)
    this.noteText = scene.add
      .text(0, midY + 2, note, menuTextStyle({ size: 12, color: COLORS.mutedHex }))
      .setOrigin(0, 0.5)
      .setVisible(false)
    this.content.add([this.numberText, this.labelText, this.noteText])
    // Vùng bấm là Zone con (gốc trên-trái) — tránh lệch tâm hit area của Container
    this.hitZone = scene.add
      .zone(0, 0, MENU_ITEM.WIDTH, MENU_ITEM.HEIGHT)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
    this.hitZone.on('pointerover', () => this.enabled && onHover?.())
    this.hitZone.on('pointerup', () => this.activate())
    this.add([this.hitZone, this.bar, this.content])
    this.setDepth(DEPTH.HUD)
    scene.add.existing(this)
    this.refresh()
  }

  setEnabled(enabled) {
    this.enabled = enabled
    if (this.hitZone.input) this.hitZone.input.cursor = enabled ? 'pointer' : 'default'
    this.refresh()
    return this
  }

  setSelected(selected) {
    if (this.selected === selected) return this
    this.selected = selected
    this.refresh(true)
    return this
  }

  setLabel(label, note = this.noteText.text) {
    this.labelText.setText(label)
    this.noteText.setText(note)
    this.refresh()
    return this
  }

  activate() {
    if (this.enabled) this.onSelect?.()
  }

  refresh(animate = false) {
    const highlighted = this.selected && this.enabled
    const color = !this.enabled
      ? MENU_COLORS.disabledHex
      : highlighted
        ? COLORS.accentHex
        : COLORS.textHex
    this.labelText.setColor(color)
    this.numberText.setColor(highlighted ? COLORS.accentHex : COLORS.mutedHex)
    this.noteText.setVisible(!this.enabled && this.noteText.text.length > 0)
    this.noteText.setX(this.labelText.x + this.labelText.width + 14)

    const targetX = MENU_ITEM.INDENT + (highlighted ? MENU_ITEM.SHIFT : 0)
    const barAlpha = highlighted ? 1 : 0
    this.scene.tweens.killTweensOf([this.content, this.bar])
    if (animate) {
      this.scene.tweens.add({ targets: this.content, x: targetX, duration: 150, ease: 'Quad.Out' })
      this.scene.tweens.add({ targets: this.bar, alpha: barAlpha, duration: 150 })
    } else {
      this.content.setX(targetX)
      this.bar.setAlpha(barAlpha)
    }
  }
}
