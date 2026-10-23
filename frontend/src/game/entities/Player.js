import { ROOM_MOVEMENT } from '../constants/gameplay'
import { footAt, heightAt, speedFactorAt } from '../systems/depthScale'
import { appearanceFor, facingFromVector } from '../systems/facing'
import { moveWithSlide } from '../systems/walkArea'

/** Khóa atlas nhân vật thám tử (PreloadScene nạp) — DEC-013. */
export const DETECTIVE_ATLAS = Object.freeze({
  key: 'detective',
  textureUrl: 'assets/images/characters/detective.webp',
  atlasUrl: 'assets/images/characters/detective.json',
  /** Chiều cao người trong ô ảnh (px) — dùng để quy đổi tỉ lệ phối cảnh. */
  sourceHeight: 571,
  walkFrames: 6,
})

const WALK_ANIM = 'detective-walk-side'

/** Tạo hoạt ảnh một lần cho cả game (AnimationManager dùng chung). */
export function registerDetectiveAnimations(anims) {
  if (anims.exists(WALK_ANIM)) return
  anims.create({
    key: WALK_ANIM,
    frames: anims.generateFrameNames(DETECTIVE_ATLAS.key, {
      prefix: 'walk-side-',
      start: 0,
      end: DETECTIVE_ATLAS.walkFrames - 1,
    }),
    frameRate: ROOM_MOVEMENT.WALK_ANIM_FPS,
    repeat: -1,
  })
}

/**
 * Thám tử đi trong phòng 2.5D (DEC-013).
 * - Vị trí logic = điểm CHÂN (this.x, this.y); sprite gốc giữa-đáy nên vẽ đúng chỗ chân.
 * - Va chạm: systems/walkArea (đa giác sàn + vật cản), bàn chân co giãn theo phối cảnh.
 * - Điều khiển: update() nhận vector phím; walkTo() đi theo đường do scene tìm (bấm chuột).
 * - Không phải GameObject: giữ logic tách khỏi sprite để dễ đọc/test phần thuần.
 */
export class Player {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ room: object, x: number, y: number, face?: string, depthBase?: number }} options
   */
  constructor(scene, { room, x, y, face = 'down', depthBase = 20 }) {
    this.scene = scene
    this.room = room
    this.x = x
    this.y = y
    this.facing = face
    this.depthBase = depthBase
    this.path = null
    this.onArrive = null
    this.moving = false
    this.bobClock = 0
    this.footAt = ([, fy]) => footAt(room.depth, fy)

    registerDetectiveAnimations(scene.anims)
    this.sprite = scene.add.sprite(x, y, DETECTIVE_ATLAS.key, 'idle-front').setOrigin(0.5, 1)
    this.applyAppearance(0)
  }

  /** Đầu nhân vật (để đặt nhãn "E" phía trên). */
  get headY() {
    return this.y - heightAt(this.room.depth, this.y)
  }

  /** Đi theo danh sách điểm; gọi onArrive khi tới điểm cuối. */
  walkTo(points, onArrive = null) {
    this.path = points && points.length > 0 ? [...points] : null
    this.onArrive = onArrive
    if (!this.path && onArrive) onArrive()
  }

  stop() {
    this.path = null
    this.onArrive = null
  }

  face(direction) {
    this.facing = direction
    this.applyAppearance(0)
  }

  /**
   * @param {number} delta ms
   * @param {{ x: number, y: number }} input vector phím (đã chuẩn hóa, 0 = không bấm)
   */
  update(delta, input = { x: 0, y: 0 }) {
    const speed = ROOM_MOVEMENT.WALK_SPEED * speedFactorAt(this.room.depth, this.y) * (delta / 1000)
    let dirX = 0
    let dirY = 0

    if (input.x !== 0 || input.y !== 0) {
      this.stop() // bấm phím thì bỏ đường đi do chuột
      dirX = input.x
      dirY = input.y
    } else if (this.path) {
      const target = this.path[0]
      const dx = target.x - this.x
      const dy = target.y - this.y
      const distance = Math.hypot(dx, dy)
      if (distance <= Math.max(ROOM_MOVEMENT.ARRIVE_EPSILON, speed)) {
        this.x = target.x
        this.y = target.y
        this.path.shift()
        if (this.path.length === 0) {
          const done = this.onArrive
          this.stop()
          this.moving = false
          this.applyAppearance(delta)
          done?.()
          return
        }
      } else {
        dirX = dx / distance
        dirY = dy / distance
      }
    }

    const wantsToMove = dirX !== 0 || dirY !== 0
    if (wantsToMove) {
      const next = moveWithSlide(this.room, this, dirX * speed, dirY * speed, this.footAt)
      const movedX = next.x - this.x
      const movedY = next.y - this.y
      this.x = next.x
      this.y = next.y
      this.facing = facingFromVector(dirX, dirY, this.facing)
      this.moving = Math.hypot(movedX, movedY) > 0.01
      // Đi theo đường mà bị chặn hẳn (dữ liệu đổi giữa chừng) -> dừng, tránh đứng giậm chân mãi
      if (!this.moving && this.path) this.stop()
    } else {
      this.moving = false
    }
    this.applyAppearance(delta)
  }

  applyAppearance(delta) {
    const look = appearanceFor(this.facing, this.moving)
    const sprite = this.sprite
    if (look.anim) {
      if (sprite.anims.currentAnim?.key !== look.anim || !sprite.anims.isPlaying) {
        sprite.play(look.anim)
      }
    } else {
      sprite.anims.stop()
      sprite.setFrame(look.frame)
    }
    sprite.setFlipX(look.flipX)

    const scale = heightAt(this.room.depth, this.y) / DETECTIVE_ATLAS.sourceHeight
    sprite.setScale(scale)

    let bob = 0
    if (look.bob) {
      this.bobClock += delta
      const phase = (this.bobClock / ROOM_MOVEMENT.BOB_PERIOD_MS) * Math.PI * 2
      bob =
        Math.abs(Math.sin(phase)) *
        ROOM_MOVEMENT.BOB_HEIGHT *
        speedFactorAt(this.room.depth, this.y)
    } else {
      this.bobClock = 0
    }
    sprite.setPosition(this.x, this.y - bob)
    // Vẽ theo độ sâu: chân càng thấp (gần camera) càng nằm trên
    sprite.setDepth(this.depthBase + this.y / 1000)
  }

  destroy() {
    this.sprite.destroy()
  }
}
