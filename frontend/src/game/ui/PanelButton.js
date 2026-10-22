import Phaser from 'phaser'
import { COLORS, MENU_COLORS, menuTextStyle } from './theme'

const HEIGHT = 44
const PADDING_X = 22
const RADIUS = 6

/**
 * Nút chữ nhật bo góc của bảng Cài đặt / hộp xác nhận (DEC-012).
 * variant 'primary' = nền hổ phách (hành động chính, vd Lưu) · 'ghost' = viền mảnh (Hủy, Khôi phục).
 * Gốc (x, y) = góc trên-trái. `width` đọc được sau khi tạo để canh phải.
 */
export class PanelButton extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ x?: number, y?: number, label: string, variant?: 'primary'|'ghost', onClick?: () => void }} options
   */
  constructor(scene, { x = 0, y = 0, label, variant = 'ghost', onClick }) {
    super(scene, x, y)
    const primary = variant === 'primary'
    this.text = scene.add
      .text(PADDING_X, HEIGHT / 2, label, menuTextStyle({ size: 15, weight: 600 }))
      .setColor(primary ? MENU_COLORS.darkTextHex : COLORS.textHex)
      .setOrigin(0, 0.5)
    const width = Math.ceil(this.text.width) + PADDING_X * 2

    this.box = scene.add.rectangle(0, 0, width, HEIGHT, primary ? COLORS.accent : COLORS.panel)
    this.box.setOrigin(0).setRounded(RADIUS)
    if (!primary) this.box.setStrokeStyle(1, COLORS.panelBorder)
    this.box.setInteractive({ useHandCursor: true })
    this.box.on('pointerover', () => this.setHover(true))
    this.box.on('pointerout', () => this.setHover(false))
    this.box.on('pointerup', () => onClick?.())
    this.primary = primary

    this.add([this.box, this.text])
    this.setSize(width, HEIGHT)
    scene.add.existing(this)
  }

  setHover(hover) {
    if (this.primary) this.box.setFillStyle(hover ? MENU_COLORS.accentHover : COLORS.accent)
    else this.box.setStrokeStyle(1, hover ? MENU_COLORS.muted : COLORS.panelBorder)
  }

  static get HEIGHT() {
    return HEIGHT
  }
}
