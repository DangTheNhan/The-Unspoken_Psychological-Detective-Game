import Phaser from 'phaser'
import { COLORS, MENU_COLORS, menuTextStyle } from './theme'

const HEIGHT = 40
const MIN_SEGMENT_WIDTH = 88
const PADDING_X = 16
const RADIUS = 6

/**
 * Nhóm nút chọn-1 (ngôn ngữ, tốc độ chữ, cỡ chữ) — DEC-012.
 * Gốc (x, y) = góc trên-trái; đọc `width` để canh phải trong dòng thiết lập.
 */
export class SegmentedControl extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ x?: number, y?: number, options: { value: string, label: string }[], value: string,
   *           onChange?: (value: string) => void }} config
   */
  constructor(scene, { x = 0, y = 0, options, value, onChange }) {
    super(scene, x, y)
    this.value = value
    this.segments = []

    let cursor = 0
    for (const option of options) {
      const label = scene.add
        .text(0, HEIGHT / 2, option.label, menuTextStyle({ size: 14 }))
        .setOrigin(0.5)
      const segmentWidth = Math.max(MIN_SEGMENT_WIDTH, Math.ceil(label.width) + PADDING_X * 2)
      // Lùi 1 px vào trong để nền ô chọn không lấn ra ngoài góc bo của viền
      const fill = scene.add
        .rectangle(cursor + 1, 1, segmentWidth - 2, HEIGHT - 2, COLORS.accent, 0)
        .setOrigin(0)
        .setInteractive({ useHandCursor: true })
      label.setX(cursor + segmentWidth / 2)
      fill.on('pointerover', () => this.setHover(option.value, true))
      fill.on('pointerout', () => this.setHover(option.value, false))
      fill.on('pointerup', () => {
        if (this.value === option.value) return
        this.setValue(option.value)
        onChange?.(option.value)
      })
      this.segments.push({ value: option.value, fill, label, x: cursor, width: segmentWidth })
      cursor += segmentWidth
    }

    // Viền ngoài bo góc + vạch ngăn giữa các ô
    const border = scene.add.graphics()
    border.lineStyle(1, COLORS.panelBorder, 1)
    border.strokeRoundedRect(0, 0, cursor, HEIGHT, RADIUS)
    for (const segment of this.segments.slice(1)) {
      border.lineBetween(segment.x, 0, segment.x, HEIGHT)
    }

    this.add([...this.segments.flatMap((s) => [s.fill, s.label]), border])
    this.setSize(cursor, HEIGHT)
    scene.add.existing(this)
    this.refresh()
  }

  setValue(value) {
    this.value = value
    this.refresh()
    return this
  }

  setHover(value, hover) {
    const segment = this.segments.find((s) => s.value === value)
    if (!segment || segment.value === this.value) return
    segment.fill.setFillStyle(MENU_COLORS.hover, hover ? 1 : 0)
  }

  refresh() {
    for (const segment of this.segments) {
      const selected = segment.value === this.value
      segment.fill.setFillStyle(COLORS.accent, selected ? 1 : 0)
      segment.label
        .setColor(selected ? MENU_COLORS.darkTextHex : COLORS.textHex)
        .setFontStyle(selected ? '600' : 'normal')
    }
  }

  static get HEIGHT() {
    return HEIGHT
  }
}
