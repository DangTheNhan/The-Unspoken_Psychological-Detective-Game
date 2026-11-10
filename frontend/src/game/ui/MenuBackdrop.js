import Phaser from 'phaser'
import { COLORS, DEPTH, MENU_COLORS, menuTextStyle } from './theme'

/**
 * Cảnh nền menu chính — "21:35, đêm mưa ở khu trọ" (DEC-012): hành lang tối, cửa sổ mưa,
 * đèn tuýp chập chờn, cửa 204 hé sáng. Không đặt manh mối/vật chứng lên cảnh (tránh lộ cốt truyện).
 *
 * TẠM: vẽ bằng hình khối (Graphics) vì chưa có ảnh nền (ISS-27). Có ảnh thật -> thay toàn bộ lớp
 * này bằng một this.add.image(...) và giữ nguyên MainMenuScene.
 * Tọa độ theo khung logic 1280×720 (gameConfig). Người dùng hệ điều hành bật "giảm chuyển động"
 * (prefers-reduced-motion) -> không mưa chạy, không nhấp nháy.
 */
const SCENE_LEFT = 500
const FLOOR_Y = 552
const WINDOW = Object.freeze({ x: 610, y: 132, w: 200, h: 260, frame: 10 })
const DOOR = Object.freeze({ x: 930, y: 184, w: 200, h: 368, frame: 8, panelW: 170 })
const TUBE = Object.freeze({ x: 810, y: 40, w: 240, h: 6 })
const RAIN = Object.freeze({ DROPS: 34, SPEED: 520, DRIFT: -0.22 }) // px/giây, độ nghiêng

const WALL_TOP = 0x1e1b24
const WALL_BOTTOM = 0x141218
const FRAME = 0x2b2631
const GLASS_TOP = 0x27313e
const GLASS_BOTTOM = 0x1a2029
const FLOOR = 0x100f13
const FLOOR_EDGE = 0x2a2530
const DOOR_FRAME = 0x2e2833
const DOOR_GAP = 0x0c0b0e
const DOOR_PANEL = 0x221e27
const TUBE_LIGHT = 0xe6eee9
const HANDLE = 0x6d6257

export function prefersReducedMotion() {
  try {
    return Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  } catch {
    return false
  }
}

export class MenuBackdrop {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ note?: string }} [options] note — nhãn "ảnh nền tạm" (đã dịch)
   */
  constructor(scene, { note = '' } = {}) {
    this.scene = scene
    this.animated = !prefersReducedMotion()
    const { width, height } = scene.scale

    const g = scene.add.graphics().setDepth(DEPTH.BACKGROUND)
    this.drawRoom(g, width, height)

    this.tube = scene.add
      .rectangle(TUBE.x, TUBE.y, TUBE.w, TUBE.h, TUBE_LIGHT)
      .setOrigin(0)
      .setRounded(3)
      .setDepth(DEPTH.BACKGROUND)
    this.tubeGlow = scene.add.graphics().setDepth(DEPTH.BACKGROUND)
    this.drawTubeGlow(this.tubeGlow)

    this.rain = scene.add.graphics().setDepth(DEPTH.BACKGROUND)
    this.drops = this.createDrops()
    this.drawRain()

    // Lớp mờ dần sang trái (để cột menu dễ đọc) + mờ đáy
    const fade = scene.add.graphics().setDepth(DEPTH.BACKGROUND)
    this.drawFades(fade, width, height)

    this.note = scene.add
      .text(
        width - 40,
        height - 72,
        note,
        menuTextStyle({ font: 'mono', size: 11, letterSpacing: 1 }),
      )
      .setColor(COLORS.mutedHex)
      .setOrigin(1, 1)
      .setDepth(DEPTH.BACKGROUND)
    const bounds = this.note.getBounds()
    scene.add
      .rectangle(bounds.x - 8, bounds.y - 2, bounds.width + 16, bounds.height + 4)
      .setOrigin(0)
      .setStrokeStyle(1, COLORS.panelBorder)
      .setDepth(DEPTH.BACKGROUND)

    if (this.animated) this.scheduleFlicker()
  }

  drawRoom(g, width, height) {
    g.fillStyle(COLORS.background).fillRect(0, 0, width, height)
    g.fillGradientStyle(WALL_TOP, WALL_TOP, WALL_BOTTOM, WALL_BOTTOM, 1)
    g.fillRect(SCENE_LEFT, 0, width - SCENE_LEFT, height)

    // Máng đèn
    g.fillStyle(FRAME).fillRect(TUBE.x - 10, TUBE.y - 10, TUBE.w + 20, 10)

    // Cửa sổ: khung, kính, song cửa, bậu
    const { x, y, w, h, frame } = WINDOW
    g.fillStyle(FRAME).fillRect(x, y, w, h)
    g.fillGradientStyle(GLASS_TOP, GLASS_TOP, GLASS_BOTTOM, GLASS_BOTTOM, 1)
    g.fillRect(x + frame, y + frame, w - frame * 2, h - frame * 2)
    g.fillStyle(FRAME)
    g.fillRect(x + w / 2 - 5, y, 10, h)
    g.fillRect(x, y + frame + 108, w, 10)
    g.fillRect(x - 10, y + h, w + 20, 8)

    // Sàn + vệt sáng hắt ra từ cửa 204
    g.fillStyle(FLOOR).fillRect(SCENE_LEFT, FLOOR_Y, width - SCENE_LEFT, height - FLOOR_Y)
    g.fillStyle(FLOOR_EDGE).fillRect(SCENE_LEFT, FLOOR_Y, width - SCENE_LEFT, 1)
    const spillX = DOOR.x + DOOR.w * 0.75
    // Nhiều lớp mỏng chồng nhau = quầng sáng mềm (Graphics không có gradient tròn)
    for (let i = 16; i >= 1; i -= 1) {
      g.fillStyle(COLORS.accent, 0.012)
      g.fillEllipse(spillX, FLOOR_Y + 2, 26 * i, 10 * i)
    }

    // Cửa 204: khung, khe tối, cánh cửa, khe sáng
    const d = DOOR
    g.fillStyle(DOOR_FRAME).fillRect(d.x, d.y, d.w, d.h)
    g.fillStyle(DOOR_GAP).fillRect(d.x + d.frame, d.y + d.frame, d.w - d.frame * 2, d.h - d.frame)
    const innerX = d.x + d.frame
    const lightX = innerX + d.panelW
    const lightW = d.w - d.frame * 2 - d.panelW
    for (let i = 8; i >= 1; i -= 1) {
      g.fillStyle(COLORS.accent, 0.022)
      g.fillRect(lightX - i * 3, d.y + d.frame - i * 2, lightW + i * 6, d.h - d.frame + i * 2)
    }
    g.fillStyle(COLORS.accent, 0.85).fillRect(lightX, d.y + d.frame, lightW, d.h - d.frame)
    g.fillStyle(0x000000, 0.35).fillRect(innerX + d.panelW, d.y + d.frame, 6, d.h - d.frame)
    g.fillStyle(DOOR_PANEL).fillRect(innerX, d.y + d.frame, d.panelW, d.h - d.frame)
    g.fillStyle(HANDLE).fillCircle(innerX + d.panelW - 21, d.y + d.frame + 195, 5)

    const plateX = innerX + d.panelW / 2
    const plate = this.scene.add
      .text(plateX, d.y + d.frame + 46, '204', menuTextStyle({ font: 'mono', size: 14 }))
      .setColor(MENU_COLORS.plateHex)
      .setLetterSpacing(2)
      .setOrigin(0.5, 0)
      .setDepth(DEPTH.BACKGROUND)
    const pb = plate.getBounds()
    this.scene.add
      .rectangle(pb.x - 8, pb.y, pb.width + 16, pb.height)
      .setOrigin(0)
      .setStrokeStyle(1, COLORS.panelBorder)
      .setDepth(DEPTH.BACKGROUND)
  }

  drawTubeGlow(g) {
    g.clear()
    for (let i = 14; i >= 1; i -= 1) {
      g.fillStyle(TUBE_LIGHT, 0.01)
      g.fillEllipse(TUBE.x + TUBE.w / 2, TUBE.y + 6, TUBE.w * 0.6 + i * 26, 12 + i * 16)
    }
  }

  drawFades(g, width, height) {
    const bg = COLORS.background
    const fadeW = width - SCENE_LEFT
    const firstW = Math.round(fadeW * 0.16)
    const secondW = Math.round(fadeW * 0.36)
    g.fillGradientStyle(bg, bg, bg, bg, 1, 0.82, 1, 0.82)
    g.fillRect(SCENE_LEFT, 0, firstW, height)
    g.fillGradientStyle(bg, bg, bg, bg, 0.82, 0, 0.82, 0)
    g.fillRect(SCENE_LEFT + firstW, 0, secondW, height)
    const bottomH = Math.round(height * 0.22)
    g.fillGradientStyle(bg, bg, bg, bg, 0, 0, 0.9, 0.9)
    g.fillRect(SCENE_LEFT, height - bottomH, fadeW, bottomH)
  }

  /** Mưa chỉ nằm trong ô kính cửa sổ. */
  glassRect() {
    const { x, y, w, h, frame } = WINDOW
    return { left: x + frame, top: y + frame, right: x + w - frame, bottom: y + h - frame }
  }

  createDrops() {
    const glass = this.glassRect()
    return Array.from({ length: RAIN.DROPS }, () => ({
      x: Phaser.Math.Between(glass.left, glass.right + 40),
      y: Phaser.Math.Between(glass.top, glass.bottom),
      len: Phaser.Math.Between(12, 26),
      speed: RAIN.SPEED * Phaser.Math.FloatBetween(0.75, 1.15),
    }))
  }

  drawRain() {
    const glass = this.glassRect()
    const g = this.rain
    g.clear()
    g.lineStyle(1, 0xc4d2e4, 0.22)
    for (const drop of this.drops) {
      const x2 = drop.x + drop.len * RAIN.DRIFT
      const y2 = drop.y + drop.len
      const inside =
        Math.min(drop.x, x2) >= glass.left &&
        Math.max(drop.x, x2) <= glass.right &&
        drop.y >= glass.top &&
        y2 <= glass.bottom
      if (inside) g.lineBetween(drop.x, drop.y, x2, y2)
    }
  }

  /** Gọi từ Scene.update(time, delta). */
  update(_time, delta) {
    if (!this.animated) return
    const glass = this.glassRect()
    const step = delta / 1000
    for (const drop of this.drops) {
      drop.y += drop.speed * step
      drop.x += drop.speed * step * RAIN.DRIFT
      if (drop.y > glass.bottom || drop.x < glass.left - 30) {
        drop.y = glass.top - Phaser.Math.Between(0, 60)
        drop.x = Phaser.Math.Between(glass.left, glass.right + 40)
      }
    }
    this.drawRain()
  }

  /** Đèn tuýp chập chờn vài giây một lần (không chớp liên tục để đỡ khó chịu). */
  scheduleFlicker() {
    this.scene.time.delayedCall(Phaser.Math.Between(4000, 8000), () => {
      const targets = [this.tube, this.tubeGlow]
      this.scene.tweens.chain({
        targets,
        tweens: [
          { alpha: 0.35, duration: 60 },
          { alpha: 0.95, duration: 80 },
          { alpha: 0.45, duration: 60 },
          { alpha: 1, duration: 120 },
        ],
        onComplete: () => this.scheduleFlicker(),
      })
    })
  }
}
