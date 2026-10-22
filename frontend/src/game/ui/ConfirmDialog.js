import Phaser from 'phaser'
import { PanelButton } from './PanelButton'
import { COLORS, DEPTH, MENU_COLORS, menuTextStyle } from './theme'

const WIDTH = 520
const PADDING = 32
const GAP = 12

/**
 * Hộp xác nhận giữa màn hình (DEC-012) — vd "Bắt đầu ván mới?" khi trình duyệt đã có bản lưu.
 * Phủ nền tối chặn bấm xuyên xuống menu. Phím: Enter = xác nhận, Esc = hủy.
 * Tự hủy sau khi chọn; gọi onConfirm hoặc onCancel.
 */
export class ConfirmDialog extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ title: string, body: string, confirmLabel: string, cancelLabel: string,
   *           onConfirm?: () => void, onCancel?: () => void }} options
   */
  constructor(scene, { title, body, confirmLabel, cancelLabel, onConfirm, onCancel }) {
    super(scene, 0, 0)
    const { width, height } = scene.scale
    this.setDepth(DEPTH.OVERLAY)

    const shade = scene.add
      .rectangle(0, 0, width, height, MENU_COLORS.overlay, 0.78)
      .setOrigin(0)
      .setInteractive() // chặn bấm xuống các nút phía sau

    const titleText = scene.add.text(
      0,
      0,
      title,
      menuTextStyle({ font: 'display', size: 26, weight: 700 }),
    )
    const bodyText = scene.add.text(
      0,
      0,
      body,
      menuTextStyle({ size: 15, color: COLORS.mutedHex, wrapWidth: WIDTH - PADDING * 2 }),
    )
    bodyText.setLineSpacing(4)

    const finish = (callback) => {
      this.destroy()
      callback?.()
    }
    const cancel = new PanelButton(scene, { label: cancelLabel, onClick: () => finish(onCancel) })
    const confirm = new PanelButton(scene, {
      label: confirmLabel,
      variant: 'primary',
      onClick: () => finish(onConfirm),
    })

    const panelHeight =
      PADDING + titleText.height + 12 + bodyText.height + 28 + PanelButton.HEIGHT + PADDING
    const left = (width - WIDTH) / 2
    const top = (height - panelHeight) / 2
    const panel = scene.add
      .rectangle(left, top, WIDTH, panelHeight, COLORS.panel)
      .setOrigin(0)
      .setRounded(10)
      .setStrokeStyle(1, COLORS.panelBorder)

    titleText.setPosition(left + PADDING, top + PADDING)
    bodyText.setPosition(left + PADDING, titleText.y + titleText.height + 12)
    const buttonsY = top + panelHeight - PADDING - PanelButton.HEIGHT
    confirm.setPosition(left + WIDTH - PADDING - confirm.width, buttonsY)
    cancel.setPosition(confirm.x - GAP - cancel.width, buttonsY)

    this.add([shade, panel, titleText, bodyText, cancel, confirm])
    scene.add.existing(this)

    this.keyHandlers = {
      'keydown-ENTER': () => finish(onConfirm),
      'keydown-ESC': () => finish(onCancel),
    }
    for (const [event, handler] of Object.entries(this.keyHandlers)) {
      scene.input.keyboard?.on(event, handler)
    }
  }

  preDestroy() {
    for (const [event, handler] of Object.entries(this.keyHandlers ?? {})) {
      this.scene?.input?.keyboard?.off(event, handler)
    }
    super.preDestroy?.()
  }
}
