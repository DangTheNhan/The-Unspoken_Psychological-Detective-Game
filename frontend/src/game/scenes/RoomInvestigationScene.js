import Phaser from 'phaser'
import { env } from '@/config/env'
import { createLogger } from '@/shared/logger/logger'
import { GAME_EVENTS } from '../constants/gameEvents'
import { ROOM_MOVEMENT } from '../constants/gameplay'
import { SCENE_KEYS } from '../constants/sceneKeys'
import { EventBus } from '../core/EventBus'
import { getRuntime } from '../core/runtime'
import { FIRST_ROOM_ID, ROOMS } from '../data/rooms'
import { Player } from '../entities/Player'
import { footAt } from '../systems/depthScale'
import { buildGrid, findPath, smoothPath } from '../systems/pathfinding'
import { dialogueFontSizePx, textCharDelayMs } from '../systems/settings'
import { TUTORIAL_EVENTS, advanceTutorial, canExit, isTutorialActive } from '../systems/tutorial'
import { nearestClearPoint } from '../systems/walkArea'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { CredibilityBar } from '../ui/CredibilityBar'
import { DialogueBox } from '../ui/DialogueBox'
import { FloorMarker, HotspotOutline, InteractPrompt, Toast, TutorialHint } from '../ui/RoomWidgets'
import { COLORS, DEPTH, TEXT_STYLES } from '../ui/theme'

const log = createLogger('RoomInvestigationScene')

/** Lớp vẽ: nền 0 · đồ vật/viền 10 · nhân vật 20..21 (theo y chân) · lớp che 30 · HUD 100 · hộp thoại 200. */
const OCCLUDER_DEPTH = 30

/**
 * Màn điều tra 2.5D Point-and-Click — Project.docx §3.2: "Người chơi điều khiển nhân vật hoặc trỏ chuột
 * tương tác với các điểm nóng (Hotspots)". Phòng nạp theo dữ liệu `data/rooms/*` (DEC-013).
 *
 * Điều khiển: ← ↑ → ↓ / W A S D hoặc bấm chuột lên sàn để đi · E / Space / Enter hoặc bấm vào đồ vật
 * để tương tác · N mở Sổ tay (lưu tiến trình nằm trong Sổ tay — DEC-013 Q-R6) · Esc bỏ qua hướng dẫn.
 * Debug (env.debug): F8 hiện vùng đi được + bấm chuột in tọa độ ra console để chỉnh dữ liệu phòng.
 *
 * data: { chapter: number, roomId?: string }
 * PENDING(Q3–Q5, CHAPTER1_PLAN): ra cửa phòng 201 hiện chuyển sang DialogueScene tạm (chưa nối P1_001).
 * PENDING (Capstone 3): Flashback Hiện tại/Quá khứ tại Chương 5 sẽ gắn vào scene này.
 */
export class RoomInvestigationScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.ROOM_INVESTIGATION)
  }

  init(data) {
    this.chapter = data?.chapter
    this.roomId = data?.roomId ?? FIRST_ROOM_ID
  }

  create() {
    this.runtime = getRuntime(this)
    this.room = ROOMS[this.roomId]
    this.createHud()
    if (!this.room) {
      this.createPlaceholder()
      return
    }

    const { width, height } = this.scale
    this.add
      .image(0, 0, this.room.background.key)
      .setOrigin(0)
      .setDisplaySize(width, height)
      .setDepth(DEPTH.BACKGROUND)
    for (const occluder of this.room.occluders) {
      this.add
        .image(occluder.x, occluder.y, occluder.key)
        .setOrigin(0)
        .setDisplaySize(occluder.width, occluder.height)
        .setDepth(OCCLUDER_DEPTH)
    }

    this.footAt = ([, y]) => footAt(this.room.depth, y)
    this.grid = buildGrid(this.room, this.footAt, undefined, width, height)

    const spawn = nearestClearPoint(this.room, [this.room.spawn.x, this.room.spawn.y], this.footAt)
    this.player = new Player(this, {
      room: this.room,
      x: spawn.x,
      y: spawn.y,
      face: this.room.spawn.face,
    })

    this.outline = new HotspotOutline(this)
    this.prompt = new InteractPrompt(this)
    this.toast = new Toast(this)
    this.tutorialHint = new TutorialHint(this)
    this.inspectBox = null
    this.dialog = null
    this.nearHotspot = null
    this.notebookOpen = false

    this.createHotspotZones()
    this.bindInput()
    this.refreshTutorial()

    // Quay lại từ Sổ tay: xóa phím đang "dính" và ghi nhận bước tutorial
    this.events.on(Phaser.Scenes.Events.RESUME, () => this.onResume())
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.player?.destroy())
  }

  // ---------- HUD & dự phòng ----------

  createHud() {
    const { width } = this.scale
    const runtime = this.runtime
    // Nền tối mờ sau HUD: ảnh phòng sáng màu làm chữ nhỏ khó đọc
    this.add
      .rectangle(14, 10, 260, 46, COLORS.background, 0.72)
      .setOrigin(0)
      .setRounded(8)
      .setDepth(DEPTH.HUD - 1)
    const credibilityBar = new CredibilityBar(this, 24, 16, runtime.session.credibility, (value) =>
      runtime.t('hud.credibility', { value }),
    )
    const hint = env.debug
      ? `${runtime.t('room.hint')}   ${runtime.t('room.debugHint')}`
      : runtime.t('room.hint')
    // Giữa phía trên (góc trên phải dành cho Debug Overlay khi chạy dev)
    const hintText = this.add
      .text(width / 2, 22, hint, { ...TEXT_STYLES.small, color: COLORS.textHex })
      .setOrigin(0.5, 0)
      .setDepth(DEPTH.HUD)
    this.add
      .rectangle(width / 2, 12, hintText.width + 24, hintText.height + 20, COLORS.background, 0.72)
      .setOrigin(0.5, 0)
      .setRounded(8)
      .setDepth(DEPTH.HUD - 1)

    const onCredibilityChanged = ({ value }) => credibilityBar.setValue(value)
    EventBus.on(GAME_EVENTS.CREDIBILITY_CHANGED, onCredibilityChanged)
    // Gỡ listener khi rời scene -> tránh rò rỉ và gọi vào object đã hủy
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>
      EventBus.off(GAME_EVENTS.CREDIBILITY_CHANGED, onCredibilityChanged),
    )
  }

  /** Phòng chưa có dữ liệu/asset (ISS-27) -> nền tạm như trước. */
  createPlaceholder() {
    const { width, height } = this.scale
    this.add.rectangle(0, 0, width, height, COLORS.panel).setOrigin(0).setDepth(DEPTH.BACKGROUND)
    this.add
      .text(
        width / 2,
        height / 2,
        this.runtime.t('room.placeholder', { chapter: this.chapter }),
        TEXT_STYLES.heading,
      )
      .setOrigin(0.5)
      .setDepth(DEPTH.BACKGROUND)
    this.input.keyboard?.on('keydown-N', () => this.openNotebook())
  }

  // ---------- Nhập liệu ----------

  bindInput() {
    const keyboard = this.input.keyboard
    if (keyboard) {
      this.keys = keyboard.addKeys('UP,DOWN,LEFT,RIGHT,W,A,S,D')
      keyboard.on('keydown-E', () => this.onInteractKey())
      keyboard.on('keydown-SPACE', () => this.onInteractKey())
      keyboard.on('keydown-ENTER', () => this.onInteractKey())
      keyboard.on('keydown-N', () => {
        if (!this.isBusy()) this.openNotebook()
      })
      keyboard.on('keydown-ESC', () => this.onEscape())
      if (env.debug) keyboard.on('keydown-F8', () => this.toggleDebugOverlay())
    }

    // Bấm chuột lên sàn (không trúng đồ vật) -> tìm đường đi tới
    this.input.on('pointerup', (pointer, currentlyOver) => {
      if (this.debugOverlay)
        log.debug(`Tọa độ: [${Math.round(pointer.x)}, ${Math.round(pointer.y)}]`)
      if (this.inspectBox) {
        this.onInteractKey()
        return
      }
      if (this.isBusy() || currentlyOver.length > 0) return
      this.walkToPoint({ x: pointer.x, y: pointer.y })
    })
  }

  /** Vector phím đã chuẩn hóa (đi chéo không nhanh hơn). */
  readKeyVector() {
    if (!this.keys || this.isBusy()) return { x: 0, y: 0 }
    const k = this.keys
    const x = (k.RIGHT.isDown || k.D.isDown ? 1 : 0) - (k.LEFT.isDown || k.A.isDown ? 1 : 0)
    const y = (k.DOWN.isDown || k.S.isDown ? 1 : 0) - (k.UP.isDown || k.W.isDown ? 1 : 0)
    const length = Math.hypot(x, y)
    return length === 0 ? { x: 0, y: 0 } : { x: x / length, y: y / length }
  }

  isBusy() {
    return Boolean(this.inspectBox || this.dialog)
  }

  // ---------- Vòng lặp ----------

  update(time, delta) {
    if (!this.player) return
    // Giới hạn delta khi tab bị treo lâu -> không "nhảy cóc" (walkArea vẫn chia bước nhỏ)
    this.player.update(Math.min(delta, 50), this.readKeyVector())
    this.updateNearbyHotspot(time)
    this.checkMarker()
  }

  updateNearbyHotspot(time) {
    let nearest = null
    let nearestDistance = ROOM_MOVEMENT.INTERACT_RADIUS
    for (const hotspot of this.room.hotspots) {
      const [sx, sy] = hotspot.stand
      const distance = Math.hypot(this.player.x - sx, this.player.y - sy)
      if (distance <= nearestDistance) {
        nearest = hotspot
        nearestDistance = distance
      }
    }
    this.nearHotspot = this.isBusy() ? null : nearest

    const tutorial = this.runtime.session.tutorial
    const showAll = isTutorialActive(tutorial) && tutorial.step === 'interact'
    const rects = showAll
      ? this.room.hotspots.filter((h) => h.action === 'inspect').map((h) => h.rect)
      : []
    this.outline.draw(rects, this.nearHotspot?.rect ?? null, time)

    if (this.nearHotspot) {
      const label = this.nearHotspot.action === 'exit' ? 'interact.exit' : 'interact.inspect'
      this.prompt.showAt(this.player.x, this.player.headY - 30, this.runtime.t(label))
    } else {
      this.prompt.hide()
    }
  }

  // ---------- Đi lại ----------

  walkToPoint(target, onArrive = null) {
    const path = findPath(this.grid, this.player, target)
    if (!path) return
    const smooth = smoothPath(this.room, this.player, path, this.footAt, target)
    this.player.walkTo(smooth, onArrive)
  }

  createHotspotZones() {
    for (const hotspot of this.room.hotspots) {
      const [x, y, w, h] = hotspot.rect
      const zone = this.add.zone(x, y, w, h).setOrigin(0).setDepth(DEPTH.HOTSPOT)
      zone.setInteractive({ useHandCursor: true })
      zone.on('pointerup', () => {
        if (this.isBusy()) return
        const [sx, sy] = hotspot.stand
        this.walkToPoint({ x: sx, y: sy }, () => {
          this.player.face(hotspot.face)
          this.activateHotspot(hotspot)
        })
      })
    }
  }

  // ---------- Tương tác ----------

  onInteractKey() {
    if (this.dialog) return // hộp xác nhận tự xử lý phím
    if (this.inspectBox) {
      if (this.inspectBox.isTyping) this.inspectBox.completeTyping()
      else this.closeInspect()
      return
    }
    if (this.nearHotspot) {
      this.player.stop()
      this.player.face(this.nearHotspot.face)
      this.activateHotspot(this.nearHotspot)
    }
  }

  activateHotspot(hotspot) {
    if (hotspot.action === 'exit') {
      this.tryExit()
      return
    }
    this.openInspect(hotspot)
  }

  /**
   * Xem đồ vật. Nội dung: DEC-013 Q-R3 — ĐỂ TRỐNG (textKey = null) tới khi người dùng cung cấp;
   * hiển thị nhãn "[Chờ nội dung]" thay vì tự viết.
   */
  openInspect(hotspot) {
    const settings = this.runtime.settings.get()
    this.inspectBox = new DialogueBox(this, {
      charDelayMs: textCharDelayMs(settings),
      fontSize: dialogueFontSizePx(settings),
    })
    const text = hotspot.textKey
      ? this.runtime.t(hotspot.textKey)
      : this.runtime.t('interact.pending')
    this.inspectBox.showLine({ speaker: this.runtime.t(hotspot.nameKey), text })
    this.prompt.hide()
    this.advanceTutorial(TUTORIAL_EVENTS.INSPECTED)
  }

  closeInspect() {
    this.inspectBox?.destroy()
    this.inspectBox = null
  }

  tryExit() {
    const session = this.runtime.session
    if (!canExit(session.tutorial)) {
      this.toast.show(this.runtime.t('room201.exitLocked'))
      return
    }
    this.advanceTutorial(TUTORIAL_EVENTS.EXITED)
    // PENDING(Q3–Q5): nối P1_001 (Hòa gõ cửa) khi tích hợp Chương 1 — tạm dùng DialogueScene hiện có
    this.scene.start(SCENE_KEYS.DIALOGUE, { chapter: this.chapter ?? session.chapter })
  }

  // ---------- Sổ tay ----------

  openNotebook() {
    this.player?.stop()
    this.notebookOpen = true
    this.scene.launch(SCENE_KEYS.NOTEBOOK, { returnTo: this.scene.key })
    this.scene.pause()
  }

  onResume() {
    this.input.keyboard?.resetKeys()
    if (this.notebookOpen) {
      this.notebookOpen = false
      this.advanceTutorial(TUTORIAL_EVENTS.NOTEBOOK_CLOSED)
    }
  }

  // ---------- Tutorial ----------

  advanceTutorial(event) {
    const session = this.runtime.session
    const next = advanceTutorial(session.tutorial, event)
    if (next === session.tutorial) return
    session.tutorial = next // nằm trong file lưu (DEC-013 Q-R9)
    this.refreshTutorial()
  }

  refreshTutorial() {
    const tutorial = this.runtime.session.tutorial
    const t = (key) => this.runtime.t(key)
    if (!isTutorialActive(tutorial)) {
      this.tutorialHint.hide()
      this.marker?.destroy()
      this.marker = null
      return
    }
    this.tutorialHint.show({
      title: t('tutorial.title'),
      body: t(`tutorial.${tutorial.step}`),
      footer: t('tutorial.skipHint'),
    })
    if (tutorial.step === 'move' && !this.marker) {
      const { x, y } = this.room.tutorialMarker
      this.marker = new FloorMarker(this, x, y, ROOM_MOVEMENT.MARKER_RADIUS)
    } else if (tutorial.step !== 'move' && this.marker) {
      this.marker.destroy()
      this.marker = null
    }
  }

  checkMarker() {
    if (!this.marker) return
    const distance = Math.hypot(this.player.x - this.marker.x, this.player.y - this.marker.y)
    if (distance <= ROOM_MOVEMENT.MARKER_RADIUS)
      this.advanceTutorial(TUTORIAL_EVENTS.REACHED_MARKER)
  }

  onEscape() {
    if (this.dialog) return
    if (this.inspectBox) {
      this.closeInspect()
      return
    }
    if (!isTutorialActive(this.runtime.session.tutorial)) return
    const t = (key) => this.runtime.t(key)
    this.player.stop()
    this.dialog = new ConfirmDialog(this, {
      title: t('tutorial.skip.title'),
      body: t('tutorial.skip.body'),
      confirmLabel: t('tutorial.skip.ok'),
      cancelLabel: t('confirm.cancel'),
      onConfirm: () => {
        this.dialog = null
        this.advanceTutorial(TUTORIAL_EVENTS.SKIPPED)
      },
      onCancel: () => {
        this.dialog = null
      },
    })
  }

  // ---------- Debug ----------

  /** F8 (chỉ khi env.debug): vẽ vùng đi được, ô lưới, vật cản, đồ vật, điểm đứng. */
  toggleDebugOverlay() {
    if (this.debugOverlay) {
      this.debugOverlay.destroy()
      this.debugOverlay = null
      return
    }
    const g = this.add.graphics().setDepth(DEPTH.DEBUG)
    const { cell, cols, rows, open } = this.grid
    g.fillStyle(0x3cc85a, 0.18)
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        if (open[r * cols + c]) g.fillRect(c * cell + 1, r * cell + 1, cell - 2, cell - 2)
      }
    }
    const strokePolygon = (points, color) => {
      g.lineStyle(2, color, 1)
      g.strokePoints(
        points.map(([x, y]) => ({ x, y })),
        true,
      )
    }
    strokePolygon(this.room.walkArea, 0x3cc85a)
    for (const obstacle of this.room.obstacles) strokePolygon(obstacle, 0xd9534f)
    for (const hotspot of this.room.hotspots) {
      const [x, y, w, h] = hotspot.rect
      g.lineStyle(1, 0xf2b84b, 1).strokeRect(x, y, w, h)
      g.fillStyle(0xf2b84b, 1).fillCircle(hotspot.stand[0], hotspot.stand[1], 4)
    }
    this.debugOverlay = g
  }
}
