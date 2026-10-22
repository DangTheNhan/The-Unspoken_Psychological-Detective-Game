import Phaser from 'phaser'
import { normalizeVolume } from '../systems/settings'
import { COLORS, MENU_COLORS, menuTextStyle } from './theme'

const TRACK_WIDTH = 260
const TRACK_HEIGHT = 4
const KNOB_RADIUS = 8
const HEIGHT = 40
const VALUE_GAP = 16
const VALUE_WIDTH = 36

/**
 * Thanh trượt âm lượng 0–100 bước 5 (DEC-012). Bấm hoặc kéo trên thanh; số hiện bên phải.
 * Gốc (x, y) = góc trên-trái; `width` = thanh + số.
 * Giá trị được kẹp/làm tròn bằng normalizeVolume (systems/settings.js).
 */
export class Slider extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ x?: number, y?: number, value: number, onChange?: (value: number) => void }} config
   */
  constructor(scene, { x = 0, y = 0, value, onChange }) {
    super(scene, x, y)
    this.onChange = onChange
    this.value = normalizeVolume(value) ?? 0
    this.dragging = false
    const midY = HEIGHT / 2

    this.track = scene.add
      .rectangle(0, midY, TRACK_WIDTH, TRACK_HEIGHT, MENU_COLORS.track)
      .setOrigin(0, 0.5)
      .setRounded(2)
    this.fill = scene.add
      .rectangle(0, midY, 0, TRACK_HEIGHT, COLORS.accent)
      .setOrigin(0, 0.5)
      .setRounded(2)
    this.knob = scene.add.circle(0, midY, KNOB_RADIUS, COLORS.accent)
    this.valueText = scene.add
      .text(
        TRACK_WIDTH + VALUE_GAP + VALUE_WIDTH,
        midY,
        '',
        menuTextStyle({ font: 'mono', size: 14 }),
      )
      .setOrigin(1, 0.5)

    // Vùng bấm cao hơn rãnh 4 px để dễ trúng
    this.hit = scene.add
      .zone(-KNOB_RADIUS, 0, TRACK_WIDTH + KNOB_RADIUS * 2, HEIGHT)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
    this.hit.on('pointerdown', (pointer) => {
      this.dragging = true
      this.updateFromPointer(pointer)
    })
    this.onPointerMove = (pointer) => {
      if (this.dragging && pointer.isDown) this.updateFromPointer(pointer)
    }
    this.onPointerUp = () => {
      this.dragging = false
    }
    scene.input.on('pointermove', this.onPointerMove)
    scene.input.on('pointerup', this.onPointerUp)
    scene.input.on('pointerupoutside', this.onPointerUp)

    this.add([this.track, this.fill, this.knob, this.valueText, this.hit])
    this.setSize(TRACK_WIDTH + VALUE_GAP + VALUE_WIDTH, HEIGHT)
    scene.add.existing(this)
    this.refresh()
  }

  updateFromPointer(pointer) {
    // Tọa độ con trỏ đổi về hệ tọa độ của slider (tính cả container cha)
    const matrix = this.getWorldTransformMatrix()
    const localX = pointer.x - matrix.tx
    const next = normalizeVolume((localX / TRACK_WIDTH) * 100)
    if (next === null || next === this.value) return
    this.value = next
    this.refresh()
    this.onChange?.(next)
  }

  setValue(value) {
    this.value = normalizeVolume(value) ?? this.value
    this.refresh()
    return this
  }

  refresh() {
    const x = (this.value / 100) * TRACK_WIDTH
    this.fill.setSize(x, TRACK_HEIGHT)
    this.knob.setX(x)
    this.valueText.setText(String(this.value))
  }

  preDestroy() {
    this.scene?.input?.off('pointermove', this.onPointerMove)
    this.scene?.input?.off('pointerup', this.onPointerUp)
    this.scene?.input?.off('pointerupoutside', this.onPointerUp)
    super.preDestroy?.()
  }
}
