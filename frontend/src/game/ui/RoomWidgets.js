import Phaser from 'phaser'
import { COLORS, DEPTH, MENU_COLORS, menuTextStyle } from './theme'

/**
 * Thành phần giao diện của màn điều tra phòng 2.5D (DEC-013): nhãn tương tác, bảng hướng dẫn,
 * vòng sáng trên sàn, viền sáng đồ vật, thông báo ngắn.
 */

/** Nhãn "[E] Xem" nổi trên đầu nhân vật khi đứng gần đồ vật. */
export class InteractPrompt extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0)
    this.key = scene.add.rectangle(0, 0, 26, 26, COLORS.accent).setOrigin(0, 0.5).setRounded(5)
    this.keyText = scene.add
      .text(13, 0, 'E', menuTextStyle({ size: 15, weight: 700, color: MENU_COLORS.darkTextHex }))
      .setOrigin(0.5)
    this.label = scene.add
      .text(34, 0, '', menuTextStyle({ size: 15, weight: 500 }))
      .setOrigin(0, 0.5)
    this.box = scene.add
      .rectangle(-8, 0, 10, 38, COLORS.background, 0.85)
      .setOrigin(0, 0.5)
      .setRounded(8)
      .setStrokeStyle(1, COLORS.panelBorder)
    this.add([this.box, this.key, this.keyText, this.label])
    this.setDepth(DEPTH.HUD).setVisible(false)
    scene.add.existing(this)
  }

  showAt(x, y, text) {
    this.label.setText(text)
    const width = 34 + this.label.width + 10
    this.box.setSize(width + 8, 38)
    this.setPosition(Math.round(x - width / 2), Math.round(y))
    this.setVisible(true)
  }

  hide() {
    this.setVisible(false)
  }
}

/** Bảng hướng dẫn gọn ở góc trên trái (dưới thanh Uy tín). */
export class TutorialHint extends Phaser.GameObjects.Container {
  constructor(scene, { x = 14, y = 64, width = 440 } = {}) {
    super(scene, x, y)
    this.panelWidth = width
    this.panel = scene.add
      .rectangle(0, 0, width, 10, COLORS.panel, 0.92)
      .setOrigin(0)
      .setRounded(8)
      .setStrokeStyle(1, COLORS.panelBorder)
    this.bar = scene.add.rectangle(0, 0, 3, 10, COLORS.accent).setOrigin(0)
    this.title = scene.add
      .text(16, 12, '', menuTextStyle({ font: 'mono', size: 11, letterSpacing: 2 }))
      .setColor(COLORS.accentHex)
    this.body = scene.add.text(16, 32, '', menuTextStyle({ size: 15, wrapWidth: width - 32 }))
    this.footer = scene.add
      .text(16, 0, '', menuTextStyle({ font: 'mono', size: 11 }))
      .setColor(COLORS.mutedHex)
    this.add([this.panel, this.bar, this.title, this.body, this.footer])
    this.setDepth(DEPTH.HUD).setVisible(false)
    scene.add.existing(this)
  }

  show({ title, body, footer }) {
    this.title.setText(title)
    this.body.setText(body)
    this.footer.setText(footer).setY(this.body.y + this.body.height + 8)
    const height = this.footer.y + this.footer.height + 12
    this.panel.setSize(this.panelWidth, height)
    this.bar.setSize(3, height)
    this.setVisible(true)
  }

  hide() {
    this.setVisible(false)
  }
}

/** Vòng sáng nhấp nháy nhẹ trên sàn (bước "di chuyển" của tutorial). */
export class FloorMarker extends Phaser.GameObjects.Container {
  constructor(scene, x, y, radius = 40) {
    super(scene, x, y)
    this.ring = scene.add.ellipse(0, 0, radius * 2, radius * 0.7, COLORS.accent, 0.3)
    this.ring.setStrokeStyle(3, COLORS.accent, 1)
    this.add(this.ring)
    this.setDepth(DEPTH.BACKGROUND + 1)
    scene.add.existing(this)
    this.pulse = scene.tweens.add({
      targets: this.ring,
      scaleX: 1.15,
      scaleY: 1.15,
      alpha: 0.6,
      duration: 700,
      yoyo: true,
      repeat: -1,
    })
  }

  preDestroy() {
    this.pulse?.remove()
    super.preDestroy?.()
  }
}

/** Viền sáng quanh vùng đồ vật (rect = [x, y, w, h]). strong = đồ vật đang ở gần nhất. */
export class HotspotOutline extends Phaser.GameObjects.Graphics {
  constructor(scene) {
    super(scene)
    this.setDepth(DEPTH.HOTSPOT)
    scene.add.existing(this)
  }

  draw(rects, strongRect = null, time = 0) {
    this.clear()
    const pulse = 0.35 + 0.25 * Math.sin(time / 260)
    for (const rect of rects) {
      if (rect === strongRect) continue
      this.lineStyle(1.5, COLORS.accent, pulse)
      this.strokeRoundedRect(rect[0], rect[1], rect[2], rect[3], 6)
    }
    if (strongRect) {
      this.lineStyle(2.5, COLORS.accent, 0.95)
      this.strokeRoundedRect(strongRect[0], strongRect[1], strongRect[2], strongRect[3], 6)
    }
  }
}

/** Thông báo ngắn giữa-dưới màn hình, tự ẩn. */
export class Toast extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, scene.scale.width / 2, scene.scale.height - 120)
    this.text = scene.add.text(0, 0, '', menuTextStyle({ size: 15 })).setOrigin(0.5)
    this.box = scene.add
      .rectangle(0, 0, 10, 40, COLORS.background, 0.9)
      .setRounded(8)
      .setStrokeStyle(1, COLORS.panelBorder)
    this.add([this.box, this.text])
    this.setDepth(DEPTH.OVERLAY).setVisible(false)
    scene.add.existing(this)
  }

  show(message, durationMs = 2200) {
    this.text.setText(message)
    this.box.setSize(this.text.width + 36, 40)
    this.setVisible(true).setAlpha(1)
    this.scene.tweens.killTweensOf(this)
    this.scene.tweens.add({ targets: this, alpha: 0, delay: durationMs, duration: 300 })
  }
}
