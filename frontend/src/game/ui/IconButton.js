import Phaser from 'phaser'
import { COLORS, MENU_COLORS } from './theme'

const SIZE = 44

/**
 * Nút tròn có biểu tượng vẽ bằng nét (không dùng ảnh/emoji) — DEC-012.
 * icon: 'speaker' (đang có tiếng) · 'speakerMuted' (đã tắt tiếng) · 'close' (X).
 * Gốc (x, y) = TÂM nút.
 */
export class IconButton extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ x: number, y: number, icon: string, bordered?: boolean, onClick?: () => void }} options
   */
  constructor(scene, { x, y, icon, bordered = true, onClick }) {
    super(scene, x, y)
    this.bordered = bordered
    this.circle = scene.add.circle(0, 0, SIZE / 2, COLORS.background, bordered ? 0.6 : 0)
    if (bordered) this.circle.setStrokeStyle(1, COLORS.panelBorder)
    this.circle.setInteractive({ useHandCursor: true })
    this.circle.on('pointerover', () => this.setHover(true))
    this.circle.on('pointerout', () => this.setHover(false))
    this.circle.on('pointerup', () => onClick?.())

    this.glyph = scene.add.graphics()
    this.add([this.circle, this.glyph])
    scene.add.existing(this)
    this.hover = false
    this.setIcon(icon)
  }

  setHover(hover) {
    this.hover = hover
    if (this.bordered) this.circle.setStrokeStyle(1, hover ? COLORS.accent : COLORS.panelBorder)
    else this.circle.setFillStyle(MENU_COLORS.hover, hover ? 1 : 0)
    this.drawGlyph()
  }

  setIcon(icon) {
    this.icon = icon
    this.drawGlyph()
    return this
  }

  drawGlyph() {
    const text = 0xf4efe6 // = COLORS.textHex dạng số
    const color = this.hover
      ? this.bordered
        ? COLORS.accent
        : text
      : this.bordered
        ? text
        : MENU_COLORS.muted
    const g = this.glyph
    g.clear()
    g.lineStyle(1.6, color, 1)

    if (this.icon === 'close') {
      g.lineBetween(-6, -6, 6, 6)
      g.lineBetween(6, -6, -6, 6)
      return
    }
    // Loa: thân + phễu (tọa độ theo khung 24×24 của bản thiết kế, tâm ở 0,0)
    g.strokePoints(
      [
        { x: -8, y: -3 },
        { x: -4, y: -3 },
        { x: 1, y: -7 },
        { x: 1, y: 7 },
        { x: -4, y: 3 },
        { x: -8, y: 3 },
      ],
      true,
    )
    if (this.icon === 'speakerMuted') {
      g.lineBetween(5, -3, 10, 3)
      g.lineBetween(10, -3, 5, 3)
    } else {
      g.beginPath()
      g.arc(1, 0, 5, -Math.PI / 4, Math.PI / 4)
      g.strokePath()
      g.beginPath()
      g.arc(1, 0, 8.5, -Math.PI / 4, Math.PI / 4)
      g.strokePath()
    }
  }
}
