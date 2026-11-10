import Phaser from 'phaser'
import { COLORS, MENU_COLORS, menuTextStyle } from './theme'

const TRACK_W = 44
const TRACK_H = 24
const KNOB = 16
const HEIGHT = 44
const GAP = 12

/**
 * Công tắc Bật/Tắt (DEC-012): chữ trạng thái + rãnh bo tròn có núm.
 * Gốc (x, y) = góc trên-trái; `width` để canh phải. Bấm vào chữ hoặc rãnh đều đổi trạng thái.
 */
export class Toggle extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ x?: number, y?: number, value: boolean, labels: { on: string, off: string },
   *           onChange?: (value: boolean) => void }} config
   */
  constructor(scene, { x = 0, y = 0, value, labels, onChange }) {
    super(scene, x, y)
    this.value = Boolean(value)
    this.labels = labels
    const midY = HEIGHT / 2

    // Đo chữ dài hơn để vị trí rãnh không nhảy khi đổi Bật/Tắt
    const style = menuTextStyle({ size: 14 })
    const measure = scene.add.text(0, 0, labels.on, style)
    const labelWidth = Math.ceil(Math.max(measure.width, measure.setText(labels.off).width))
    measure.destroy()

    this.label = scene.add.text(labelWidth, midY, '', style).setOrigin(1, 0.5)
    const trackX = labelWidth + GAP
    this.track = scene.add
      .rectangle(trackX, midY, TRACK_W, TRACK_H, MENU_COLORS.track)
      .setOrigin(0, 0.5)
      .setRounded(TRACK_H / 2)
    this.knob = scene.add.circle(0, midY, KNOB / 2, MENU_COLORS.muted)
    this.trackX = trackX

    const width = trackX + TRACK_W
    this.hit = scene.add
      .zone(0, 0, width, HEIGHT)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
    this.hit.on('pointerup', () => {
      this.setValue(!this.value)
      onChange?.(this.value)
    })

    this.add([this.label, this.track, this.knob, this.hit])
    this.setSize(width, HEIGHT)
    scene.add.existing(this)
    this.refresh()
  }

  setValue(value) {
    this.value = Boolean(value)
    this.refresh()
    return this
  }

  refresh() {
    const on = this.value
    this.label.setText(on ? this.labels.on : this.labels.off)
    this.label.setColor(on ? COLORS.textHex : COLORS.mutedHex)
    this.track.setFillStyle(on ? COLORS.accent : MENU_COLORS.track)
    this.track.setStrokeStyle(1, on ? COLORS.accent : COLORS.panelBorder)
    const pad = (TRACK_H - KNOB) / 2
    this.knob.setX(this.trackX + pad + KNOB / 2 + (on ? TRACK_W - KNOB - pad * 2 : 0))
    this.knob.setFillStyle(on ? COLORS.background : MENU_COLORS.muted)
  }
}
